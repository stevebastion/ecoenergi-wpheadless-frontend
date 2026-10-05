import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_WP_URL: 'https://wp.example.test' } }));
vi.mock('$env/dynamic/private', () => ({ env: {} }));
vi.mock('$app/environment', () => ({ dev: false }));

import { adaptMedia, adaptYoastSeo, adaptMenu, adaptButton, adaptIconCard } from './wp.js';
import { adaptServiceCard, adaptArticle } from './adapters.js';

describe('adaptMedia', () => {
	const node = {
		sourceUrl: 'https://wp.example.test/a.jpg',
		altText: 'A house',
		mimeType: 'image/jpeg',
		mediaDetails: {
			width: 1536,
			height: 1024,
			sizes: [
				{ name: 'medium', sourceUrl: 'https://wp.example.test/a-300.jpg', width: '300', height: '200' },
				{ name: 'medium_large', sourceUrl: 'https://wp.example.test/a-768.jpg', width: '768', height: '512' }
			]
		}
	};

	it('returns the Strapi-shaped media object the components expect', () => {
		const m = adaptMedia({ node });
		expect(m).toMatchObject({
			url: 'https://wp.example.test/a.jpg',
			alternativeText: 'A house',
			width: 1536,
			height: 1024,
			mime: 'image/jpeg'
		});
		expect(m.formats.medium.width).toBe(300);
	});

	it('accepts a bare MediaItem as well as a { node } wrapper', () => {
		expect(adaptMedia(node).url).toBe(node.sourceUrl);
	});

	it('aliases WordPress sizes to the Strapi names (large/small)', () => {
		const m = adaptMedia({ node });
		expect(m.formats.large.url).toBe('https://wp.example.test/a-768.jpg');
		expect(m.formats.small).toBeDefined();
	});

	it('guesses a mime type from the extension when WordPress omits it', () => {
		expect(adaptMedia({ node: { sourceUrl: 'https://x.test/v.mp4' } }).mime).toBe('video/mp4');
	});

	it('returns null for empty or url-less input', () => {
		expect(adaptMedia(null)).toBeNull();
		expect(adaptMedia({ node: {} })).toBeNull();
	});
});

describe('adaptYoastSeo', () => {
	it('maps Yoast fields to the names resolveSeo reads', () => {
		const seo = adaptYoastSeo({
			title: 'T',
			metaDesc: 'D',
			canonical: 'https://wp.example.test/x/',
			metaRobotsNoindex: 'noindex',
			metaRobotsNofollow: 'follow'
		});
		expect(seo).toMatchObject({ metaTitle: 'T', metaDescription: 'D', metaRobots: 'noindex, follow' });
	});

	it('defaults to index, follow and tolerates null', () => {
		expect(adaptYoastSeo({}).metaRobots).toBe('index, follow');
		expect(adaptYoastSeo(null)).toBeNull();
	});
});

describe('adaptMenu', () => {
	const nodes = [
		{ id: 'a', label: 'About', uri: '/about/', url: 'https://wp.example.test/about/', order: 2 },
		{ id: 'b', label: 'Child', uri: '/our-services/residential/', url: 'https://wp.example.test/x/', parentId: 'p' },
		{ id: 'c', label: 'Ext', uri: '/', url: 'https://other.test/page', target: '_blank' }
	];

	it('produces the flat shape buildNavTree expects', () => {
		const [about, child] = adaptMenu({ nodes });
		expect(about).toMatchObject({ id: 'a', title: 'About', path: '/about/', order: 2, type: 'INTERNAL', parent: null });
		expect(child.parent).toEqual({ id: 'p' });
	});

	it('flags external and new-tab links', () => {
		const ext = adaptMenu({ nodes })[2];
		expect(ext.type).toBe('EXTERNAL');
		expect(ext.externalPath).toBe('https://other.test/page');
	});

	it('copes with no menu', () => {
		expect(adaptMenu(null)).toEqual([]);
	});
});

describe('small adapters', () => {
	it('adaptButton', () => {
		expect(adaptButton({ label: 'Go', url: '/x', openInNewTab: true })).toEqual({
			label: 'Go',
			url: '/x',
			open_in_new_tab: true
		});
		expect(adaptButton(null)).toBeNull();
	});

	it('adaptIconCard uses the Strapi field names', () => {
		expect(adaptIconCard({ cardTitle: 'T', description: 'D' })).toEqual({ Title: 'T', Description: 'D', Icon: null });
	});
});

describe('adaptServiceCard', () => {
	it('unwraps the ACF select array and carries banner_text and svg_icon', () => {
		const card = adaptServiceCard({
			databaseId: 1,
			title: 'Solar PV',
			slug: 'solar-pv',
			serviceFields: {
				category: ['residential'],
				bannerText: 'Generate your own power',
				svgIcon: { node: { sourceUrl: 'https://wp.example.test/bolt.svg' } }
			}
		});
		expect(card).toMatchObject({
			slug: 'solar-pv',
			category: 'residential',
			banner_text: 'Generate your own power'
		});
		expect(card.svg_icon.url).toBe('https://wp.example.test/bolt.svg');
	});

	it('has no icon when the field is empty (so the card renders none)', () => {
		const card = adaptServiceCard({ title: 'X', slug: 'x', serviceFields: { category: ['commercial'], svgIcon: null } });
		expect(card.svg_icon).toBeNull();
		expect(card.banner_text).toBe('');
	});
});

describe('adaptArticle', () => {
	it('maps a post to the article shape', () => {
		const a = adaptArticle({
			databaseId: 7,
			title: 'Hello',
			slug: 'hello',
			date: '2026-05-19T13:10:44',
			articleFields: { description: 'Intro' }
		});
		expect(a).toMatchObject({ id: 7, slug: 'hello', publishedAt: '2026-05-19T13:10:44', description: 'Intro' });
	});
});
