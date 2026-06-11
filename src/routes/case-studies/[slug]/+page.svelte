<script>
  export let data;
  import { page } from '$app/stores';
  import { strapiMedia } from '$lib/utils/media';
  import Masthead from '$lib/components/common/Masthead.svelte';
  import MetaHead  from '$lib/components/seo/MetaHead.svelte';
  import RichText from '$lib/components/page-builder/RichText.svelte';
  import CMSBlocks from '$lib/components/common/CMSBlocks.svelte';
  import Blockquote from '$lib/components/common/Blockquote.svelte';

  //console.log('Case study data:', data);

       
    const defaultPageSeo = {
        title: 'EcoEnergi | Case Studies | ' + data.caseStudy.title,
        description: data.caseStudy.intro || '',
        imageUrl: data.caseStudy.cover_image || null,
        imageAlt: data.caseStudy.title
    };
  
</script>

<MetaHead 
  pageSeo={data.caseStudy.seo}
  globalSeo={defaultPageSeo}
  url={$page.url.href}
/>

<Masthead 
    title={data.caseStudy.title} 
    backgroundImage={data.caseStudy.banner_image} 
    content={data.caseStudy.banner_content}
/>

<section class="case-study vr--space-y vr--space-m-bottomNone"  data-header-theme="dark">
    <article>
        <div class="case-study__lead">
            <div class="container">
          
                
                {#if data.caseStudy.cover_image}
                    <figure class="img-cover featured-image">
                        <img loading="lazy" width="{data.caseStudy.cover_image.width}" height="{data.caseStudy.cover_image.height}" src={strapiMedia(data.caseStudy.cover_image.formats?.large?.url || data.caseStudy.cover_image.url)} alt={data.caseStudy.title} />
                    </figure>
                {/if}

                {#if data.caseStudy.lead_in_content || data.caseStudy.services?.length}
                <div class="case-study___content">
                    <aside class="case-study__services">
                        {#if data.caseStudy.services?.length}
                            <h2>Services delivered</h2>
                            <ul>
                                {#each data.caseStudy.services as service}
                                    <li><a href="{service.url}">{service.title}</a></li>
                                {/each}
                            </ul>
                        {/if}
                    </aside>
                    <div class="case-study__description">
                        {#if data.caseStudy.lead_in_content}
                            <RichText content={data.caseStudy.lead_in_content} />
                        {/if}
                    </div>
                </div>
                {/if}
            </div>
        </div>

        <CMSBlocks data={data.caseStudy.content_blocks} />

        {#if data.caseStudy.testimonial }
        <section class="block">
            <div class="container">
                <Blockquote quote={data.caseStudy.testimonial} author={data.caseStudy.testimonial_author} />
            </div>
        </section>
        {/if}

        
        <!-- render blocks / components -->
    </article>
</section>


<style>
    
    .featured-image {
        aspect-ratio: 16 / 8;
        border-radius: var( --border-radius );
        overflow: hidden;
        margin-bottom: clamp( 2em, 1rem + 5vw, 6em );
    }

    header {
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
        margin-bottom: 2rem;
    }

    .case-study__description {
      grid-area: content;
    }

    .case-study___content {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr;
      grid-template-areas:
        "services"
        "content";
      align-items: start;
    }

    .case-study__services {
      border-radius: var( --border-radius );
      background-color: var( --color-primary-light );
      padding: clamp( 2rem, 1rem + 1vw, 3rem );
      grid-area: services;
    }

    .case-study__services h2 {
      font-size: var( --type-30 );
      margin-bottom: 1em
    }

    .case-study__services ul {
       display: grid;
       gap: 1rem;
    }

    .case-study__services ul li:not(:last-child) {
      border-bottom: 1px solid var( --color-primary-tint );
      padding-bottom: 0.5rem;
    }

    .case-study__services a {
      color: var( --color-primary );
      text-decoration: none;
    }

    .study__description {
        max-width: 1100px;
    }

    .case-study__services a:hover {
      text-decoration: underline;
    }

    @media screen and ( min-width: 768px ) {
      .case-study___content {
        grid-template-columns: 2fr 1fr;
        grid-template-areas: "content services";
      }

      
    }

    @media screen and ( min-width: 1200px ) {
         .case-study___content {
            gap: 4em;
         }
    }

    @media screen and ( max-width: 767px ) {

       :global(blockquote.blockquote) {
            border-radius: 0 !important;
            background-color: var( --color-primary );
            border-bottom: 1px solid var( --color-primary-tint );
        }

        .case-study .container {
            width: 100%;
            
        }

        .case-study {
            margin-top: 0;
        }

        .case-study header {
            padding: 0 5vw;
        }
        .case-study .featured-image {
            aspect-ratio: 4 / 3;
            border-radius: unset;
        }

        .case-study__lead .case-study___content {
            padding: 0 5vw;
        }
        
    }
</style>