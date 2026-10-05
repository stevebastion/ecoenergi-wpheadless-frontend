import { wpQuery } from '$lib/server/wp';
import { SITEMAP_QUERY } from '$lib/server/queries';
import { collectEntries, buildSitemapXml } from '$lib/server/sitemap';
import { siteOrigin } from '$lib/utils/resolveSeo';

export const prerender = false;

export async function GET({ url }) {
	const data = await wpQuery(SITEMAP_QUERY, {}, { required: false, fallback: null });
	const xml = buildSitemapXml(collectEntries(data), siteOrigin(url.origin));

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400'
		}
	});
}
