/**
 * Consent-gated Google Analytics (gtag.js + Consent Mode v2).
 *
 * Nothing is requested from Google unless BOTH hold:
 *   1. the visitor has accepted the Analytics category, and
 *   2. a measurement ID is configured (PUBLIC_GA_ID).
 * With no ID this module is a harmless no-op, so the banner works today and
 * analytics switches on the day an ID is added.
 */

const GA_COOKIE = /^(_ga(_.+)?|_gid|_gat.*)$/;

function ensureGtag(win) {
	if (win.gtag) return;
	win.dataLayer = win.dataLayer || [];
	win.gtag = function gtag() {
		win.dataLayer.push(arguments);
	};
	// Consent Mode default: everything denied until the visitor chooses.
	win.gtag('consent', 'default', {
		analytics_storage: 'denied',
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied'
	});
}

function clearGaCookies(doc, hostname = '') {
	const parts = hostname.split('.');
	// Try the host and each parent domain (".example.co.uk", ".co.uk" is refused by browsers, harmlessly).
	const domains = ['', ...parts.map((_, i) => '.' + parts.slice(i).join('.'))];
	for (const raw of doc.cookie.split(';')) {
		const name = raw.split('=')[0].trim();
		if (!GA_COOKIE.test(name)) continue;
		for (const domain of domains) {
			doc.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ''}`;
		}
	}
}

const state = { configured: false, scriptAdded: false, lastPath: null };

/** Test helper: forget what we have already loaded. */
export function resetAnalytics() {
	state.configured = false;
	state.scriptAdded = false;
	state.lastPath = null;
}

export function applyAnalytics(choices, { gaId, win = globalThis.window, doc = globalThis.document, dev = false } = {}) {
	if (!win || !doc) return { loaded: false };
	ensureGtag(win);

	win.gtag('consent', 'update', {
		analytics_storage: choices.analytics ? 'granted' : 'denied',
		ad_storage: choices.marketing ? 'granted' : 'denied',
		ad_user_data: choices.marketing ? 'granted' : 'denied',
		ad_personalization: choices.marketing ? 'granted' : 'denied'
	});

	if (!choices.analytics) {
		clearGaCookies(doc, win.location?.hostname);
		return { loaded: false };
	}

	if (!gaId) {
		if (dev) console.debug('[analytics] consent given, but PUBLIC_GA_ID is not set: nothing loaded');
		return { loaded: false };
	}

	if (!state.scriptAdded) {
		const script = doc.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
		doc.head.appendChild(script);
		state.scriptAdded = true;
	}

	if (!state.configured) {
		win.gtag('js', new Date());
		// Page views are sent manually (trackPageView) so client-side navigations count too.
		win.gtag('config', gaId, { anonymize_ip: true, send_page_view: false });
		state.configured = true;
	}

	return { loaded: true };
}

/** Send a page_view if analytics is live. De-duplicated per path. */
export function trackPageView(path, { win = globalThis.window, title = '' } = {}) {
	if (!state.configured || !win?.gtag || state.lastPath === path) return false;
	state.lastPath = path;
	win.gtag('event', 'page_view', { page_path: path, page_title: title });
	return true;
}
