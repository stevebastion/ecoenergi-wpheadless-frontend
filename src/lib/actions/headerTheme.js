export function headerTheme(node, offset = 100) {
  let sections = [];
  let currentTheme = null;

  function scanSections() {
    sections = Array.from(
      document.querySelectorAll('[data-header-theme]')
    );
    updateTheme(); // 👈 apply immediately on page change
  }

  function updateTheme() {
    if (!sections.length) return;

    const scrollY = window.scrollY + offset;

    const activeSection = sections
      .filter((section) => section.offsetTop <= scrollY)
      .sort((a, b) => b.offsetTop - a.offsetTop)[0];

    if (!activeSection) return;

    const theme = activeSection.dataset.headerTheme;

    if (theme === currentTheme) return;

    currentTheme = theme;
    node.classList.toggle('is-light', theme === 'light');
    node.classList.toggle('is-dark', theme === 'dark');
  }

  // Initial scan
  scanSections();

  // Listen to scroll
  window.addEventListener('scroll', updateTheme, { passive: true });
  window.addEventListener('resize', scanSections);

  // 👇 VERY IMPORTANT: listen for page navigation
  const mutationObserver = new MutationObserver(scanSections);
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return {
    destroy() {
      window.removeEventListener('scroll', updateTheme);
      window.removeEventListener('resize', scanSections);
      mutationObserver.disconnect();
    }
  };
}