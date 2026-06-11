export function isNavItemActive(item, pathname) {

  //console.log('Checking isNavItemActive for item:', item, 'with pathname:', pathname);

  if (!item) return false;

  // External links are never "active"
  //if (item.type === 'EXTERNAL') return false;

  // Use resolved path if available
  const path =
    item.externalPath ||
    item.path ||
    '';

  if (!path) return false;

  // Exact match
  if (pathname === path) return true;

  // Section match (children, deep routes)
  if (pathname.startsWith(path + '/')) return true;

  return false;
}