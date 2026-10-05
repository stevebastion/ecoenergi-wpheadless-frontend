<script>
  import { page } from '$app/stores';
  import { resolveSeo, formatLabel, siteOrigin, SITE_NAME } from '$lib/utils/resolveSeo';

  /** Yoast SEO for this page (from `adaptYoastSeo`). */
  export let pageSeo = null;
  /** Fallback SEO object ({ metaTitle, metaDescription, shareImage }). */
  export let globalSeo = null;
  /** Used to build title/description/image when Yoast has none. */
  export let pageTitle = '';
  export let pageDescription = '';
  /** Media object ({ url, width, height, alternativeText }). */
  export let pageImage = null;

  /** og:type — 'website' or 'article'. */
  export let ogType = 'website';
  /** ISO date, only used for articles. */
  export let publishedTime = null;
  /**
   * One extra node for the page's JSON-LD graph:
   *   { type: 'Article' | 'Service', ...schema.org fields }
   */
  export let entity = null;

  $: seo = resolveSeo({
    pageSeo,
    globalSeo,
    pageTitle,
    pageDescription,
    pageImage,
    origin: $page.url.origin,
    path: $page.url.pathname,
    search: $page.url.search
  });

  $: origin = siteOrigin($page.url.origin);
  $: site = $page.data?.global?.data ?? {};
  $: isHome = $page.url.pathname === '/';

  $: orgId = `${origin}/#organization`;
  $: webId = `${origin}/#website`;
  $: pageId = `${seo.canonical}#webpage`;
  $: crumbId = `${seo.canonical}#breadcrumb`;

  // One graph per page. Never add a second JSON-LD block elsewhere.
  $: graph = (() => {
    const nodes = [];

    nodes.push({
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_NAME,
      url: `${origin}/`,
      logo: { '@type': 'ImageObject', url: `${origin}/logo.svg` },
      ...(site.phone_number ? { telephone: site.phone_number } : {}),
      ...(site.email_address ? { email: site.email_address } : {})
    });

    nodes.push({
      '@type': 'WebSite',
      '@id': webId,
      url: `${origin}/`,
      name: SITE_NAME,
      inLanguage: 'en-GB',
      publisher: { '@id': orgId }
    });

    nodes.push({
      '@type': 'WebPage',
      '@id': pageId,
      url: seo.canonical,
      name: seo.title,
      ...(seo.description ? { description: seo.description } : {}),
      inLanguage: 'en-GB',
      isPartOf: { '@id': webId },
      ...(seo.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: seo.image.url } } : {}),
      ...(isHome ? {} : { breadcrumb: { '@id': crumbId } })
    });

    if (!isHome) {
      const segments = $page.url.pathname.split('/').filter(Boolean);
      const items = [{ name: 'Home', item: `${origin}/` }];

      segments.forEach((segment, i) => {
        const last = i === segments.length - 1;
        items.push({
          name: last && pageTitle ? pageTitle : formatLabel(segment),
          item: `${origin}/${segments.slice(0, i + 1).join('/')}`
        });
      });

      nodes.push({
        '@type': 'BreadcrumbList',
        '@id': crumbId,
        itemListElement: items.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.item
        }))
      });
    }

    if (entity) {
      const { type, ...fields } = entity;
      nodes.push({
        '@type': type,
        '@id': `${seo.canonical}#${type.toLowerCase()}`,
        mainEntityOfPage: { '@id': pageId },
        ...(type === 'Service' ? { provider: { '@id': orgId } } : { publisher: { '@id': orgId } }),
        ...fields
      });
    }

    return { '@context': 'https://schema.org', '@graph': nodes };
  })();

  // `<` is escaped so content can never close the script element early.
  $: jsonLd = JSON.stringify(graph).replace(/</g, '\\u003c');
</script>

<svelte:head>
  <title>{seo.title}</title>

  {#if seo.description}
    <meta name="description" content={seo.description} />
  {/if}

  <meta name="robots" content={seo.robots} />
  <link rel="canonical" href={seo.canonical} />

  <!-- Open Graph -->
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:title" content={seo.title} />
  {#if seo.description}
    <meta property="og:description" content={seo.description} />
  {/if}
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={seo.canonical} />

  {#if ogType === 'article' && publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}

  {#if seo.image}
    <meta property="og:image" content={seo.image.url} />
    {#if seo.image.width}<meta property="og:image:width" content={seo.image.width} />{/if}
    {#if seo.image.height}<meta property="og:image:height" content={seo.image.height} />{/if}
    <meta property="og:image:alt" content={seo.image.alt} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={seo.image ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:title" content={seo.title} />
  {#if seo.description}
    <meta name="twitter:description" content={seo.description} />
  {/if}
  {#if seo.image}
    <meta name="twitter:image" content={seo.image.url} />
  {/if}

  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
