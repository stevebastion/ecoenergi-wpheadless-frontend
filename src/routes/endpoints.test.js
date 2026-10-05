import { describe, it, expect, vi } from 'vitest';

vi.mock('$env/static/public', () => ({
	PUBLIC_SITE_URL: 'https://example.test',
	PUBLIC_WP_URL: 'https://wp.example.test'
}));
vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_WP_URL: 'https://wp.example.test' } }));
vi.mock('$app/environment', () => ({ dev: false }));

const wpQuery = vi.fn();
vi.mock('$lib/server/wp', () => ({ wpQuery: (...a) => wpQuery(...a) }));

async function robots(env) {
	vi.resetModules();
	vi.doMock('$env/dynamic/private', () => ({ env }));
	vi.doMock('$env/static/public', () => ({ PUBLIC_SITE_URL: 'https://example.test', PUBLIC_WP_URL: 'https://wp.example.test' }));
	const { GET } = await import('./robots.txt/+server.js');
	return GET({ url: new URL('https://request.test/robots.txt') });
}

describe('GET /robots.txt', () => {
	it('allows crawling and points at the sitemap in production', async () => {
		const res = await robots({ VERCEL_ENV: 'production' });
		const body = await res.text();
		expect(res.headers.get('content-type')).toContain('text/plain');
		expect(body).toContain('Allow: /');
		expect(body).toContain('Sitemap: https://example.test/sitemap.xml');
		expect(body).not.toContain('Disallow: /');
	});

	it('blocks everything on preview deployments', async () => {
		const body = await (await robots({ VERCEL_ENV: 'preview' })).text();
		expect(body).toContain('Disallow: /');
		expect(body).not.toContain('Sitemap:');
	});

	it('is open for local dev (no VERCEL_ENV)', async () => {
		expect(await (await robots({})).text()).toContain('Allow: /');
	});
});

describe('GET /sitemap.xml', () => {
	it('returns XML built from WordPress content, with absolute site URLs', async () => {
		wpQuery.mockResolvedValue({
			pages: { nodes: [{ uri: '/about/', modified: '2026-05-20T12:38:54' }] },
			posts: { nodes: [{ slug: 'hello', modified: '2026-05-19T13:10:44' }] }
		});
		const { GET } = await import('./sitemap.xml/+server.js');
		const res = await GET({ url: new URL('https://request.test/sitemap.xml') });
		const xml = await res.text();

		expect(res.headers.get('content-type')).toContain('application/xml');
		expect(xml).toContain('<loc>https://example.test/about</loc>');
		expect(xml).toContain('<loc>https://example.test/articles/hello</loc>');
		expect(xml).not.toContain('wp.example.test');
	});

	it('still returns a valid sitemap if WordPress is down', async () => {
		wpQuery.mockResolvedValue(null);
		const { GET } = await import('./sitemap.xml/+server.js');
		const xml = await (await GET({ url: new URL('https://request.test/sitemap.xml') })).text();
		expect(xml).toContain('<urlset');
		expect(xml).toContain('https://example.test/articles');
	});
});
