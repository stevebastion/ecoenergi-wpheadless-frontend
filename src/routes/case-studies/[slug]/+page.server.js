import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptCaseStudy } from '$lib/server/adapters';
import { CASE_STUDY_BY_SLUG_QUERY } from '$lib/server/queries';

export async function load({ params, depends }) {
	depends('app:case-study');

	const data = await wpQuery(
		CASE_STUDY_BY_SLUG_QUERY,
		{ slug: params.slug },
		{ required: false, fallback: null }
	);

	if (!data?.caseStudy) {
		throw error(404, 'Case study not found');
	}

	return {
		caseStudy: adaptCaseStudy(data.caseStudy)
	};
}
