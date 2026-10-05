<script>
    import { optimised, srcset } from '$lib/utils/img';
    import { page } from '$app/stores';
    import { strapiMedia } from '$lib/utils/media';
  export let data;
  import LatestNews from '$lib/components/global/LatestNews.svelte';
  import CMSBlocks from '$lib/components/common/CMSBlocks.svelte';
  import ContactCTA from '$lib/components/global/ContactCTA.svelte';

   // SEO
   import MetaHead  from '$lib/components/seo/MetaHead.svelte';


</script>

<MetaHead
  pageSeo={data.article.seo}
  pageTitle={data.article.title}
  pageDescription={data.article.description}
  pageImage={data.article.cover}
  ogType="article"
  publishedTime={data.article.publishedAt}
  entity={{
    type: 'Article',
    headline: data.article.title,
    datePublished: data.article.publishedAt,
    ...(data.article.cover?.url ? { image: strapiMedia(data.article.cover.url) } : {})
  }}
/>

<section class="article" data-header-theme="dark">
    <article>
        <div class="article__lead">
            <div class="container">
                <header>
                    <h1>{data.article.title}</h1>
                    <time datetime={data.article.publishedAt}>{new Date(data.article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </header>
                
                {#if data.article.cover}
                    <figure class="img-cover featured-image">
                        <img loading="lazy" width="{data.article.cover.width}" height="{data.article.cover.height}" src={optimised(strapiMedia(data.article.cover.url), 1280)} srcset={srcset(strapiMedia(data.article.cover.url), data.article.cover.width || Infinity)} sizes="(min-width: 1024px) 50vw, 100vw" alt={data.article.cover.alternativeText || ''} />
                    </figure>
                {/if}
            </div>
        </div>
        <div class="vr vr--space-bottom vr--space-m-bottomNone">
        <CMSBlocks data={data.article.blocks} />
        
        <LatestNews articles={data.latestArticles.data} />

        <ContactCTA />
        </div>
        
        <!-- render blocks / components -->
    </article>
</section>


<style>
    h1 {
        max-width: 992px;
    }

    time {
        color: var( --color-primary-tint );
       
    }
    .featured-image {
        aspect-ratio: 16 / 8;
        border-radius: var( --border-radius );
        overflow: hidden;
    }

    header {
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    @media screen and ( max-width: 767px ) {
        .article__lead .container {
            width: 100%;
            display: flex;
            flex-direction: column-reverse;
        }
        .article__lead header {
            padding: 0 5vw;
        }
        .article__lead .featured-image {
            aspect-ratio: 4 / 3;
            border-radius: unset;
        }
        
    }
</style>