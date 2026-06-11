import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptHome } from '$lib/server/adapters';
import { HOME_QUERY } from '$lib/server/queries';

export const prerender = false;

export async function load() {
	const data = await wpQuery(HOME_QUERY, {}, { required: false, fallback: null });

	const pageData = adaptHome(data?.page);

	if (!pageData) {
		throw error(404, 'Home page content not found');
	}

	return {
		pageData,
		id: 'home'
	};
}
