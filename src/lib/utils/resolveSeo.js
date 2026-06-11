import { PUBLIC_WP_URL } from '$env/static/public';

export function resolveSeo({
  pageSeo = null,
  globalSeo = null,
  pageTitle = ''
}) {
  const resolved = {
    title:
      pageSeo?.metaTitle ||
      globalSeo?.metaTitle ||
      pageTitle,

    description:
      pageSeo?.metaDescription ||
      globalSeo?.metaDescription ||
      '',

    robots:
      pageSeo?.metaRobots ||
      globalSeo?.metaRobots ||
      'index, follow',

    canonical:
      pageSeo?.canonicalURL ||
      globalSeo?.canonicalURL ||
      null,

    image: resolveShareImage(pageSeo, globalSeo)
  };

  return resolved;
}

function resolveShareImage(pageSeo, globalSeo) {
  const image =
    pageSeo?.shareImage ||
    globalSeo?.shareImage ||
    null;

  if (!image?.url) return null;

  return {
    url: image.url.startsWith('http')
      ? image.url
      : `${PUBLIC_WP_URL}${image.url}`,
    width: image.width,
    height: image.height,
    alt: image.alternativeText || ''
  };
}