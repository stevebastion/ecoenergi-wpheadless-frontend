export function buildNavTree(flatNav = []) {
  const map = new Map();
  const roots = [];

  // Clone + init items
  flatNav.forEach((item) => {
    map.set(item.id, { ...item, items: [] });
  });

  // Attach children
  flatNav.forEach((item) => {
    const node = map.get(item.id);

    if (item.parent?.id) {
      const parent = map.get(item.parent.id);
      if (parent) {
        parent.items.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  // Sort recursively by `order`
  function sortTree(nodes) {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    nodes.forEach((n) => sortTree(n.items));
  }

  sortTree(roots);

  return roots;
}