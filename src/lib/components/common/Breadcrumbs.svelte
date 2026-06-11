<script>
  import { page } from '$app/stores';

  /**
   * Optional map to override labels
   * e.g. { 'our-services': 'Our Services' }
   */
  export let labelMap = {};

  $: segments = $page.url.pathname
    .split('/')
    .filter(Boolean);

  $: breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');

    return {
      label: labelMap[segment] ?? formatLabel(segment),
      href
    };
  });

  function formatLabel(str) {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li class="home" >
      <a href="/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M304 70.1C313.1 61.9 326.9 61.9 336 70.1L568 278.1C577.9 286.9 578.7 302.1 569.8 312C560.9 321.9 545.8 322.7 535.9 313.8L527.9 306.6L527.9 511.9C527.9 547.2 499.2 575.9 463.9 575.9L175.9 575.9C140.6 575.9 111.9 547.2 111.9 511.9L111.9 306.6L103.9 313.8C94 322.6 78.9 321.8 70 312C61.1 302.2 62 287 71.8 278.1L304 70.1zM320 120.2L160 263.7L160 512C160 520.8 167.2 528 176 528L224 528L224 424C224 384.2 256.2 352 296 352L344 352C383.8 352 416 384.2 416 424L416 528L464 528C472.8 528 480 520.8 480 512L480 263.7L320 120.3zM272 528L368 528L368 424C368 410.7 357.3 400 344 400L296 400C282.7 400 272 410.7 272 424L272 528z"/></svg></a>
    </li>

    {#each breadcrumbs as crumb, i}
      <li>
        {#if i === breadcrumbs.length - 1}
          <span aria-current="page">{crumb.label}</span>
        {:else}
          <a href={crumb.href}>{crumb.label}</a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>


<style>
.breadcrumbs {
    margin-bottom: 1em;
}
.breadcrumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.home {
    display: flex;
    align-items: center;
    gap: 0px;
}

.home svg {
    fill: var( --color-light );
    width: 15px;
}

.breadcrumbs li::after {
  content: ">";
  margin: 0 0 0 0.5rem;
  color: var( --color-primary-tint );
}

.breadcrumbs li:last-child::after {
  content: "";
}

.breadcrumbs a {
  text-decoration: none;
  color: inherit;
  
}

.breadcrumbs a:hover {
  opacity: .7;
}

.breadcrumbs [aria-current="page"] {
  color: var( --color-secondary );
}

@media screen and ( max-width: 1023px ) {
  .breadcrumbs {
     display: none
  }
}

</style>