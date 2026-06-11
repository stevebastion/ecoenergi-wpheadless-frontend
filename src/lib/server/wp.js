import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

/**
 * WordPress (WPGraphQL) data layer — SERVER ONLY.
 *
 * Replaces the old Strapi `strapiFetch` helper. Everything is fetched from the
 * single `/graphql` endpoint exposed by the WPGraphQL plugin.
 *
 * The `adapt*` helpers normalise WPGraphQL responses back into the same shapes
 * the existing Svelte components already expect (Strapi-style media objects,
 * `__component` blocks, `metaTitle`/`metaDescription` SEO, etc.) so the .svelte
 * files barely need to change.
 */

const WP_URL = publicEnv.PUBLIC_WP_URL;
const WP_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_WP_GRAPHQL_ENDPOINT || '/graphql';
const WP_GRAPHQL_TOKEN = privateEnv.WP_GRAPHQL_TOKEN;

/* -------------------------------------------------------------------------
 * GraphQL fetch helper
 * ----------------------------------------------------------------------- */

/**
 * Run a GraphQL query against WordPress.
 * @param {string} query
 * @param {object} [variables]
 * @param {object} [options]
 * @param {boolean} [options.required] throw on error (default true)
 * @param {*} [options.fallback] value returned on error when not required
 */
export async function wpQuery(query, variables = {}, { required = true, fallback = null } = {}) {
	if (!WP_URL) {
		throw new Error('PUBLIC_WP_URL is not set.');
	}

	const headers = { 'Content-Type': 'application/json' };
	if (WP_GRAPHQL_TOKEN) {
		headers.Authorization = `Bearer ${WP_GRAPHQL_TOKEN}`;
	}

	const endpoint = `${WP_URL}${WP_GRAPHQL_ENDPOINT}`;

	// Log every outgoing query so the dev terminal shows what we're asking WP for.
	const opName = query.match(/\b(query|mutation)\s+(\w+)/)?.[2] || 'anonymous';
	console.log(`[wp] → ${opName} @ ${endpoint}`);
	console.log(query.trim());
	if (Object.keys(variables).length) {
		console.log('[wp] variables:', variables);
	}

	try {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify({ query, variables })
		});

		const json = await res.json();

		if (!res.ok || json.errors) {
			const message = json.errors?.map((e) => e.message).join('; ') || `HTTP ${res.status}`;
			console.warn(`[wp] ← ${opName} errors: ${message}`);
			if (json.errors) console.warn(JSON.stringify(json.errors, null, 2));
			if (required) throw new Error(`WPGraphQL error: ${message}`);
			return fallback;
		}

		console.log(`[wp] ← ${opName} response:`);
		console.dir(json.data, { depth: null, colors: true });
		return json.data;
	} catch (err) {
		console.warn(`[wp] fetch failed: ${err.message} (${WP_URL}${WP_GRAPHQL_ENDPOINT})`);
		if (required) throw err;
		return fallback;
	}
}

/* -------------------------------------------------------------------------
 * Adapters — WordPress shapes -> Strapi-style shapes
 * ----------------------------------------------------------------------- */

/**
 * Normalise a WPGraphQL MediaItem node into the Strapi-style media object the
 * components expect: { url, alternativeText, width, height, mime, formats }.
 *
 * Accepts either a raw MediaItem node, or a `{ node }` connection edge.
 */
export function adaptMedia(input) {
	if (!input) return null;
	const node = input.node ?? input;
	if (!node || (!node.sourceUrl && !node.mediaItemUrl)) return null;

	const details = node.mediaDetails || {};
	const formats = {};

	for (const size of details.sizes || []) {
		// WP size names: thumbnail, medium, medium_large, large, ...
		formats[size.name] = {
			url: size.sourceUrl,
			width: Number(size.width) || null,
			height: Number(size.height) || null
		};
	}
	// Alias WP sizes to the Strapi names the components look for.
	if (formats.medium_large && !formats.large) formats.large = formats.medium_large;
	if (formats.large && !formats.medium) formats.medium = formats.large;
	if (formats.medium && !formats.small) formats.small = formats.medium;

	return {
		url: node.sourceUrl || node.mediaItemUrl,
		alternativeText: node.altText || node.title || '',
		width: Number(details.width) || null,
		height: Number(details.height) || null,
		mime: node.mimeType || guessMime(node.sourceUrl),
		formats
	};
}

/** Adapt a WPGraphQL media connection (`{ nodes: [...] }`) into a media array. */
export function adaptGallery(connection) {
	const nodes = connection?.nodes ?? connection ?? [];
	return nodes.map(adaptMedia).filter(Boolean);
}

