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
npm test          # vitest run (unit + MetaHead SSR render + source guards)
npm run test:watch
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
| `PUBLIC_GA_ID` | Google Analytics measurement ID (`G-...`). **Blank = analytics never loads**, even if a visitor accepts. Setting it also opens the CSP for Google (`svelte.config.js`) |

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

`src/hooks.server.js` sets `public, max-age=0, s-maxage=60, stale-while-revalidate=86400` on pages, so a
WordPress edit shows within a minute or two (the first request after 60s gets stale HTML and refreshes it).
Error responses (>=400) are `no-store`. There is NO publish-triggered purge; true instant updates would need
Vercel ISR with a bypass token or the Vercel cache API (not built, untested).

## SEO / accessibility (audited 2026-10-05)

- `MetaHead.svelte` is the only place `<head>` SEO is written: title, description, robots, canonical, OG/Twitter and **one** JSON-LD `@graph` (Organization, WebSite, WebPage, BreadcrumbList, plus an optional `entity` = Article/Service). Don't add a second JSON-LD block.
- **Canonical is built from `PUBLIC_SITE_URL` + path, never Yoast's canonical** (that points at the WP backend domain). Pages pass `pageTitle` / `pageDescription` / `pageImage` as fallbacks when Yoast is empty.
- `/sitemap.xml` (`SITEMAP_QUERY`, noindex pages excluded) and `/robots.txt` are dynamic routes. Non-production Vercel deployments get `Disallow: /` and `X-Robots-Tag: noindex` (`hooks.server.js`).
- `/our-services` is a 308 to `/our-services/residential` until the index gets a real page.
- Fonts are self-hosted (`@fontsource/poppins`), no Google Fonts. Decorative images use `alt=""`.
- Header: dropdown opens on hover/focus/Escape, `aria-expanded` on parents, closed mobile panel is `visibility:hidden`. Skip link + global `:focus-visible` ring in `app.css`.
- Not done on purpose: hero video pause control.

## Security headers, CSP, images, errors (added 2026-10-05)

- `hooks.server.js` sets HSTS, nosniff, `X-Frame-Options: DENY`, Referrer-Policy and Permissions-Policy on every response (`SECURITY_HEADERS`).
- **CSP lives in `svelte.config.js`** (`kit.csp`, enforced, `mode: 'auto'` so SvelteKit nonces its own script). Allow-listed: WP origin (images/media/REST), Cloudflare Turnstile, Mapbox. **Adding a new third party (analytics, video embed, font CDN) means adding its origin there or it will be blocked.** Verified in headless Chrome against a production build: no violations on home, about, article, service, contact (Turnstile widget renders; Mapbox could not draw in headless because there is no WebGL, so check the map in a real browser).
- **Images**: `$lib/utils/img.js` (`optimised()`, `srcset()`) routes WordPress uploads through Vercel's `/_vercel/image` (resize + WebP/AVIF). Off in dev and for SVG/GIF/other hosts. Allowed widths are `src/lib/config/imageWidths.js` and are also passed to adapter-vercel `images.sizes`; the WP host is allow-listed from `PUBLIC_WP_URL` in `svelte.config.js`. NOT verifiable locally: first check `/_vercel/image` URLs return 200 on a Vercel deployment.
- Static backgrounds are WebP (`std-header.webp`, `contact-bg*.webp`). The original `.jpg` files are no longer referenced and can be deleted (about 5MB).
- **Errors**: `src/routes/+error.svelte` (404 + 500, with Try again on 5xx) renders inside the layout; `src/error.html` is the self-contained last-resort page if the layout itself fails. `handleError` logs 5xx and returns a generic message.
- **Favicons/PWA**: `static/favicon.ico|svg`, `apple-touch-icon.png`, `icon-192/512.png`, `icon-maskable-512.png`, `site.webmanifest`, `og-default.png` (fallback og:image). The "e" mark is the loader swoosh from `app.html`.
- **Tests**: Vitest, files `*.test.js` next to the code. `src/lib/guards.test.js` fails on: `<img>` without alt, `target=_blank` without noopener, Google Fonts, stray `console.log`, a second JSON-LD source, unquoted `url({...})`. Svelte is compiled with `dev:false` under Vitest (`svelte.config.js`).

## Cookie consent

- `lib/consent/consent.js` (categories, cookie format, parse/serialise), `analytics.js` (consent-gated gtag + Consent Mode v2), `consentStore.js` (browser store), `components/common/CookieConsent.svelte` (banner + preferences dialog, mounted in `+layout.svelte`), footer "Cookie settings" button.
- Categories: Strictly necessary (locked), Analytics, Marketing (nothing uses it yet; it only sets the Consent Mode ad signals). Nothing optional is pre-ticked; Accept and Reject are equal weight.
- Choice is a first-party cookie `ee_consent` (`{v,t,analytics,marketing}`, 180 days, SameSite=Lax). Bump `CONSENT_VERSION` to re-ask everyone (e.g. when adding a tool/category).
- The banner is client-side only (pages are CDN-cached, so it must not depend on the request cookie); `ready` stays false during SSR so there is no flash.
- GA: with no `PUBLIC_GA_ID`, accepting does nothing (faux). With one: gtag.js loads only after Analytics is accepted, `anonymize_ip`, manual `page_view` per client-side navigation, GA cookies are expired on withdrawal.
- **Adding any new tracking/marketing script**: add it to a category in `consent.js`, load it only from `applyAnalytics`-style gated code, add its origin to the CSP, and bump `CONSENT_VERSION`.
- Mapbox GL sends telemetry to events.mapbox.com and may store an anonymous id in localStorage; Turnstile is a third-party widget. Both are listed under necessary/privacy text, but have legal confirm that classification.
- Browser-tested (Playwright + Chrome, 26 checks: banner, persistence, equal buttons, focus trap, Escape, GA only after consent, withdrawal, SPA page views). That script is not in the repo.

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
- Component props must match the child's `export let` names exactly (e.g. `CountCard`/`IconCard` take `label`, not `title`); Svelte silently ignores unknown props and the card falls back to its default text.
- WordPress menu paths have trailing slashes; `resolveNavPath` strips them (SvelteKit routes have none). Keep using it for any menu link.

## Git

Repo: `git@github.com:stevebastion/ecoenergi-wpheadless-frontend.git` (SSH alias `github-work`). History is 3 commits
(Initial, Vercel adapter, ignore `.vercel`). Commit only when asked.
