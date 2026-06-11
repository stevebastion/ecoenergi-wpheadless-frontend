import { error } from '@sveltejs/kit';
import { wpQuery } from '$lib/server/wp';
import { adaptArticle } from '$lib/server/adapters';
import { ARTICLE_BY_SLUG_QUERY } from '$lib/server/queries';

export const prerender = false;

export async function load({ params }) {
	const data = await wpQuery(
		ARTICLE_BY_SLUG_QUERY,
		{ slug: params.slug },
		{ required: false, fallback: null }
	);

	if (!data?.post) {
		throw error(404, 'Article not found');
	}

	const article = adaptArticle(data.post);

	return {
		article,
		id: article.id
	};
}
