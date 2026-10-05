import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_WP_URL: 'https://wp.example.test' } }));
vi.mock('$env/dynamic/private', () => ({ env: {} }));
vi.mock('$app/environment', () => ({ dev: false }));

import { pagePath, collectEntries, buildSitemapXml } from './sitemap.js';

describe('pagePath', () => {
	it.each([
		['/', '/'],
		['/about/', '/about'],
		['/privacy-policy/', '/privacy-policy'],
		['/our-services/residential/', '/our-services/residential']
	])('maps %s -> %s', (uri, expected) => {
		expect(pagePath(uri)).toBe(expected);
	});

	it.each(['/our-services/', '/a/b/c/', '/our-services/a/b/', '', '/no-trailing-slash'])(
		'skips %s (no matching frontend route)',
		(uri) => {
			expect(pagePath(uri)).toBeNull();
		}
	);
});

describe('collectEntries', () => {
	const data = {
		pages: {
			nodes: [
				{ uri: '/', modified: '2026-05-20T13:50:40' },
				{ uri: '/our-services/', modified: '2026-05-20T13:05:41' },
				{ uri: '/hidden/', modified: '2026-05-20T13:05:41', seo: { metaRobotsNoindex: 'noindex' } }
			]
		},
		posts: { nodes: [{ slug: 'hello-world', modified: '2026-05-19T13:10:44' }] },
		caseStudies: { nodes: [{ slug: 'big-job', modified: '2026-05-20T13:02:05' }] },
		services: {
			nodes: [
				{ slug: 'solar-pv', modified: '2026-09-30T15:02:21', serviceFields: { category: ['residential'] } },
				{ slug: 'orphan', modified: '2026-09-30T15:02:21', serviceFields: { category: [] } }
			]
		}
	};

	it('maps each content type to its frontend URL', () => {
		const paths = collectEntries(data).map((e) => e.path);
		expect(paths).toEqual([
			'/',
			'/articles/hello-world',
			'/case-studies/big-job',
			'/our-services/residential/solar-pv',
			'/articles',
			'/case-studies'
		]);
	});

	it('leaves out noindex pages, the /our-services redirect, and services with no category', () => {
		const paths = collectEntries(data).map((e) => e.path);
		expect(paths).not.toContain('/hidden');
		expect(paths).not.toContain('/our-services');
		expect(paths.some((p) => p.includes('orphan'))).toBe(false);
	});

	it('still returns the list pages when WordPress gave us nothing', () => {
		expect(collectEntries(null).map((e) => e.path)).toEqual(['/articles', '/case-studies']);
	});

	it('does not repeat a URL', () => {
		const dup = { posts: { nodes: [{ slug: 'x' }, { slug: 'x' }] } };
		expect(collectEntries(dup).filter((e) => e.path === '/articles/x')).toHaveLength(1);
	});
});

describe('buildSitemapXml', () => {
	it('emits a valid urlset with absolute <loc> and ISO <lastmod>', () => {
		const xml = buildSitemapXml(
			[{ path: '/about', modified: '2026-05-20T13:50:40' }, { path: '/articles' }],
			'https://example.test'
		);
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://example.test/about</loc><lastmod>2026-05-20T13:50:40.000Z</lastmod>');
		expect(xml).toContain('<url><loc>https://example.test/articles</loc></url>');
	});

	it('escapes XML special characters', () => {
		const xml = buildSitemapXml([{ path: '/a&b<c>' }], 'https://example.test');
		expect(xml).toContain('/a&amp;b&lt;c&gt;');
	});
});
