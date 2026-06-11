import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptService, adaptServiceCard } from '$lib/server/adapters';
import { SERVICE_BY_SLUG_QUERY, SERVICES_QUERY } from '$lib/server/queries';

export const prerender = false;
export const ssr = true;

export async function load({ params, depends }) {
	depends('app:service');

	/* 1. The service itself. */
	const data = await wpQuery(
		SERVICE_BY_SLUG_QUERY,
		{ slug: params.slug },
		{ required: false, fallback: null }
	);

	if (!data?.service) {
		throw error(404, 'Service not found');
	}

	const service = adaptService(data.service);

	/* 2. Related services in the same category. */
	const servicesData = await wpQuery(
		SERVICES_QUERY,
		{ first: 100 },
		{ required: false, fallback: { services: { nodes: [] } } }
	);

	const relatedServices = (servicesData?.services?.nodes || [])
		.map(adaptServiceCard)
		.filter((s) => s.category === service.category && s.slug !== params.slug);

	return {
		service,
		relatedServices
	};
}
