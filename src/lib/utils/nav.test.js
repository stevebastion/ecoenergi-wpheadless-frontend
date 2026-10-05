import { describe, it, expect } from 'vitest';
import { buildNavTree } from './buildNavTree';
import { resolveNavPath, trimTrailingSlash } from './resolveNavPath';
import { isNavItemActive } from './isActive';

describe('trimTrailingSlash', () => {
	it('removes trailing slashes but leaves the root alone', () => {
		expect(trimTrailingSlash('/about/')).toBe('/about');
		expect(trimTrailingSlash('/a/b//')).toBe('/a/b');
		expect(trimTrailingSlash('/')).toBe('/');
	});
});

describe('resolveNavPath', () => {
	it('drops the WordPress trailing slash so links match SvelteKit routes', () => {
		expect(resolveNavPath({ type: 'INTERNAL', path: '/about/' })).toBe('/about');
		expect(resolveNavPath({ type: 'INTERNAL', path: '/our-services/residential/' })).toBe(
			'/our-services/residential'
		);
	});

	it('uses the literal URL for external links and falls back to "/"', () => {
		expect(resolveNavPath({ type: 'EXTERNAL', externalPath: 'https://x.test/a/' })).toBe('https://x.test/a/');
		expect(resolveNavPath({ type: 'INTERNAL' })).toBe('/');
		expect(resolveNavPath(null)).toBe('/');
	});
});

describe('isNavItemActive', () => {
	it('matches WordPress-style paths against SvelteKit pathnames', () => {
		expect(isNavItemActive({ path: '/about/' }, '/about')).toBe(true);
		expect(isNavItemActive({ path: '/about' }, '/about/')).toBe(true);
	});

	it('is active on deeper routes in the same section', () => {
		expect(isNavItemActive({ path: '/articles/' }, '/articles/hello-world')).toBe(true);
	});

	it('does not match sibling paths that merely share a prefix', () => {
		expect(isNavItemActive({ path: '/art/' }, '/articles')).toBe(false);
	});

	it('home is only active on the home page', () => {
		expect(isNavItemActive({ path: '/' }, '/')).toBe(true);
		expect(isNavItemActive({ path: '/' }, '/about')).toBe(false);
	});

	it('is false for missing items or paths', () => {
		expect(isNavItemActive(null, '/')).toBe(false);
		expect(isNavItemActive({}, '/about')).toBe(false);
	});
});

describe('buildNavTree', () => {
	const flat = [
		{ id: 'c2', title: 'Commercial', order: 2, parent: { id: 'p' } },
		{ id: 'p', title: 'Services', order: 1, parent: null },
		{ id: 'c1', title: 'Residential', order: 1, parent: { id: 'p' } },
		{ id: 'o', title: 'About', order: 0, parent: null }
	];

	it('nests children under their parent and sorts by order', () => {
		const tree = buildNavTree(flat);
		expect(tree.map((n) => n.title)).toEqual(['About', 'Services']);
		expect(tree[1].items.map((n) => n.title)).toEqual(['Residential', 'Commercial']);
	});

	it('does not mutate its input', () => {
		const copy = JSON.stringify(flat);
		buildNavTree(flat);
		expect(JSON.stringify(flat)).toBe(copy);
	});

	it('handles empty and orphaned items', () => {
		expect(buildNavTree()).toEqual([]);
		expect(buildNavTree([{ id: 'x', title: 'X', parent: { id: 'missing' } }])).toEqual([]);
	});
});
