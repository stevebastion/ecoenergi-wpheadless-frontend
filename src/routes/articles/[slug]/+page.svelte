<script>
    import { page } from '$app/stores';
    import { strapiMedia } from '$lib/utils/media';
  export let data;
  import LatestNews from '$lib/components/global/LatestNews.svelte';
  import CMSBlocks from '$lib/components/common/CMSBlocks.svelte';
  import ContactCTA from '$lib/components/global/ContactCTA.svelte';

   // SEO
   import MetaHead  from '$lib/components/seo/MetaHead.svelte';


     
    const defaultPageSeo = {
        title: 'EcoEnergi | Articles | ' + data.article.title,
        description: data.article.intro || '',
        imageUrl: data.article.cover || null,
        imageAlt: data.article.title
    };

</script>

<MetaHead 
  pageSeo={data.article.seo}
  globalSeo={defaultPageSeo}
  url={$page.url.href}
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
                        <img loading="lazy" width="{data.article.cover.width}" height="{data.article.cover.height}" src={strapiMedia(data.article.cover.formats?.large?.url || data.article.cover.url)} alt={data.article.title} />
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