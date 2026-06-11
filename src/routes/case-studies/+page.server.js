import { wpQuery } from '$lib/server/wp';
import { adaptCaseStudyCard } from '$lib/server/adapters';
import { CASE_STUDIES_QUERY } from '$lib/server/queries';

export const prerender = false;

const PAGE_SIZE = 12;

export async function load({ url, depends }) {
	depends('app:case-studies');

	const page = Number(url.searchParams.get('page')) || 1;

	const data = await wpQuery(
		CASE_STUDIES_QUERY,
		{ first: 100 },
		{ required: false, fallback: { caseStudies: { nodes: [] } } }
	);

	const all = (data?.caseStudies?.nodes || []).map(adaptCaseStudyCard);
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const start = (page - 1) * PAGE_SIZE;

	return {
		items: all.slice(start, start + PAGE_SIZE),
		pagination: { page, pageSize: PAGE_SIZE, pageCount, total },
		page
	};
}
