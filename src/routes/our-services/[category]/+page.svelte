<script>
    import { page } from '$app/stores';
    import { strapiMedia } from '$lib/utils/media';
    import Masthead from '$lib/components/common/Masthead.svelte';
    import ServiceCard from '$lib/components/cards/ServiceCard.svelte';
    import ContactCTA from '$lib/components/global/ContactCTA.svelte';
    import LatestCaseStudies from '$lib/components/global/LatestCaseStudies.svelte';
    export let data;

    // -- SEO 
    import MetaHead  from '$lib/components/seo/MetaHead.svelte';

    //console.log( 'Our Services Category Page Data:' );
    //console.log( data );


</script>

<MetaHead
  pageSeo={data.landingPage?.seo}
  pageTitle={data.landingPage.banner_title || data.landingPage.title}
  pageDescription={data.landingPage.banner_description}
/>

<Masthead 
    preTitle="{data.landingPage.title}"
    title="{data.landingPage.banner_title}"
    description="{data.landingPage.banner_description}"
    blockHeader={false}
/>
<div class="vr vr--space-y">
<section class="panel container container--wide grid--3 gap-2" data-header-theme="dark">
    {#if data.services.length > 0}
        {#each data.services as service}
            <ServiceCard 
                title="{service.title}" 
                url="/our-services/{data.currentCategory}/{service.slug}" 
                imageSrc="{strapiMedia(service.cover_image?.url)}"
                imageAlt="{service.cover_image?.alternativeText || service.title}"
                imageWidth="{service.cover_image?.width}"
                imageHeight="{service.cover_image?.height}"
                description="{service.banner_text}"
                iconURL="{service.svg_icon ? strapiMedia(service.svg_icon.url) : ''}"
            />
        {/each}
    {:else}
        <p>No services found in this category.</p>
    {/if}
</section>

<LatestCaseStudies caseStudies="{data.latestCaseStudies.data}" />

<ContactCTA />
</div>