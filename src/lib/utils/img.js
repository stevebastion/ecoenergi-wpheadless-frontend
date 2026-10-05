import { dev } from '$app/environment';
import { PUBLIC_WP_URL } from '$env/static/public';
import { IMAGE_WIDTHS } from '$lib/config/imageWidths';

/**
 * Vercel image optimisation (resize + WebP/AVIF) for WordPress media.
 *
 * Only WordPress uploads and same-origin paths are optimised: the optimiser
 * answers 400 for hosts that are not in svelte.config.js `images.remotePatterns`,
 * and SVG/GIF must pass through untouched. In dev there is no /_vercel/image
 * endpoint, so the original URL is returned.
 */
export function canOptimise(url) {
	if (!url || dev) return false;
	if (/\.(svg|gif)(\?|$)/i.test(url)) return false;
	if (url.startsWith('/')) return !url.startsWith('//');
	return !!PUBLIC_WP_URL && url.startsWith(PUBLIC_WP_URL);
}

/** One optimised URL at width `w` (snapped up to the nearest allowed width). */
export function optimised(url, w = 1024, q = 75) {
	if (!canOptimise(url)) return url;
	const width = IMAGE_WIDTHS.find((x) => x >= w) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
	return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${q}`;
}

/**
 * `srcset` value for responsive images, or `undefined` (attribute omitted)
 * when the image cannot be optimised. `maxWidth` stops us offering sizes
 * larger than the source file.
 */
export function srcset(url, maxWidth = Infinity, q = 75) {
	if (!canOptimise(url)) return undefined;
	const usable = IMAGE_WIDTHS.filter((w) => w <= maxWidth);
	const widths = usable.length ? usable : [IMAGE_WIDTHS[0]];
	return widths.map((w) => `${optimised(url, w, q)} ${w}w`).join(', ');
}
