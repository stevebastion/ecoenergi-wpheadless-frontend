/**
 * GraphQL queries for the WordPress backend (WPGraphQL + ACF + Yoast SEO).
 *
 * ACF TYPE NAMES
 * --------------
 * Flexible Content layout type names follow the WPGraphQL-for-ACF v2 convention
 * <FieldGroupName><FlexFieldName><LayoutName>Layout, e.g.
 * `PageBuilderBlocksRichTextLayout`. If your installed version differs, open
 * GraphQL → GraphiQL IDE in wp-admin and adjust the `... on XxxLayout`
 * fragments. The block adapter in `wp.js` also matches on `__typename`, so
 * minor naming differences are tolerated.
 *
 * SEO
 * ---
 * SEO is provided by Yoast via the "Add WPGraphQL SEO" plugin, which adds a
 * `seo` field (type `PostTypeSEO`) to every post type. The ACF SEO groups were
 * removed.
 *
 * PAGE TEMPLATES
 * --------------
 * Home, About, Contact and the Service Landing pages are ordinary WordPress
 * Pages distinguished by a page template (see the headless plugin). They are
 * fetched by URI via the `page` query and carry bespoke ACF field groups
 * (`homeFields`, `aboutFields`, `contactFields`, `serviceLandingFields`).
 * Because they are real Pages they are fully Yoast-managed.
 */

/* ---- Shared fragments --------------------------------------------------- */

const MEDIA = `
fragment Media on MediaItem {
  sourceUrl
  mediaItemUrl
  altText
  title
  mimeType
  mediaDetails {
    width
    height
    sizes { name sourceUrl width height }
  }
}`;

const YOAST = `
fragment Yoast on PostTypeSEO {
  title
  metaDesc
  canonical
  metaRobotsNoindex
  metaRobotsNofollow
  opengraphTitle
  opengraphDescription
  opengraphImage { ...Media }
}`;

/* ---- Layout (global) --------------------------------------------------- */

export const LAYOUT_QUERY = `
${MEDIA}
query Layout {
  siteSettings {
    siteSettingsFields {
      siteName
      siteDescription
      favicon { node { ...Media } }
      footerNav1Title
      footerNav2Title
      footerNav3Title
      footerLogos { nodes { ...Media } }
      phoneNumber
      emailAddress
      residentialCtaTitle
      residentialCtaImage { node { ...Media } }
      residentialCtaLink
      commercialCtaTitle
      commercialCtaImage { node { ...Media } }
      commercialCtaLink
    }
  }
  primary: menuItems(where: { location: PRIMARY }, first: 100) {
    nodes { id label uri url order target parentId }
  }
  footer1: menuItems(where: { location: FOOTER_1 }, first: 100) {
    nodes { id label uri url order target parentId }
  }
  footer2: menuItems(where: { location: FOOTER_2 }, first: 100) {
    nodes { id label uri url order target parentId }
  }
  footer3: menuItems(where: { location: FOOTER_3 }, first: 100) {
    nodes { id label uri url order target parentId }
  }
  caseStudies(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
    nodes { databaseId title slug caseStudyFields { description coverImage { node { ...Media } } } }
  }
  posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
    nodes { databaseId title slug date articleFields { description cover { node { ...Media } } } }
  }
}`;

/* ---- Home (Page using the Home Page template, set as front page) ------- */

export const HOME_QUERY = `
${MEDIA}
${YOAST}
query Home {
  page(id: "/", idType: URI) {
    databaseId
    title
    slug
    seo { ...Yoast }
    homeFields {
      bannerTitle
      bannerContent
      bannerVideo { node { ...Media } }
      bannerVideoPoster { node { ...Media } }
      bannerButtons { label url openInNewTab }
      uspsTitle
      leadContent
      uspItems { cardTitle description icon { node { ...Media } } }
      trustedContent
      trustedImages { nodes { ...Media } }
      trustedButton { label url openInNewTab }
    }
  }
}`;

/* ---- About (Page using the About Page template) ------------------------ */

export const ABOUT_QUERY = `
${MEDIA}
${YOAST}
query About {
  page(id: "/about/", idType: URI) {
    databaseId
    title
    slug
    seo { ...Yoast }
    aboutFields {
      title
      bannerTitle
      bannerDescription
      staff { name staffImage { node { ...Media } } }
      leadContent
      leadButton { label url openInNewTab }
      whyChooseUsIntro
      whyChooseUsTitle
      whyChooseUsCards { cardTitle description icon { node { ...Media } } }
      supportingYouContent
    }
  }
}`;

/* ---- Contact (Page using the Contact Page template) -------------------- */

export const CONTACT_QUERY = `
${MEDIA}
${YOAST}
query Contact {
  page(id: "/contact/", idType: URI) {
    databaseId
    title
    slug
    seo { ...Yoast }
    contactFields {
      title
      leadInText
      location { streetAddress latitude longitude }
    }
  }
}`;

/* ---- Page (native WP Page + page builder) ------------------------------ */

