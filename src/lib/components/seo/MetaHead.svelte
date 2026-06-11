<script>
  import { page } from '$app/stores';
  import { strapiMedia } from '$lib/utils/media';
  import { resolveSeo } from '$lib/utils/resolveSeo';

  export let pageSeo = null;
  export let globalSeo = null;

  const siteUrl = import.meta.env.PUBLIC_SITE_URL;

  $: seo = resolveSeo({
    pageSeo,
    globalSeo,
    url: `${siteUrl}${$page.url.pathname}`
  });
</script>

<svelte:head>
  <title>{seo.title}</title>

  {#if seo.description}
    <meta name="description" content={seo.description} />
  {/if}

  {#if seo.canonical}
    <link rel="canonical" href={seo.canonical} />
  {/if}

  <!-- Open Graph -->
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={seo.canonical} />

  {#if seo.imageUrl}
    <meta property="og:image" content={strapiMedia(seo.imageUrl)} />
    <meta property="og:image:alt" content={seo.imageAlt} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seo.title} />
  <meta name="twitter:description" content={seo.description} />

  {#if seo.imageUrl}
    <meta name="twitter:image" content={strapiMedia(seo.imageUrl)} />
  {/if}
</svelte:head>