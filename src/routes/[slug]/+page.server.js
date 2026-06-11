import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptPage } from '$lib/server/adapters';
import { PAGE_BY_URI_QUERY } from '$lib/server/queries';

// Allow only lowercase kebab-case slugs.
const CMS_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function load({ params }) {
	const { slug } = params;

	if (!CMS_SLUG_REGEX.test(slug)) {
		throw error(404);
	}

	// WordPress addresses Pages by URI, e.g. `/about-us/`.
	const data = await wpQuery(
		PAGE_BY_URI_QUERY,
		{ uri: `/${slug}/` },
		{ required: false, fallback: null }
	);

	if (!data?.page) {
		throw error(404);
	}

	return {
		pageData: adaptPage(data.page)
	};
}
