import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptServiceLanding, adaptServiceCard } from '$lib/server/adapters';
import { SERVICE_LANDING_BY_URI_QUERY, SERVICES_QUERY } from '$lib/server/queries';

export const prerender = false;
export const ssr = true;

export async function load({ params, depends }) {
	depends('app:service-landing');
	depends('app:services');

	/* 1. Service Landing page — a child WP Page of "Our Services" whose slug
	 *    is the `category` param (e.g. /our-services/residential/). */
	const landingData = await wpQuery(
		SERVICE_LANDING_BY_URI_QUERY,
		{ uri: `/our-services/${params.category}/` },
		{ required: false, fallback: null }
	);

	if (!landingData?.page) {
		throw error(404, 'Service landing not found');
	}

	const landingPage = adaptServiceLanding(landingData.page);

	/* 2. Services in the category this landing page lists. */
	const servicesData = await wpQuery(
		SERVICES_QUERY,
		{ first: 100 },
		{ required: false, fallback: { services: { nodes: [] } } }
	);

	const services = (servicesData?.services?.nodes || [])
		.map(adaptServiceCard)
		.filter((s) => s.category === landingPage.services_to_show);

	return {
		landingPage,
		services,
		currentCategory: params.category
	};
}
