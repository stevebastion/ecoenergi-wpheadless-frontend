import { wpQuery, adaptMenu } from '$lib/server/wp';
import { adaptGlobal, adaptCaseStudyCard, adaptArticleCard } from '$lib/server/adapters';
import { LAYOUT_QUERY } from '$lib/server/queries';

export const prerender = false;
export const ssr = true;

export async function load({ depends }) {
	depends('app:global');
	depends('app:navigation');
	depends('app:case-studies');
	depends('app:articles');

	// Cache-control is set globally in hooks.server.js.

	const data = await wpQuery(LAYOUT_QUERY, {}, { required: false, fallback: {} });

	// `adaptGlobal` returns null when Site Settings is empty/unreachable; fall
	// back to an empty object so consumers can read keys without null-checking.
	const global = adaptGlobal(data?.siteSettings?.siteSettingsFields) ?? {};

	return {
		// Wrapped in `{ data }` to mirror the old Strapi single-type response.
		global: { data: global },
		navigation: {
			main: adaptMenu(data?.primary),
			footer: [adaptMenu(data?.footer1), adaptMenu(data?.footer2), adaptMenu(data?.footer3)]
		},
		latestCaseStudies: {
			data: (data?.caseStudies?.nodes || []).map(adaptCaseStudyCard)
		},
		latestArticles: {
			data: (data?.posts?.nodes || []).map(adaptArticleCard)
		}
	};
}
