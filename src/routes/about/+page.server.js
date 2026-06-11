import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptAbout } from '$lib/server/adapters';
import { ABOUT_QUERY } from '$lib/server/queries';

export const prerender = false;

export async function load() {
	const data = await wpQuery(ABOUT_QUERY, {}, { required: false, fallback: null });

	const aboutPage = adaptAbout(data?.page);

	if (!aboutPage) {
		throw error(404, 'About page content not found');
	}

	return {
		aboutPage,
		id: 'about'
	};
}
