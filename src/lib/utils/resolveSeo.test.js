import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
	PUBLIC_SITE_URL: 'https://example.test/',
	PUBLIC_WP_URL: 'https://wp.example.test'
}));

import { resolveSeo, formatLabel, siteOrigin, SITE_NAME } from './resolveSeo';

describe('siteOrigin', () => {
	it('uses PUBLIC_SITE_URL without a trailing slash', () => {
		expect(siteOrigin('http://request.test')).toBe('https://example.test');
	});
});

describe('resolveSeo: canonical', () => {
	it('is built from the site origin + path, never from Yoast', () => {
		const seo = resolveSeo({
			pageSeo: { canonicalURL: 'https://wp.example.test/about/' },
			path: '/about'
		});
		expect(seo.canonical).toBe('https://example.test/about');
	});

	it('drops trailing slashes but keeps the home page as "/"', () => {
		expect(resolveSeo({ path: '/about/' }).canonical).toBe('https://example.test/about');
		expect(resolveSeo({ path: '/' }).canonical).toBe('https://example.test/');
	});

	it('canonicalises paginated lists to themselves, page 1 to the bare path', () => {
		expect(resolveSeo({ path: '/articles', search: '?page=2' }).canonical).toBe(
			'https://example.test/articles?page=2'
		);
		expect(resolveSeo({ path: '/articles', search: '?page=1' }).canonical).toBe(
			'https://example.test/articles'
		);
	});

	it('ignores junk query strings', () => {
		expect(resolveSeo({ path: '/articles', search: '?page=abc&utm=x' }).canonical).toBe(
			'https://example.test/articles'
		);
	});
});

describe('resolveSeo: title, description, robots', () => {
	it('prefers Yoast, then global, then the page title, then the site name', () => {
		expect(resolveSeo({ pageSeo: { metaTitle: 'Yoast' }, pageTitle: 'Page' }).title).toBe('Yoast');
		expect(resolveSeo({ globalSeo: { metaTitle: 'Global' }, pageTitle: 'Page' }).title).toBe('Global');
		expect(resolveSeo({ pageTitle: 'Solar PV' }).title).toBe(`Solar PV | ${SITE_NAME}`);
		expect(resolveSeo({}).title).toBe(SITE_NAME);
	});

	it('falls back through description sources', () => {
		expect(resolveSeo({ pageSeo: { metaDescription: 'a' }, pageDescription: 'b' }).description).toBe('a');
		expect(resolveSeo({ pageDescription: 'b' }).description).toBe('b');
		expect(resolveSeo({}).description).toBe('');
	});

	it('defaults to index, follow and passes Yoast noindex through', () => {
		expect(resolveSeo({}).robots).toBe('index, follow');
		expect(resolveSeo({ pageSeo: { metaRobots: 'noindex, follow' } }).robots).toBe('noindex, follow');
	});
});

describe('resolveSeo: share image', () => {
	it('uses the Yoast image, making relative URLs absolute', () => {
		const seo = resolveSeo({
			pageSeo: { shareImage: { url: '/wp-content/uploads/a.jpg', width: 10, height: 20, alt: 'x' } }
		});
		expect(seo.image).toEqual({
			url: 'https://wp.example.test/wp-content/uploads/a.jpg',
			width: 10,
			height: 20,
			alt: 'x'
		});
	});

	it('falls back to the page image, then to the site default', () => {
		expect(
			resolveSeo({ pageImage: { url: 'https://cdn.test/a.jpg', alternativeText: 'Alt' } }).image.alt
		).toBe('Alt');

		const def = resolveSeo({}).image;
		expect(def.url).toBe('https://example.test/og-default.png');
		expect(def.width).toBe(1200);
		expect(def.height).toBe(630);
	});
});

describe('formatLabel', () => {
	it('title-cases slugs', () => {
		expect(formatLabel('our-services')).toBe('Our Services');
		expect(formatLabel('')).toBe('');
	});
});
