<script>
    import { strapiMedia } from '$lib/utils/media';
    import GlideSlider from '$lib/components/common/GlideSlider.svelte';
    import CaseStudyCard from '$lib/components/cards/CaseStudyCard.svelte';
    import Button from '$lib/components/common/Button.svelte';
    export let caseStudies = [];

    console.log('Latest Case Studies:', caseStudies);

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

{#if caseStudies.length > 0}

<div class="panel panel--dark container container--wide"  data-header-theme="light">
    <div class="section__header">
        <h2>Latest Case Studies</h2>
        <Button title="View All Case Studies" link="/case-studies" variant="light" />
    </div>
    <GlideSlider sliderOptions={sliderOptions} useBullets={true} useArrows={true}>
        {#each caseStudies as caseStudy}
            <div>
                <CaseStudyCard
                    title={caseStudy.title}
                    imageSrc={strapiMedia(caseStudy.cover_image?.url)}
                    url={`/case-studies/${caseStudy.slug}`}
                    description={caseStudy.description} />
             </div>
        {/each}
    </GlideSlider>
</div>



{/if}