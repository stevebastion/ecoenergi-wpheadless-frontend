import { env } from '$env/dynamic/private';

const NOT_PRODUCTION = env.VERCEL_ENV && env.VERCEL_ENV !== 'production';

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set(
		'cache-control',
		'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
	);

	// Vercel preview/staging deployments must never be indexed.
	if (NOT_PRODUCTION) {
		response.headers.set('x-robots-tag', 'noindex, nofollow');
	}

	return response;
}
