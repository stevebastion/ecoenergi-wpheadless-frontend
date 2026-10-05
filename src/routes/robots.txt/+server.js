import { env } from '$env/dynamic/private';
import { siteOrigin } from '$lib/utils/resolveSeo';

export const prerender = false;

/** Only the production deployment may be crawled (Vercel previews must not be). */
const isProduction = () => !env.VERCEL_ENV || env.VERCEL_ENV === 'production';

export function GET({ url }) {
	const body = isProduction()
		? `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin(url.origin)}/sitemap.xml\n`
		: `User-agent: *\nDisallow: /\n`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
