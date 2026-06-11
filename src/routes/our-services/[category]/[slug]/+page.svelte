<script>
    import { page } from '$app/stores';
    import { strapiMedia } from '$lib/utils/media';
    import RichText from '$lib/components/page-builder/RichText.svelte';
    import Masthead from '$lib/components/common/Masthead.svelte';
    import IconCard from '$lib/components/cards/IconCard.svelte';
    import CountCard from '$lib/components/cards/CountCard.svelte';
    import ContactCTA from '$lib/components/global/ContactCTA.svelte';
    import Button from '$lib/components/common/Button.svelte';

    // SEO
    import MetaHead  from '$lib/components/seo/MetaHead.svelte';

    export let data;

    
    const defaultPageSeo = {
        title: 'EcoEnergi | Our Services | ' + data.service.title,
        description: data.service.intro || '',
        imageUrl: data.service.cover_image || null,
        imageAlt: data.service.title
    };



</script>

<MetaHead 
  pageSeo={data.service.seo}
  globalSeo={defaultPageSeo}
  url={$page.url.href}
/>

<Masthead 
    title="{data.service.banner_title}"
    description="{data.service.banner_text}"
    blockHeader={true}
    className="masthead--service"
/>
<section class="container intro-section" data-header-theme="dark">
    <article>
        {#if data.service.intro}
            <RichText content={data.service.intro} />
        {/if}
    </article>
    <figure class="img-cover">
        {#if data.service.cover_image}
            <img 
                loading="lazy" 
                width="{data.service.cover_image.width}" 
                height="{data.service.cover_image.height}" 
                src="{strapiMedia(data.service.cover_image.url)}" 
                alt="{data.service.cover_image.alternativeText || data.service.title}" 
            />
        {/if}
    </figure>
</section>
{#if data.service.content_blocks}
    <div class="vr vr--space-y vr--space-m-bottomNone">
    {#each data.service.content_blocks as block}
        {#if block.__component === 'shared.icon-cards-panel'}
            <section class="panel container container--wide" data-header-theme="dark">
            
                <header class="section__header">
                    <h2>{@html block.Title}</h2>
                    <Button title="Learn More" link="/about" />
                    {#if block.panel_content}
                        <p>{block.panel_content}</p>
                    {/if}
                </header>

             
                
                {#if block.Cards}
                    <div class="grid--3">
                        {#each block.Cards as card}
                            <IconCard 
                                title="{card.Title}" 
                                iconSrc="{strapiMedia(card.Icon?.url)}" 
                                iconAlt="{card.Icon?.alternativeText || card.Title}" 
                                iconWidth="{card.Icon?.width}"
                                iconHeight="{card.Icon?.height}"
                                description="{card.Description}"
                            />
                        {/each}
                    </div>
                {/if}
                {#if block.count_cards}
                    <div class="grid--4">
                        {#each block.count_cards as card, i}
                            <CountCard 
                                title="{card.title}" 
                                count="{i + 1}" 
                                description="{card.content}"
                            />
                        {/each}
                    </div>
                {/if}
            </section>
        {/if}   
    {/each}
    <ContactCTA />
    </div>
{/if}

<style> 
    .intro-section {

    }

    .intro-section figure { 
        background: #eee;
        border-radius: var( --border-radius );
        overflow: hidden;
        aspect-ratio: 4 / 3;
      
    }
    
    .intro-section article {
        padding-top: clamp( 3em, 2vw, 6em );
    }

    @media screen and ( min-width: 768px ) {
        .intro-section {
            display: grid;
            grid-template-columns: 4fr 2fr;
            gap: clamp( 1em, 4vw, 5em );
        }

    }

    @media screen and ( min-width: 1024px ) {
        

        .intro-section figure {
             margin-top: -50%;
             aspect-ratio: 55 / 67;
             max-height: auto;
        }

        
      
    }

    .vr .panel:first-child {
        background: transparent
    }
</style>