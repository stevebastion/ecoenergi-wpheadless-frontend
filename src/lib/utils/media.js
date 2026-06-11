import { PUBLIC_WP_URL } from '$env/static/public';

/**
 * Resolve a media URL.
 *
 * WordPress already returns absolute URLs, so this is mostly a pass-through —
 * kept (with its original name) so existing component imports don't change.
 */
export function strapiMedia(url) {
	if (!url) return null;
	if (url.startsWith('http')) return url;
	return `${PUBLIC_WP_URL}${url}`;
}

// Preferred alias going forward.
export const wpMedia = strapiMedia;
