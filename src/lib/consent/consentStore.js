import { writable, get } from 'svelte/store';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import {
	COOKIE_NAME,
	acceptAll,
	buildCookie,
	defaultChoices,
	normalise,
	parse,
	readCookie,
	rejectAll
} from './consent.js';
import { applyAnalytics } from './analytics.js';

/**
 * `ready`   - we have read the cookie (false during SSR, so no banner flash)
 * `decided` - the visitor has made a choice that is still valid
 */
export const consent = writable({ ready: false, decided: false, choices: defaultChoices() });

/** Is the preferences dialog open? */
export const preferencesOpen = writable(false);

function apply(choices) {
	applyAnalytics(choices, { gaId: env.PUBLIC_GA_ID, dev });
}

/** Call once on the client after mount. */
export function initConsent() {
	if (!browser) return;
	const stored = parse(readCookie(document.cookie));
	consent.set({ ready: true, decided: !!stored, choices: stored ?? defaultChoices() });
	// Always run, even undecided: it registers Consent Mode "denied" by default.
	apply(stored ?? defaultChoices());
}

export function saveChoices(choices) {
	const clean = normalise(choices);
	if (browser) {
		document.cookie = buildCookie(clean, { secure: location.protocol === 'https:' });
	}
	consent.set({ ready: true, decided: true, choices: clean });
	preferencesOpen.set(false);
	apply(clean);
}

export const acceptAllCookies = () => saveChoices(acceptAll());
export const rejectAllCookies = () => saveChoices(rejectAll());
export const openPreferences = () => preferencesOpen.set(true);
export const closePreferences = () => preferencesOpen.set(false);
export const currentChoices = () => get(consent).choices;
