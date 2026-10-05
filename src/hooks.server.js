import { env } from '$env/dynamic/private';

const NOT_PRODUCTION = env.VERCEL_ENV && env.VERCEL_ENV !== 'production';

// CDN cache: fresh for a minute, then served stale while it revalidates, so a
// publish in WordPress shows up within a minute or two. Raise for less load.
const CACHE_CONTROL = 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400';

/** Security headers sent on every response. CSP itself comes from svelte.config.js. */
export const SECURITY_HEADERS = {
	'strict-transport-security': 'max-age=63072000; includeSubDomains',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'DENY',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
};

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	// Errors (404/500) must not be cached for long: a page created in WordPress
	// a minute later should not keep 404ing from the edge.
	response.headers.set(
		'cache-control',
		response.status >= 400 ? 'no-store' : CACHE_CONTROL
	);

	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(name, value);
	}

	// Vercel preview/staging deployments must never be indexed.
	if (NOT_PRODUCTION) {
		response.headers.set('x-robots-tag', 'noindex, nofollow');
	}

	return response;
}

/** Log server errors without leaking details to the visitor. */
export function handleError({ error, event, status }) {
	if (status !== 404) {
		console.error(`[error] ${event.request.method} ${event.url.pathname}`, error);
	}
	return { message: status === 404 ? 'Page not found' : 'Something went wrong' };
}
