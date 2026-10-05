import { trimTrailingSlash } from './resolveNavPath';

export function isNavItemActive(item, pathname) {
  if (!item) return false;

  // Use resolved path if available
  const raw = item.externalPath || item.path || '';
  if (!raw) return false;

  // WordPress paths end in '/', SvelteKit pathnames don't. Compare without.
  const path = trimTrailingSlash(raw);
  const current = trimTrailingSlash(pathname || '/');

  // The home link must only match the home page, not every page.
  if (path === '/') return current === '/';

  // Exact match, or a deeper route inside this section
  return current === path || current.startsWith(path + '/');
}
