import { PUBLIC_SITE_URL, PUBLIC_WP_URL } from '$env/static/public';

export const SITE_NAME = 'Eco Energi';

/**
 * Public origin of THIS site (no trailing slash). Falls back to the request
 * origin so a missing env var never produces a canonical pointing nowhere.
 */
export function siteOrigin(requestOrigin = '') {
	return (PUBLIC_SITE_URL || requestOrigin || '').replace(/\/+$/, '');
}

/**
 * Merge page-level SEO (Yoast, via `adaptYoastSeo`) over any fallbacks.
 *
 * Canonical is ALWAYS built from this site's origin + the current path. Yoast's
 * own canonical points at the WordPress backend domain, which is not the page
 * we want ranked.
 */
export function resolveSeo({
	pageSeo = null,
	globalSeo = null,
	pageTitle = '',
	pageDescription = '',
	pageImage = null,
	origin = '',
	path = '/',
	search = ''
}) {
	const base = siteOrigin(origin);

	// Paginated lists canonicalise to themselves (?page=N), page 1 to the bare path.
	const pageParam = new URLSearchParams(search).get('page');
	const query = pageParam && pageParam !== '1' && /^\d+$/.test(pageParam) ? `?page=${pageParam}` : '';

	return {
		title:
			pageSeo?.metaTitle ||
			globalSeo?.metaTitle ||
			(pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME),

		description:
			pageSeo?.metaDescription || globalSeo?.metaDescription || pageDescription || '',

		robots: pageSeo?.metaRobots || globalSeo?.metaRobots || 'index, follow',

		canonical: `${base}${path === '/' ? '/' : path.replace(/\/+$/, '')}${query}`,

		image:
			resolveShareImage(pageSeo?.shareImage || globalSeo?.shareImage || pageImage) ||
			defaultShareImage(base)
	};
}

/** Site-wide fallback so every page has an og:image. */
function defaultShareImage(base) {
	return {
		url: `${base}/og-default.png`,
		width: 1200,
		height: 630,
		alt: SITE_NAME
	};
}

function resolveShareImage(image) {
	if (!image?.url) return null;

	return {
		url: image.url.startsWith('http') ? image.url : `${PUBLIC_WP_URL}${image.url}`,
		width: image.width || null,
		height: image.height || null,
		alt: image.alt || image.alternativeText || ''
	};
}

/** "my-case-study" -> "My Case Study". Matches Breadcrumbs.svelte. */
export function formatLabel(segment = '') {
	return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
