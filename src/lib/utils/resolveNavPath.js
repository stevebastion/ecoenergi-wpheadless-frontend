// src/lib/utils/resolveNavPath.js
//
// Turn an `adaptMenu` item into the href the frontend should navigate to.
//
// In the original Strapi build this function reconstructed the URL from
// `item.related.__type` + slug + category. WPGraphQL hands us a ready-made
// site-relative `uri` per menu item which `adaptMenu` exposes as `item.path`,
// so we just trust that — the editor's WP menu structure is the source of
// truth for what URL each link points at.

export function resolveNavPath(item) {
  if (!item) return '/';

  // External links — always use the literal URL the editor entered.
  if (item.type === 'EXTERNAL') {
    return item.externalPath || '/';
  }

  // Internal items — `path` is the WP page URI (e.g. '/about/'), already
  // site-relative thanks to `adaptMenu`/`stripOrigin`. WordPress uses trailing
  // slashes; SvelteKit routes don't, so drop it to avoid a redirect per click
  // and to keep the active-link check working.
  return trimTrailingSlash(item.path || '/');
}

export function trimTrailingSlash(path = '/') {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}