export const PAGE_BY_URI_QUERY = `
${MEDIA}
${YOAST}
query PageByUri($uri: ID!) {
  page(id: $uri, idType: URI) {
    databaseId
    title
    slug
    content
    seo { ...Yoast }
    pageBuilder {
      usePageBuilder
      blocks {
        __typename
        ... on PageBuilderBlocksRichTextLayout { body }
        ... on PageBuilderBlocksImageGridLayout { images { nodes { ...Media } } }
        ... on PageBuilderBlocksMediaLayout { file { node { ...Media } } }
        ... on PageBuilderBlocksIconCardsPanelLayout {
          title
          panelContent
          cards { cardTitle description icon { node { ...Media } } }
          countCards { countTitle countContent }
        }
      }
    }
  }
}`;

/* ---- Articles (native WP Posts) ---------------------------------------- */

export const ARTICLES_QUERY = `
${MEDIA}
query Articles($first: Int = 100) {
  posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      databaseId
      title
      slug
      date
      articleFields { description cover { node { ...Media } } }
    }
  }
}`;

export const ARTICLE_BY_SLUG_QUERY = `
${MEDIA}
${YOAST}
query ArticleBySlug($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    databaseId
    title
    slug
    date
    seo { ...Yoast }
    articleFields {
      description
      cover { node { ...Media } }
      blocks {
        __typename
        ... on ArticleFieldsBlocksMediaLayout { file { node { ...Media } } }
        ... on ArticleFieldsBlocksRichTextLayout { body }
        ... on ArticleFieldsBlocksImageGridLayout { images { nodes { ...Media } } }
      }
    }
  }
}`;

/* ---- Case studies (CPT) ------------------------------------------------ */

export const CASE_STUDIES_QUERY = `
${MEDIA}
query CaseStudies($first: Int = 100) {
  caseStudies(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      databaseId
      title
      slug
      caseStudyFields { description coverImage { node { ...Media } } }
    }
  }
}`;

export const CASE_STUDY_BY_SLUG_QUERY = `
${MEDIA}
${YOAST}
query CaseStudyBySlug($slug: ID!) {
  caseStudy(id: $slug, idType: SLUG) {
    databaseId
    title
    slug
    seo { ...Yoast }
    caseStudyFields {
      description
      testimonial
      testimonialAuthor
      leadInContent
      coverImage { node { ...Media } }
      services {
        nodes {
          ... on Service {
            title
            slug
            serviceFields { category }
          }
        }
      }
      contentBlocks {
        __typename
        ... on CaseStudyFieldsContentBlocksRichTextLayout { body }
        ... on CaseStudyFieldsContentBlocksImageGridLayout { images { nodes { ...Media } } }
        ... on CaseStudyFieldsContentBlocksMediaLayout { file { node { ...Media } } }
      }
    }
  }
}`;

/* ---- Services (CPT) ---------------------------------------------------- */

export const SERVICES_QUERY = `
${MEDIA}
query Services($first: Int = 100) {
  services(first: $first, where: { orderby: { field: TITLE, order: ASC } }) {
    nodes {
      databaseId
      title
      slug
      serviceFields { category bannerText svgIcon { node { ...Media } } coverImage { node { ...Media } } }
    }
  }
}`;

export const SERVICE_BY_SLUG_QUERY = `
${MEDIA}
${YOAST}
query ServiceBySlug($slug: ID!) {
  service(id: $slug, idType: SLUG) {
    databaseId
    title
    slug
    seo { ...Yoast }
    serviceFields {
      bannerTitle
      bannerText
      category
      intro
      coverImage { node { ...Media } }
      contentBlocks {
        __typename
        ... on ServiceFieldsContentBlocksIconCardsPanelLayout {
          title
          panelContent
          cards { cardTitle description icon { node { ...Media } } }
          countCards { countTitle countContent }
        }
      }
    }
  }
}`;

/* ---- Service landing (Page using the Service Landing template) --------- */

export const SERVICE_LANDING_BY_URI_QUERY = `
${MEDIA}
${YOAST}
query ServiceLandingByUri($uri: ID!) {
  page(id: $uri, idType: URI) {
    databaseId
    title
    slug
    seo { ...Yoast }
    serviceLandingFields {
      bannerTitle
      bannerDescription
      servicesToShow
    }
  }
}`;

/* ---- Sitemap ------------------------------------------------------------ */

export const SITEMAP_QUERY = `
query Sitemap {
  pages(first: 100, where: { status: PUBLISH }) {
    nodes { uri modified seo { metaRobotsNoindex } }
  }
  posts(first: 100, where: { status: PUBLISH }) {
    nodes { slug modified seo { metaRobotsNoindex } }
  }
  caseStudies(first: 100, where: { status: PUBLISH }) {
    nodes { slug modified seo { metaRobotsNoindex } }
  }
  services(first: 100, where: { status: PUBLISH }) {
    nodes { slug modified serviceFields { category } seo { metaRobotsNoindex } }
  }
}`;
