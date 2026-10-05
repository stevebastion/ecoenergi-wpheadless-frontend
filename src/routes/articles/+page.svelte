<script>
  import { page } from '$app/stores';
  import { strapiMedia } from '$lib/utils/media';

  import Pagination from '$lib/components/common/Pagination.svelte';
  import ArticleCard from '$lib/components/cards/ArticleCard.svelte';
  import ContactCTA from '$lib/components/global/ContactCTA.svelte';

  // SEO
  import MetaHead  from '$lib/components/seo/MetaHead.svelte';


  export let data;
</script>

<MetaHead
  pageTitle="Latest News & Energy Insights"
  pageDescription="Stay updated with the latest news and insights on energy solutions, sustainability, and industry trends from Eco Energi."
/>

<section class="container" data-header-theme="dark">
    <h1>Latest News & Energy Insights</h1>
   
</section>

<div class="vr vr--space-bottom vr--space-m-bottomNone">
  <section class="panel panel--light container container--wide" data-header-theme="dark">
  <div class="grid grid--3">
      {#each data.items as article}
          <ArticleCard
          title={article.title}
          description={article.description}
          image={strapiMedia(article.cover?.formats?.medium?.url || article.cover?.url)}
          date={article.publishedAt}
          url={`/articles/${article.slug}`}
          />
      {/each}
      </div>
  </section>
  <div class="container">
  <Pagination
    pagination={data.pagination}
    base="/articles"
  />
  </div>
<ContactCTA />
</div>  
