import { describe, it, expect, vi, beforeEach } from 'vitest';

async function load(env = {}) {
	vi.resetModules();
	vi.doMock('$env/dynamic/private', () => ({ env }));
	return import('./hooks.server.js');
}

const run = async (hooks, status = 200) => {
	const response = new Response('x', { status });
	return hooks.handle({
		event: { url: new URL('https://example.test/'), request: new Request('https://example.test/') },
		resolve: async () => response
	});
};

describe('handle: security headers', () => {
	it('sets the full header set on every response', async () => {
		const hooks = await load();
		const res = await run(hooks);
		for (const [name, value] of Object.entries(hooks.SECURITY_HEADERS)) {
			expect(res.headers.get(name)).toBe(value);
		}
		expect(res.headers.get('x-frame-options')).toBe('DENY');
		expect(res.headers.get('x-content-type-options')).toBe('nosniff');
		expect(res.headers.get('strict-transport-security')).toContain('max-age=');
		expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
	});

	it('denies camera, microphone and geolocation', async () => {
		const res = await run(await load());
		const policy = res.headers.get('permissions-policy');
		expect(policy).toContain('camera=()');
		expect(policy).toContain('microphone=()');
		expect(policy).toContain('geolocation=()');
	});
});

describe('handle: caching', () => {
	it('uses a short CDN TTL with stale-while-revalidate for normal pages', async () => {
		const res = await run(await load());
		const cc = res.headers.get('cache-control');
		expect(cc).toContain('s-maxage=60');
		expect(cc).toContain('stale-while-revalidate');
	});

	it('never caches errors at the edge', async () => {
		const hooks = await load();
		expect((await run(hooks, 404)).headers.get('cache-control')).toBe('no-store');
		expect((await run(hooks, 500)).headers.get('cache-control')).toBe('no-store');
	});
});

describe('handle: indexing', () => {
	it('adds X-Robots-Tag noindex on Vercel preview deployments', async () => {
		const res = await run(await load({ VERCEL_ENV: 'preview' }));
		expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');
	});

	it('leaves production and local dev indexable', async () => {
		expect((await run(await load({ VERCEL_ENV: 'production' }))).headers.get('x-robots-tag')).toBeNull();
		expect((await run(await load({}))).headers.get('x-robots-tag')).toBeNull();
	});
});

describe('handleError', () => {
	beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));

	it('returns a generic message and never leaks the error', async () => {
		const hooks = await load();
		const event = { request: new Request('https://example.test/x'), url: new URL('https://example.test/x') };
		const out = hooks.handleError({ error: new Error('db password is hunter2'), event, status: 500 });
		expect(out.message).toBe('Something went wrong');
		expect(JSON.stringify(out)).not.toContain('hunter2');
	});

	it('does not log 404s', async () => {
		const hooks = await load();
		const event = { request: new Request('https://example.test/x'), url: new URL('https://example.test/x') };
		hooks.handleError({ error: new Error('nf'), event, status: 404 });
		expect(console.error).not.toHaveBeenCalled();
	});
});
