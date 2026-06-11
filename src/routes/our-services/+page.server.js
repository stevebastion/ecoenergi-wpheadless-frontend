import { redirect } from '@sveltejs/kit';

/**
 * The `/our-services` index has no designed page yet, but menus and external
 * links may still target it. Deep-link to the default landing so the URL
 * stays useful. Swap the redirect for a real `load` + a designed page when
 * the index gets its own content.
 */
export function load() {
	throw redirect(307, '/our-services/residential');
}
