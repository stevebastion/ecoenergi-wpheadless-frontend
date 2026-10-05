/**
 * Cookie consent: categories, the stored record, and (de)serialisation.
 * Pure functions only, so it is unit-testable without a browser.
 */

/** Bump to ask everyone again (e.g. when a new category or tool is added). */
export const CONSENT_VERSION = 1;
export const COOKIE_NAME = 'ee_consent';
export const MAX_AGE_DAYS = 180;

export const CATEGORIES = [
	{
		id: 'necessary',
		label: 'Strictly necessary',
		required: true,
		description:
			'Needed for the site to work and to remember your choices here. These cannot be switched off.',
		cookies: [
			{ name: COOKIE_NAME, purpose: 'Remembers your cookie choices', duration: '6 months' },
			{
				name: 'Cloudflare Turnstile',
				purpose: 'Spam protection on the contact form',
				duration: 'Session'
			}
		]
	},
	{
		id: 'analytics',
		label: 'Analytics',
		required: false,
		description:
			'Helps us understand how the site is used so we can improve it (Google Analytics). Data is anonymised and not used for advertising.',
		cookies: [
			{ name: '_ga, _ga_*', purpose: 'Distinguishes visitors and sessions', duration: '2 years' }
		]
	},
	{
		id: 'marketing',
		label: 'Marketing',
		required: false,
		description:
			'Used to show relevant adverts and measure campaigns. We do not currently use any marketing cookies; this setting is here so your choice is already recorded if we do.',
		cookies: []
	}
];

export const defaultChoices = () => ({ necessary: true, analytics: false, marketing: false });
export const acceptAll = () => ({ necessary: true, analytics: true, marketing: true });
export const rejectAll = () => defaultChoices();

/** Strictly-necessary is always on, whatever was passed in. */
export function normalise(choices = {}) {
	return {
		necessary: true,
		analytics: choices.analytics === true,
		marketing: choices.marketing === true
	};
}

export function serialise(choices, now = Date.now()) {
	const c = normalise(choices);
	return JSON.stringify({ v: CONSENT_VERSION, t: now, analytics: c.analytics, marketing: c.marketing });
}

/** Stored value -> choices, or null if missing, corrupt or from an older version. */
export function parse(raw) {
	if (!raw) return null;
	try {
		const data = JSON.parse(raw);
		if (!data || data.v !== CONSENT_VERSION) return null;
		return normalise(data);
	} catch {
		return null;
	}
}

/** Read our cookie out of a `document.cookie` string. */
export function readCookie(cookieString = '', name = COOKIE_NAME) {
	for (const part of cookieString.split(';')) {
		const [key, ...rest] = part.trim().split('=');
		if (key === name) {
			try {
				return decodeURIComponent(rest.join('='));
			} catch {
				return null;
			}
		}
	}
	return null;
}

/** Full `Set-Cookie`-style string for `document.cookie = ...`. */
export function buildCookie(choices, { secure = false, now = Date.now() } = {}) {
	return [
		`${COOKIE_NAME}=${encodeURIComponent(serialise(choices, now))}`,
		'Path=/',
		`Max-Age=${MAX_AGE_DAYS * 24 * 60 * 60}`,
		'SameSite=Lax',
		secure ? 'Secure' : ''
	]
		.filter(Boolean)
		.join('; ');
}
