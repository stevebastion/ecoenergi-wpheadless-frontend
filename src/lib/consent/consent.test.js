import { describe, it, expect } from 'vitest';
import {
	CATEGORIES,
	CONSENT_VERSION,
	COOKIE_NAME,
	MAX_AGE_DAYS,
	acceptAll,
	buildCookie,
	defaultChoices,
	normalise,
	parse,
	readCookie,
	rejectAll,
	serialise
} from './consent.js';

describe('defaults', () => {
	it('start with only strictly-necessary on (no pre-ticked optional cookies)', () => {
		expect(defaultChoices()).toEqual({ necessary: true, analytics: false, marketing: false });
		expect(rejectAll()).toEqual(defaultChoices());
	});

	it('accept all turns everything on', () => {
		expect(acceptAll()).toEqual({ necessary: true, analytics: true, marketing: true });
	});
});

describe('normalise', () => {
	it('forces strictly-necessary on, whatever is passed', () => {
		expect(normalise({ necessary: false, analytics: true }).necessary).toBe(true);
	});

	it('only treats a literal true as consent (no truthy strings)', () => {
		expect(normalise({ analytics: 'yes', marketing: 1 })).toEqual({
			necessary: true,
			analytics: false,
			marketing: false
		});
	});

	it('copes with nothing at all', () => {
		expect(normalise()).toEqual(defaultChoices());
	});
});

describe('serialise / parse', () => {
	it('round-trips', () => {
		const out = parse(serialise({ analytics: true, marketing: false }));
		expect(out).toEqual({ necessary: true, analytics: true, marketing: false });
	});

	it('stamps the version and time', () => {
		expect(JSON.parse(serialise(acceptAll(), 123))).toMatchObject({ v: CONSENT_VERSION, t: 123 });
	});

	it('rejects missing, corrupt and out-of-date records so the visitor is asked again', () => {
		expect(parse(null)).toBeNull();
		expect(parse('')).toBeNull();
		expect(parse('not json')).toBeNull();
		expect(parse('null')).toBeNull();
		expect(parse(JSON.stringify({ v: CONSENT_VERSION + 1, analytics: true }))).toBeNull();
		expect(parse(JSON.stringify({ analytics: true }))).toBeNull();
	});

	it('cannot be tricked into granting necessary=false or extra keys', () => {
		const out = parse(JSON.stringify({ v: CONSENT_VERSION, necessary: false, analytics: true, admin: true }));
		expect(out).toEqual({ necessary: true, analytics: true, marketing: false });
	});
});

describe('cookie helpers', () => {
	it('builds a first-party, SameSite=Lax, 6 month cookie', () => {
		const c = buildCookie(acceptAll(), { now: 1 });
		expect(c.startsWith(`${COOKIE_NAME}=`)).toBe(true);
		expect(c).toContain('Path=/');
		expect(c).toContain('SameSite=Lax');
		expect(c).toContain(`Max-Age=${MAX_AGE_DAYS * 86400}`);
		expect(c).not.toContain('Secure');
		expect(c).not.toContain('HttpOnly'); // the client must read it
	});

	it('adds Secure on https', () => {
		expect(buildCookie(acceptAll(), { secure: true })).toContain('Secure');
	});

	it('reads our cookie back out of document.cookie, among others', () => {
		const written = buildCookie({ analytics: true }).split(';')[0];
		const jar = `a=1; ${written}; b=2`;
		expect(parse(readCookie(jar))).toEqual({ necessary: true, analytics: true, marketing: false });
	});

	it('returns null when the cookie is absent or malformed', () => {
		expect(readCookie('a=1; b=2')).toBeNull();
		expect(readCookie('')).toBeNull();
		expect(readCookie(`${COOKIE_NAME}=%E0%A4%A`)).toBeNull();
	});
});

describe('categories', () => {
	it('has necessary (locked), analytics and marketing, each with a description', () => {
		expect(CATEGORIES.map((c) => c.id)).toEqual(['necessary', 'analytics', 'marketing']);
		expect(CATEGORIES.find((c) => c.id === 'necessary').required).toBe(true);
		for (const c of CATEGORIES) expect(c.description.length).toBeGreaterThan(20);
	});

	it('only lists the consent cookie and Turnstile as necessary', () => {
		const names = CATEGORIES[0].cookies.map((c) => c.name);
		expect(names).toContain(COOKIE_NAME);
	});
});
