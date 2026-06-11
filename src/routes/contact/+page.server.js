import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptContact } from '$lib/server/adapters';
import { CONTACT_QUERY } from '$lib/server/queries';

export const prerender = false;

export async function load() {
	const data = await wpQuery(CONTACT_QUERY, {}, { required: false, fallback: null });

	const pageData = adaptContact(data?.page);

	if (!pageData) {
		throw error(404, 'Contact page content not found');
	}

	return {
		pageData,
		id: 'contact'
	};
}
