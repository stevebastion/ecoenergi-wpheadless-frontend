<script>
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';

  import { headerTheme } from '$lib/actions/headerTheme';
  import { resolveNavPath } from '$lib/utils/resolveNavPath';
  import { buildNavTree } from '$lib/utils/buildNavTree';
  import { isNavItemActive } from '$lib/utils/isActive';

  export let nav;

  const headerNav = buildNavTree(nav);

  let isOpen = false;
  let openSubmenuId = null;

  let isMobile = false;

    function updateViewport() {
      if (!browser) return;
      isMobile = window.innerWidth <= 1023;
      console.log('isMobile:', isMobile);
    }

    onMount(() => {
      updateViewport();
      window.addEventListener('resize', updateViewport);
    });

    onDestroy(() => {
      if (browser) window.removeEventListener('resize', updateViewport);
    });

  function toggleNav() {
    isOpen = !isOpen;
    openSubmenuId = null;

    if (browser) {
      document.body.classList.toggle('nav-open', isOpen);
    }
  }

  function closeNav() {
    isOpen = false;
    openSubmenuId = null;

    if (browser) {
      document.body.classList.remove('nav-open');
    }
  }

  function toggleSubmenu(id) {
    if (!isMobile) return;
    openSubmenuId = openSubmenuId === id ? null : id;
  }

  // Close menu on route change
  const unsubscribe = page.subscribe(() => {
    if (browser) closeNav();
  });

  onDestroy(unsubscribe);
</script>

<header class="container" use:headerTheme class:is-open={isOpen}>
  <nav aria-label="Main navigation">
    <figure>
      <a href="/" on:click={closeNav}>
        <img width="160" src="/logo.svg" alt="Eco Energi" />
      </a>
    </figure>

    <ul class="nav-links">
      {#each headerNav as item}
        <li
          class:has-children={item.items?.length}
          class:is-active={isNavItemActive(item, $page.url.pathname)}
          class:is-expanded={openSubmenuId === item.id}
        >
          <a
            href={resolveNavPath(item)}
              on:click={(e) => {
                  if (isMobile && isOpen && item.items?.length) {
                    e.preventDefault();        // 👈 ONLY block on mobile submenu tap
                    toggleSubmenu(item.id);
                  } else {
                    closeNav();                // 👈 allow normal navigation
                  }
                }}
              >
            {item.title}
          </a>

          {#if item.items?.length}
            <ul>
              {#each item.items as child}
                <li>
                  <a href={resolveNavPath(child)} on:click={closeNav}>
                    {child.title}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>

   <button
      class="nav-toggle"
      aria-label="Toggle navigation"
      aria-expanded={isOpen}
      on:click={toggleNav}
    >
      <svg
        class="hamburger"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        aria-hidden="true"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </nav>
</header>

<style>
  header {
    position: fixed;
    top: 3rem;
    left: 50%;
    transform: translateY(-200%) translateX(-50%);
    animation: slideDown 0.5s ease forwards;
    padding: clamp(1rem, 1rem + 1vw, 2rem);
    border-radius: var(--border-radius);
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-light);
    z-index: 99;
    transition: all 0.3s ease;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  ul {
    list-style: none;
    display: flex;
    gap: 2.5vw;
    margin: 0;
    padding: 0;
  }

  ul li a {
    color: var(--color-light);
    text-decoration: none;
  }

  ul li a:hover {
    color: var(--color-secondary);
  }

  li.is-active > a {
    color: var(--color-secondary);
  }

  li.has-children {
    position: relative;
  }

  /* Desktop dropdown */
  li.has-children ul {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--color-primary);
    border-radius: calc(var(--border-radius) / 2);
    padding: 3rem;
    min-width: 280px;
    opacity: 0;
    visibility: hidden;
    box-shadow: var(--shadow-dark);
    transition: all 0.3s ease;
    pointer-events: none;
  }

  li.has-children:hover ul {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .nav-toggle {
    display: none;
    background: none;
    border: 0;
    color: var(--color-light);
    cursor: pointer;
  }

  /* ---------------- MOBILE ---------------- */

  @media (max-width: 1023px) {
    header {
      width: 100%;
      top: 0;
      border-radius: 0;
      padding-left: 5vw;
      padding-right: 5vw;
      background: var(--color-primary) !important;
    }

    .nav-toggle {
      display: block;
      z-index: 101;
    }

    .nav-links {
      position: fixed;
      inset: 0;
      background: var(--color-primary);
      flex-direction: column;
      padding: 8vh 5vw;
      gap: 2rem;
      transform: translateX(-100%);
      transition: transform 0.35s ease;
      z-index: 100;
      height: 100vh;
      width: 100vw;
      overflow-y: auto;
    }

    header.is-open .nav-links {
      transform: translateX(0);
    }

    .nav-links > li {
      width: 100%;
      border-bottom: 1px solid var(--color-primary-tint);
      padding-bottom: 2rem;
    }

    .nav-links li a {
      font-size: 2rem;
    }

    /* Mobile submenu */
    li.has-children ul {
      position: static;
      padding: 1rem 0 0;
      box-shadow: none;
      display: none;
      opacity: 1;
      visibility: visible;
    }

    li.has-children.is-expanded ul {
      display: block;
    }

    li.has-children > a {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    li.has-children > a::after {
      content: '▾';
      transition: transform 0.3s ease;
    }

    li.has-children.is-expanded > a::after {
      transform: rotate(180deg);
    }

    li.has-children ul li a {
      font-size: 1.8rem;
      color: var(--color-primary-light);
    }
  }

  @keyframes slideDown {
    to {
      transform: translateY(0) translateX(-50%);
    }
  }

  :global(header.is-dark) {
    background: var(--color-primary);
  }


  .hamburger {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.hamburger line {
  transition:
    transform 0.35s ease,
    opacity 0.25s ease;
  transform-origin: center;
}

/* OPEN STATE — refined */
header.is-open .hamburger line:nth-child(1) {
  transform: translateY(5px) rotate(45deg);
}

header.is-open .hamburger line:nth-child(2) {
  opacity: 0;
}

header.is-open .hamburger line:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
}


</style>