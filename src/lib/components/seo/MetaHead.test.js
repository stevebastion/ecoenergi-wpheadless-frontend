import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { readable } from 'svelte/store';

vi.mock('$env/static/public', () => ({
	PUBLIC_SITE_URL: 'https://example.test',
	PUBLIC_WP_URL: 'https://wp.example.test'
}));

const mockPage = (pathname, search = '', data = {}) => {
	vi.doMock('$app/stores', () => ({
		page: readable({ url: new URL(`https://localhost:5173${pathname}${search}`), data })
	}));
};

async function head(props, pathname = '/about', search = '', data = {}) {
	vi.resetModules();
	mockPage(pathname, search, data);
	const { default: MetaHead } = await import('./MetaHead.svelte');
	return render(MetaHead, { props }).head;
}

const jsonLd = (html) => {
	const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
	return { count: blocks.length, graph: blocks.length ? JSON.parse(blocks[0][1])['@graph'] : [] };
};

describe('MetaHead', () => {
	it('outputs title, description, robots and a site-built canonical', async () => {
		const html = await head({
			pageSeo: { metaTitle: 'About | Eco Energi', metaDescription: 'Who we are', metaRobots: 'index, follow' }
		});
		expect(html).toContain('<title>About | Eco Energi</title>');
		expect(html).toContain('<meta name="description" content="Who we are"/>');
		expect(html).toContain('<meta name="robots" content="index, follow"/>');
		expect(html).toContain('<link rel="canonical" href="https://example.test/about"/>');
		expect(html).toContain('<meta property="og:url" content="https://example.test/about"/>');
		expect(html).not.toContain('localhost');
	});

	it('honours a noindex from Yoast', async () => {
		const html = await head({ pageSeo: { metaRobots: 'noindex, follow' } });
		expect(html).toContain('<meta name="robots" content="noindex, follow"/>');
	});

	it('always has an og:image (site default when the page has none)', async () => {
		const html = await head({});
		expect(html).toContain('<meta property="og:image" content="https://example.test/og-default.png"/>');
		expect(html).toContain('summary_large_image');
	});

	it('emits exactly ONE JSON-LD block containing Organization, WebSite, WebPage and breadcrumbs', async () => {
		const { count, graph } = jsonLd(await head({ pageTitle: 'About us' }));
		expect(count).toBe(1);
		expect(graph.map((n) => n['@type'])).toEqual(['Organization', 'WebSite', 'WebPage', 'BreadcrumbList']);
	});

	it('builds breadcrumbs from the URL, using the page title for the last crumb', async () => {
		const { graph } = jsonLd(await head({ pageTitle: 'Solar PV' }, '/our-services/residential/solar-pv'));
		const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList').itemListElement;
		expect(crumbs.map((c) => c.name)).toEqual(['Home', 'Our Services', 'Residential', 'Solar PV']);
		expect(crumbs[3].item).toBe('https://example.test/our-services/residential/solar-pv');
		expect(crumbs.map((c) => c.position)).toEqual([1, 2, 3, 4]);
	});

	it('has no breadcrumb on the home page', async () => {
		const { graph } = jsonLd(await head({}, '/'));
		expect(graph.map((n) => n['@type'])).not.toContain('BreadcrumbList');
	});

	it('adds an Article node that points at the shared Organization', async () => {
		const html = await head(
			{
				ogType: 'article',
				publishedTime: '2026-05-19T13:10:44',
				entity: { type: 'Article', headline: 'Hello', datePublished: '2026-05-19T13:10:44' }
			},
			'/articles/hello'
		);
		const { count, graph } = jsonLd(html);
		const article = graph.find((n) => n['@type'] === 'Article');
		expect(count).toBe(1);
		expect(article.headline).toBe('Hello');
		expect(article.publisher).toEqual({ '@id': 'https://example.test/#organization' });
		expect(html).toContain('<meta property="og:type" content="article"/>');
	});

	it('uses provider (not publisher) for a Service', async () => {
		const { graph } = jsonLd(await head({ entity: { type: 'Service', name: 'Solar PV' } }, '/our-services/residential/solar-pv'));
		const svc = graph.find((n) => n['@type'] === 'Service');
		expect(svc.provider).toBeDefined();
		expect(svc.publisher).toBeUndefined();
	});

	it('includes phone and email from Site Settings in the Organization', async () => {
		const { graph } = jsonLd(await head({}, '/about', '', { global: { data: { phone_number: '0191 000 0000', email_address: 'hi@example.test' } } }));
		const org = graph.find((n) => n['@type'] === 'Organization');
		expect(org.telephone).toBe('0191 000 0000');
		expect(org.email).toBe('hi@example.test');
	});

	it('cannot be broken out of the script tag by content containing "</script>"', async () => {
		const html = await head({ pageTitle: 'x</script><script>alert(1)</script>' });
		expect(html.match(/<script type="application\/ld\+json">/g)).toHaveLength(1);
		expect(html).not.toContain('</script><script>alert(1)');
	});

	it('canonicalises a paginated list to its own page', async () => {
		const html = await head({}, '/articles', '?page=3');
		expect(html).toContain('<link rel="canonical" href="https://example.test/articles?page=3"/>');
	});
});
