<script>
  import { page } from '$app/stores';
 
  import LatestNews from '$lib/components/global/LatestNews.svelte';
  import CMSBlocks from '$lib/components/common/CMSBlocks.svelte';
  import ContactCTA from '$lib/components/global/ContactCTA.svelte';

   // SEO
   import MetaHead  from '$lib/components/seo/MetaHead.svelte';


    export let data;


</script>

<MetaHead 
  pageSeo={data.pageData.seo}
  globalSeo={data.global.data.defaultSeo}
  url={$page.url.href}
/>

<section class="article" data-header-theme="dark">
    <article>
        <div class="article__lead">
            <div class="container">
                <header>
                    <h1>{data.pageData.title}</h1>
                    
                </header>
                
                
            </div>
        </div>
        <div class="vr vr--space-bottom vr--space-m-bottomNone" >
        {#if data.pageData.use_page_builder}
          <CMSBlocks data={data.pageData.blocks} />
        {:else}
          <div class="container">
            {@html data.pageData.content}
          </div>
        {/if}


        <ContactCTA />
        </div>
        
        <!-- render blocks / components -->
    </article>
</section>


