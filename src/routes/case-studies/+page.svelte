<script>
  import { page } from '$app/stores';
  import { strapiMedia } from '$lib/utils/media';
  export let data;
  import Pagination from '$lib/components/common/Pagination.svelte';
  import CaseStudyCard from '$lib/components/cards/CaseStudyCard.svelte';
  import Masthead from '$lib/components/common/Masthead.svelte';
  import ContactCTA from '$lib/components/global/ContactCTA.svelte';

  // SEO
  import MetaHead  from '$lib/components/seo/MetaHead.svelte';

   const pageSEO = {
    title: 'Case Studies - EcoEnergi',
    description: 'Explore our portfolio of successful projects showcasing our expertise in energy solutions, sustainability, and innovation at Eco Energi.'
  }

  //console.log('Case Studies data:', data);
</script>

<MetaHead 
  pageSeo={pageSEO}
  globalSeo={data.global.data.defaultSeo}
  url={data.currentUrl}
/>

<Masthead
  preTitle="Case Studies"
  title="Real Projects. Real Results. Real Savings."
  blockHeader={false}
/>

<div class="vr vr--space-y vr--space-m-bottomNone">
<section class="panel container container--wide" data-header-theme="dark">
    <div class="grid grid--3 grid-longFirst grid--cases">
    {#each data.items as item}
        <CaseStudyCard
        title={item.title}
        imageSrc={strapiMedia(item.cover_image?.url)}
        url={`/case-studies/${item.slug}`}
        description={item.description}
        />
    {/each}
    </div>
</section>

{#if data.pagination.pageCount > 1}
 <Pagination
  pagination={data.pagination}
  base="/our-work"
/>
{/if}

<ContactCTA />
</div>

<style> 
  

    @media screen and ( min-width: 800px ) {
       :global(.grid--cases .card--case-study:nth-of-type(1)) {
          max-height: 507px;
          aspect-ratio: 16/5;
       } 
    }

    @media screen and ( min-width: 1200px ) {

    }

</style>