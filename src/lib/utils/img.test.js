import { describe, it, expect, vi, beforeEach } from 'vitest';

const WP = 'https://wp.example.test';

vi.mock('$env/static/public', () => ({ PUBLIC_WP_URL: 'https://wp.example.test' }));

const load = async (dev) => {
	vi.resetModules();
	vi.doMock('$app/environment', () => ({ dev }));
	vi.doMock('$env/static/public', () => ({ PUBLIC_WP_URL: WP }));
	return import('./img.js');
};

describe('canOptimise', () => {
	it('is off in dev (no /_vercel/image endpoint locally)', async () => {
		const { canOptimise } = await load(true);
		expect(canOptimise(`${WP}/a.jpg`)).toBe(false);
	});

	it('accepts WordPress uploads and same-origin paths', async () => {
		const { canOptimise } = await load(false);
		expect(canOptimise(`${WP}/wp-content/uploads/a.jpg`)).toBe(true);
		expect(canOptimise('/hero.webp')).toBe(true);
	});

	it('rejects other hosts (Vercel would answer 400), SVG, GIF, protocol-relative and empty', async () => {
		const { canOptimise } = await load(false);
		expect(canOptimise('https://other.test/a.jpg')).toBe(false);
		expect(canOptimise(`${WP}/logo.svg`)).toBe(false);
		expect(canOptimise(`${WP}/anim.gif?x=1`)).toBe(false);
		expect(canOptimise('//evil.test/a.jpg')).toBe(false);
		expect(canOptimise('')).toBe(false);
		expect(canOptimise(null)).toBe(false);
	});
});

describe('optimised', () => {
	it('returns the original URL when it cannot be optimised', async () => {
		const { optimised } = await load(true);
		expect(optimised(`${WP}/a.jpg`, 800)).toBe(`${WP}/a.jpg`);
	});

	it('builds a /_vercel/image URL with an encoded source', async () => {
		const { optimised } = await load(false);
		const url = optimised(`${WP}/a b.jpg`, 1024, 80);
		expect(url).toBe(`/_vercel/image?url=${encodeURIComponent(`${WP}/a b.jpg`)}&w=1024&q=80`);
	});

	it('snaps the width UP to an allowed size, capped at the largest', async () => {
		const { optimised } = await load(false);
		expect(optimised(`${WP}/a.jpg`, 700)).toContain('&w=768&');
		expect(optimised(`${WP}/a.jpg`, 99999)).toContain('&w=2560&');
	});
});

describe('srcset', () => {
	it('is undefined (attribute omitted) when not optimisable', async () => {
		const { srcset } = await load(true);
		expect(srcset(`${WP}/a.jpg`)).toBeUndefined();
	});

	it('lists every allowed width up to the source width', async () => {
		const { srcset } = await load(false);
		const out = srcset(`${WP}/a.jpg`, 1000);
		const widths = out.split(', ').map((p) => p.split(' ')[1]);
		expect(widths).toEqual(['320w', '480w', '640w', '768w']);
	});

	it('still offers one size for a tiny source image', async () => {
		const { srcset } = await load(false);
		expect(srcset(`${WP}/a.jpg`, 100).split(', ')).toHaveLength(1);
	});
});
