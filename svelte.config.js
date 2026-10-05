import adapter from '@sveltejs/adapter-vercel';
import { loadEnv } from 'vite';
import { IMAGE_WIDTHS } from './src/lib/config/imageWidths.js';

const env = loadEnv('production', process.cwd(), 'PUBLIC_');

/** Origin of the WordPress backend (media, hero video, REST form endpoint). */
const WP_ORIGIN = env.PUBLIC_WP_URL ? new URL(env.PUBLIC_WP_URL).origin : '';
const WP_HOST = WP_ORIGIN ? new URL(WP_ORIGIN).hostname : '';

const SELF = "'self'";
const MAPBOX = ['https://api.mapbox.com', 'https://*.tiles.mapbox.com', 'https://events.mapbox.com'];
const TURNSTILE = 'https://challenges.cloudflare.com';

// Google Analytics is only allowed through the CSP when a measurement ID is set.
const GA = env.PUBLIC_GA_ID
	? {
			script: ['https://www.googletagmanager.com'],
			connect: [
				'https://www.google-analytics.com',
				'https://*.google-analytics.com',
				'https://*.analytics.google.com',
				'https://www.googletagmanager.com'
			],
			img: ['https://www.google-analytics.com', 'https://www.googletagmanager.com']
		}
	: { script: [], connect: [], img: [] };

export default {
	// Vitest renders components on the server; Svelte's dev-only SSR checks trip there.
	compilerOptions: process.env.VITEST ? { dev: false } : {},
	kit: {
		adapter: adapter({
			images: {
				sizes: IMAGE_WIDTHS,
				formats: ['image/avif', 'image/webp'],
				minimumCacheTTL: 60 * 60 * 24 * 30,
				remotePatterns: WP_HOST ? [{ protocol: 'https', hostname: WP_HOST }] : []
			}
		}),

		// SvelteKit adds nonces/hashes for its own inline bootstrap script.
		csp: {
			mode: 'auto',
			directives: {
				'default-src': [SELF],
				'script-src': [SELF, TURNSTILE, ...GA.script],
				// Svelte scoped styles and app.html carry inline <style>.
				'style-src': [SELF, 'unsafe-inline'],
				'img-src': [SELF, 'data:', 'blob:', WP_ORIGIN, ...MAPBOX, ...GA.img].filter(Boolean),
				'font-src': [SELF, 'data:'],
				'media-src': [SELF, 'blob:', WP_ORIGIN].filter(Boolean),
				'connect-src': [SELF, WP_ORIGIN, TURNSTILE, ...MAPBOX, ...GA.connect].filter(Boolean),
				'worker-src': [SELF, 'blob:'],
				'child-src': ['blob:'],
				'frame-src': [TURNSTILE],
				'object-src': ["'none'"],
				'base-uri': [SELF],
				'form-action': [SELF],
				'frame-ancestors': ["'none'"],
				'manifest-src': [SELF]
			}
		}
	}
};
