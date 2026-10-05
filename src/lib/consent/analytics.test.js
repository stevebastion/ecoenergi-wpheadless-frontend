import { describe, it, expect, beforeEach } from 'vitest';
import { applyAnalytics, trackPageView, resetAnalytics } from './analytics.js';
import { acceptAll, rejectAll, defaultChoices } from './consent.js';

/** Minimal window/document stand-ins so we can run in node. */
function fakeBrowser(cookie = '') {
	const scripts = [];
	const jar = { value: cookie };
	const doc = {
		get cookie() {
			return jar.value;
		},
		set cookie(v) {
			// record the expiry writes only
			jar.written = [...(jar.written || []), v];
		},
		head: { appendChild: (el) => scripts.push(el) },
		createElement: () => ({})
	};
	const win = { location: { hostname: 'www.example.co.uk' } };
	return { win, doc, scripts, jar };
}

const calls = (win, kind) => win.dataLayer.map((a) => [...a]).filter((a) => a[0] === kind);

beforeEach(() => resetAnalytics());

describe('Consent Mode', () => {
	it('registers everything as DENIED before any choice is made', () => {
		const { win, doc } = fakeBrowser();
		applyAnalytics(defaultChoices(), { gaId: 'G-TEST', win, doc });
		const [def] = calls(win, 'consent').filter((a) => a[1] === 'default');
		expect(def[2]).toEqual({
			analytics_storage: 'denied',
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied'
		});
	});

	it('maps the analytics and marketing choices to the right signals', () => {
		const { win, doc } = fakeBrowser();
		applyAnalytics({ necessary: true, analytics: true, marketing: false }, { gaId: 'G-TEST', win, doc });
		const update = calls(win, 'consent').find((a) => a[1] === 'update')[2];
		expect(update.analytics_storage).toBe('granted');
		expect(update.ad_storage).toBe('denied');
	});
});

describe('loading Google Analytics', () => {
	it('loads NOTHING without consent, even with an ID configured', () => {
		const { win, doc, scripts } = fakeBrowser();
		const out = applyAnalytics(rejectAll(), { gaId: 'G-TEST', win, doc });
		expect(out.loaded).toBe(false);
		expect(scripts).toHaveLength(0);
		expect(calls(win, 'config')).toHaveLength(0);
	});

	it('loads NOTHING with consent but no ID (the faux-GA state)', () => {
		const { win, doc, scripts } = fakeBrowser();
		const out = applyAnalytics(acceptAll(), { gaId: '', win, doc });
		expect(out.loaded).toBe(false);
		expect(scripts).toHaveLength(0);
		expect(trackPageView('/', { win })).toBe(false);
	});

	it('loads gtag.js once, with anonymised IP and manual page views, after consent', () => {
		const { win, doc, scripts } = fakeBrowser();
		applyAnalytics(acceptAll(), { gaId: 'G-TEST123', win, doc });
		applyAnalytics(acceptAll(), { gaId: 'G-TEST123', win, doc }); // re-applying must not duplicate

		expect(scripts).toHaveLength(1);
		expect(scripts[0].src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123');
		expect(scripts[0].async).toBe(true);
		const configs = calls(win, 'config');
		expect(configs).toHaveLength(1);
		expect(configs[0][2]).toEqual({ anonymize_ip: true, send_page_view: false });
	});

	it('URL-encodes the measurement ID', () => {
		const { win, doc, scripts } = fakeBrowser();
		applyAnalytics(acceptAll(), { gaId: 'G-1&x=<y>', win, doc });
		expect(scripts[0].src).toContain(encodeURIComponent('G-1&x=<y>'));
	});
});

describe('withdrawing consent', () => {
	it('flips the signals to denied and expires Google cookies on every parent domain', () => {
		const { win, doc, jar } = fakeBrowser('_ga=1; _ga_ABC123=2; ee_consent=x; other=3');
		applyAnalytics(rejectAll(), { gaId: 'G-TEST', win, doc });

		const update = calls(win, 'consent').find((a) => a[1] === 'update')[2];
		expect(update.analytics_storage).toBe('denied');

		const expired = jar.written.filter((c) => c.includes('Max-Age=0'));
		expect(expired.some((c) => c.startsWith('_ga=;'))).toBe(true);
		expect(expired.some((c) => c.startsWith('_ga_ABC123=;'))).toBe(true);
		expect(expired.some((c) => c.includes('Domain=.www.example.co.uk'))).toBe(true);
		expect(expired.some((c) => c.includes('Domain=.example.co.uk'))).toBe(true);
	});

	it('never touches cookies that are not Google Analytics ones', () => {
		const { win, doc, jar } = fakeBrowser('ee_consent=x; session=abc; _gaming=1');
		applyAnalytics(rejectAll(), { gaId: 'G-TEST', win, doc });
		expect(jar.written || []).toEqual([]);
	});
});

describe('trackPageView', () => {
	it('sends a page_view once per path and ignores repeats', () => {
		const { win, doc } = fakeBrowser();
		applyAnalytics(acceptAll(), { gaId: 'G-TEST', win, doc });

		expect(trackPageView('/about', { win, title: 'About' })).toBe(true);
		expect(trackPageView('/about', { win })).toBe(false);
		expect(trackPageView('/contact', { win })).toBe(true);

		const events = calls(win, 'event').filter((a) => a[1] === 'page_view');
		expect(events.map((e) => e[2].page_path)).toEqual(['/about', '/contact']);
		expect(events[0][2].page_title).toBe('About');
	});
});
