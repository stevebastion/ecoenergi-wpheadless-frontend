# Eco Energi: SvelteKit frontend (WordPress-backed)

Svelte 5 + SvelteKit 2 + Vite 7, plain JS (`jsconfig.json`, no TypeScript). Deployed to Vercel
(`adapter-vercel`; `adapter-cloudflare` is still in devDependencies). Copied from the Strapi
frontend (`../../www/public`) with only the **data layer** swapped. Routes, components and
styling are unchanged.

## Commands

```bash
npm install
npm run dev       # NODE_TLS_REJECT_UNAUTHORIZED=0 vite dev  (local WP uses a self-signed cert)
npm run build
npm run lint      # prettier --check . && eslint .
```

Needs a reachable WordPress `/graphql` with content, or the layout falls back to empty data.

## Env (`.env`, gitignored. Never print values)

| Var | Purpose |
|---|---|
| `PUBLIC_WP_URL` | WP base URL, no trailing slash. Currently the staging site `ecoapi-ti5u7.projectbeta.co.uk` |
| `PUBLIC_WP_GRAPHQL_ENDPOINT` | `/graphql` |
| `WP_GRAPHQL_TOKEN` | Optional Bearer token (drafts / locked-down endpoint). Server-only |
| `PUBLIC_SITE_URL` | **Public origin of this site.** Canonical, OG, sitemap and JSON-LD are built from it. Launch value will presumably be `https://ecoenergi.co.uk` (the CURRENT live site) - set it at cutover only, not before. Must be set on Vercel (production) or canonicals fall back to the request origin. Currently `http://localhost:5173` locally |
| `PUBLIC_MAPBOX_TOKEN`, `PUBLIC_TURNSTILE_SITE_KEY` | Third party |

## Data layer: the only place WordPress is touched

`src/lib/server/` (server-only):

- `wp.js` -> `wpQuery(query, vars, {required, fallback})` + primitive adapters (media, blocks, menus, Yoast SEO via `adaptMenu` etc.)
- `queries.js` -> every GraphQL query string
- `adapters.js` -> per-content-type adapters (`adaptGlobal`, `adaptCaseStudyCard`, `adaptArticleCard`, ...)

**Adapters deliberately emit the original Strapi field names** (`cover_image`, `usp_items`,
`__component: 'shared.rich-text'`, `metaTitle`...) so `.svelte` components don't change. When adding a
field: add it to the query, map it in the adapter to the Strapi-style name, then use it in the component.
Don't leak raw WPGraphQL shapes into components.

Each `+page.server.js` is: run query -> adapt -> return. `+layout.server.js` loads global settings,
navigation (4 menus) and latest case studies/articles in one `LAYOUT_QUERY`.

## Routes

`/` home, `/about`, `/contact`, `/articles` + `/articles/[slug]`, `/case-studies` + `/case-studies/[slug]`,
`/our-services` + `/[category]` + `/[category]/[slug]`, `/[slug]` (generic WP Page via page builder).

Content mapping: Page -> WP Page, article -> Post, case study -> `case_study` CPT, service -> `service` CPT,
service landing -> Pages using the Service Landing template, global -> ACF options (`siteSettings`).

## Caching

`src/hooks.server.js` sets `public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` on every
response. Content edits can take up to an hour to show on Vercel. Remember this before debugging "my change didn't appear".

## SEO / accessibility (audited 2026-10-05)

- `MetaHead.svelte` is the only place `<head>` SEO is written: title, description, robots, canonical, OG/Twitter and **one** JSON-LD `@graph` (Organization, WebSite, WebPage, BreadcrumbList, plus an optional `entity` = Article/Service). Don't add a second JSON-LD block.
- **Canonical is built from `PUBLIC_SITE_URL` + path, never Yoast's canonical** (that points at the WP backend domain). Pages pass `pageTitle` / `pageDescription` / `pageImage` as fallbacks when Yoast is empty.
- `/sitemap.xml` (`SITEMAP_QUERY`, noindex pages excluded) and `/robots.txt` are dynamic routes. Non-production Vercel deployments get `Disallow: /` and `X-Robots-Tag: noindex` (`hooks.server.js`).
- `/our-services` is a 308 to `/our-services/residential` until the index gets a real page.
- Fonts are self-hosted (`@fontsource/poppins`), no Google Fonts. Decorative images use `alt=""`.
- Header: dropdown opens on hover/focus/Escape, `aria-expanded` on parents, closed mobile panel is `visibility:hidden`. Skip link + global `:focus-visible` ring in `app.css`.
- Not done on purpose: hero video pause control.

## Contact form

`ContactForm.svelte` POSTs JSON to WP `POST /wp-json/eco-energi/v1/form-submission` with a Turnstile token.
The secret key lives on the WP side (`TURNSTILE_SECRET_KEY` in `wp-config.php`).

## Gotchas

- **Quote CSS `url()`** when interpolating (`url('{x}')`). Applies to any Vite asset reference.
- Menu location enums are the uppercased slugs: `PRIMARY`, `FOOTER_1`, `FOOTER_2`, `FOOTER_3`.
- GraphQL union names for ACF flexible content look like `PageBuilderBlocksRichTextLayout`; the block adapter falls back to `__typename` matching. If a query suddenly errors after an ACF change, check names in GraphiQL first.
- ACF image fields are assumed to resolve as connections (`{ node { ... } }`). Drop the `node` wrapper if the plugin version returns `MediaItem` directly.
- `wpQuery` only logs in dev (`$app/environment`). GraphQL introspection is OFF on staging, so check types via GraphiQL in wp-admin, not curl.
- Missing renderer: `icon-cards-panel` block in `CMSBlocks.svelte`.

## Git

Repo: `git@github.com:stevebastion/ecoenergi-wpheadless-frontend.git` (SSH alias `github-work`). History is 3 commits
(Initial, Vercel adapter, ignore `.vercel`). Commit only when asked.
