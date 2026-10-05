import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { readable } from 'svelte/store';

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('https://localhost/'), data: {} })
}));
vi.mock('$app/navigation', () => ({ afterNavigate: () => {} }));
vi.mock('$app/environment', () => ({ browser: false, dev: false }));
vi.mock('$env/dynamic/public', () => ({ env: {} }));

describe('CookieConsent (server render)', () => {
	it('renders nothing on the server, so there is no banner flash for returning visitors', async () => {
		const { default: CookieConsent } = await import('./CookieConsent.svelte');
		const { body } = render(CookieConsent);
		expect(body).not.toContain('Accept all');
		expect(body).not.toContain('cc-banner');
		expect(body).not.toContain('dialog');
	});
});
