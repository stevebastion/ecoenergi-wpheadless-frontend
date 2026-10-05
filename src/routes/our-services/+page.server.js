import { redirect } from '@sveltejs/kit';

/**
 * The `/our-services` index has no designed page yet, but menus, breadcrumbs
 * and external links target it. Permanently deep-link to the default landing.
 * Swap the redirect for a real `load` + a designed page when the index gets
 * its own content (and expect browsers to have cached this redirect).
 */
export function load() {
	throw redirect(308, '/our-services/residential');
}
