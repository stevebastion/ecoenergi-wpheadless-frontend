import { wpQuery } from '$lib/server/wp';
import { adaptServiceCard } from '$lib/server/adapters';
import { SITEMAP_QUERY } from '$lib/server/queries';
import { siteOrigin } from '$lib/utils/resolveSeo';

export const prerender = false;

const esc = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const indexable = (node) => node?.seo?.metaRobotsNoindex !== 'noindex';

/** WP page URI -> frontend path, or null when the frontend has no such route. */
function pagePath(uri = '') {
	if (uri === '/') return '/';
	// /about/, /contact/, /any-page-builder-page/
	if (/^\/[^/]+\/$/.test(uri)) {
		// /our-services/ only redirects to the default landing — not a page.
		return uri === '/our-services/' ? null : uri.replace(/\/$/, '');
	}
	// /our-services/residential/
	if (/^\/our-services\/[^/]+\/$/.test(uri)) return uri.replace(/\/$/, '');
	return null;
}

export async function GET({ url }) {
	const origin = siteOrigin(url.origin);
	const data = await wpQuery(SITEMAP_QUERY, {}, { required: false, fallback: null });

	const entries = [];
	const add = (path, modified) => path && entries.push({ path, modified });

	(data?.pages?.nodes || []).filter(indexable).forEach((n) => add(pagePath(n.uri), n.modified));
	(data?.posts?.nodes || [])
		.filter(indexable)
		.forEach((n) => add(`/articles/${n.slug}`, n.modified));
	(data?.caseStudies?.nodes || [])
		.filter(indexable)
		.forEach((n) => add(`/case-studies/${n.slug}`, n.modified));
	(data?.services?.nodes || []).filter(indexable).forEach((n) => {
		const svc = adaptServiceCard(n);
		if (svc.category) add(`/our-services/${svc.category}/${svc.slug}`, n.modified);
	});

	// List pages have no WP page behind them.
	['/articles', '/case-studies'].forEach((p) => add(p));

	const seen = new Set();
	const urls = entries
		.filter((e) => !seen.has(e.path) && seen.add(e.path))
		.map(
			(e) =>
				`  <url><loc>${esc(origin + e.path)}</loc>${
					e.modified ? `<lastmod>${new Date(e.modified + 'Z').toISOString()}</lastmod>` : ''
				}</url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8',
				'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
			}
		}
	);
}