/** Best-effort mime sniffing when WP doesn't return mimeType. */
function guessMime(url = '') {
	const ext = url.split('.').pop()?.toLowerCase();
	const map = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp',
		svg: 'image/svg+xml',
		mp4: 'video/mp4',
		webm: 'video/webm',
		ogg: 'video/ogg'
	};
	return map[ext] || '';
}

/**
 * Adapt a Yoast SEO object (WPGraphQL SEO add-on, type `PostTypeSEO`) into the
 * shape `resolveSeo` expects: { metaTitle, metaDescription, metaRobots,
 * canonicalURL, shareImage }.
 */
export function adaptYoastSeo(seo) {
	if (!seo) return null;
	const noindex = seo.metaRobotsNoindex || 'index';
	const nofollow = seo.metaRobotsNofollow || 'follow';
	return {
		metaTitle: seo.title || seo.opengraphTitle || '',
		metaDescription: seo.metaDesc || seo.opengraphDescription || '',
		metaRobots: `${noindex}, ${nofollow}`,
		canonicalURL: seo.canonical || null,
		shareImage: adaptMedia(seo.opengraphImage)
	};
}

/**
 * Adapt an ACF Flexible Content array into the Strapi dynamic-zone shape that
 * `CMSBlocks.svelte` understands (`{ __component: 'shared.xxx', ... }`).
 *
 * Each WPGraphQL layout exposes `fieldGroupName`, which equals the ACF layout
 * name (`rich_text`, `image_grid`, `media`, `icon_cards_panel`).
 */
export function adaptBlocks(layouts = []) {
	if (!Array.isArray(layouts)) return [];

	return layouts
		.map((block) => {
			const name = block.fieldGroupName || layoutNameFromTypename(block.__typename);

			switch (name) {
				case 'rich_text':
					return { __component: 'shared.rich-text', body: block.body || '' };

				case 'image_grid':
					return { __component: 'shared.image-grid', Images: adaptGallery(block.images) };

				case 'media':
					return { __component: 'shared.media', file: adaptMedia(block.file) };

				case 'icon_cards_panel':
					return {
						__component: 'shared.icon-cards-panel',
						Title: block.title || '',
						panel_content: block.panelContent || '',
						Cards: (block.cards || []).map((c) => ({
							Title: c.cardTitle || '',
							Description: c.description || '',
							Icon: adaptMedia(c.icon)
						})),
						count_cards: (block.countCards || []).map((c) => ({
							title: c.countTitle || '',
							content: c.countContent || ''
						}))
					};

				default:
					return null;
			}
		})
		.filter(Boolean);
}

/** Fallback layout detection from the generated WPGraphQL type name. */
function layoutNameFromTypename(typename = '') {
	const t = typename.toLowerCase();
	if (t.includes('iconcardspanel')) return 'icon_cards_panel';
	if (t.includes('imagegrid')) return 'image_grid';
	if (t.includes('richtext')) return 'rich_text';
	if (t.includes('media')) return 'media';
	return '';
}

/** Adapt an ACF button group/repeater row into a uniform button object. */
export function adaptButton(btn) {
	if (!btn) return null;
	return {
		label: btn.label || '',
		url: btn.url || '',
		open_in_new_tab: !!btn.openInNewTab
	};
}

/** Adapt an ACF icon-card repeater row. */
export function adaptIconCard(card) {
	if (!card) return null;
	return {
		Title: card.cardTitle || '',
		Description: card.description || '',
		Icon: adaptMedia(card.icon)
	};
}

/* -------------------------------------------------------------------------
 * Navigation — WP menus -> the flat nav shape `buildNavTree` expects
 * ----------------------------------------------------------------------- */

/**
 * Adapt a WPGraphQL `menuItems` connection into the flat array shape used by
 * `buildNavTree` / `resolveNavPath`: { id, title, path, externalPath, parent, order }.
 */
export function adaptMenu(menuItems) {
	const nodes = menuItems?.nodes ?? [];
	return nodes.map((item, index) => {
		const path = stripOrigin(item.uri || item.path || item.url || '/');
		return {
			id: item.id,
			title: item.label,
			order: item.order ?? index,
			type: item.target === '_blank' || isExternal(item.url) ? 'EXTERNAL' : 'INTERNAL',
			path,
			externalPath: isExternal(item.url) ? item.url : null,
			parent: item.parentId ? { id: item.parentId } : null
		};
	});
}

function isExternal(url = '') {
	if (!url) return false;
	if (!/^https?:\/\//i.test(url)) return false;
	return WP_URL ? !url.startsWith(WP_URL) : true;
}

/** Turn an absolute WP URL into a site-relative path. */
function stripOrigin(uri = '/') {
	try {
		if (/^https?:\/\//i.test(uri)) return new URL(uri).pathname || '/';
	} catch {
		/* noop */
	}
	return uri.startsWith('/') ? uri : `/${uri}`;
}
