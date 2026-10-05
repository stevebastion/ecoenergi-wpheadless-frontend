<script>
    import { strapiMedia } from '$lib/utils/media';
    import GlideSlider from '$lib/components/common/GlideSlider.svelte';
    import ArticleCard from '$lib/components/cards/ArticleCard.svelte';
    import Button from '$lib/components/common/Button.svelte';

    export let articles = [];


    const sliderOptions = {
        type: 'carousel',
        perView: 3,
        gap: 20,
        autoplay: 5000,
        animationDuration: 800,
        hoverpause: true,
        breakpoints: {
            1024: {
                perView: 2
            },
            600: {
                perView: 1
            }
        }
    };

</script>

{#if articles.length > 0}

<div class="panel panel--light container container--wide">
    <div class="section__header">
        <h2>Latest Articles</h2>
        <Button title="View All Articles" link="/articles" />
    </div>
    <GlideSlider sliderOptions={sliderOptions} useBullets={true} useArrows={false}>
        {#each articles as article}
            <div>
                <ArticleCard
                    title={article.title}
                    image={strapiMedia(article.cover?.formats?.medium?.url || article.cover?.url)}
                    url={`/articles/${article.slug}`}
                    description={article.description} />
             </div>
        {/each}
    </GlideSlider>
</div>



{/if}