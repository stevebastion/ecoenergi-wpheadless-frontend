import { wpQuery } from '$lib/server/wp';
import { adaptArticleCard } from '$lib/server/adapters';
import { ARTICLES_QUERY } from '$lib/server/queries';

export const prerender = false;

const PAGE_SIZE = 12;

export async function load({ url, depends }) {
	depends('app:articles');

	const page = Number(url.searchParams.get('page')) || 1;

	// WPGraphQL is cursor-based; we fetch the set and paginate in-memory so the
	// existing page-number Pagination component keeps working.
	const data = await wpQuery(
		ARTICLES_QUERY,
		{ first: 100 },
		{ required: false, fallback: { posts: { nodes: [] } } }
	);

	const all = (data?.posts?.nodes || []).map(adaptArticleCard);
	const total = all.length;
	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const start = (page - 1) * PAGE_SIZE;

	return {
		items: all.slice(start, start + PAGE_SIZE),
		pagination: { page, pageSize: PAGE_SIZE, pageCount, total },
		page
	};
}
