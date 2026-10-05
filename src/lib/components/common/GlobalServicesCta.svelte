<script>
    import CaseStudyCard from '$lib/components/cards/CaseStudyCard.svelte';

    export let cta_title_1 = "";
    export let cta_link_1 = "";
    export let cta_img_1 = "";
    export let cta_title_2 = "";
    export let cta_link_2 = "";
    export let cta_img_2 = "";
    export let style = "";
</script>


<CaseStudyCard 
    title="{cta_title_1}" 
    url="{cta_link_1}" 
    imageSrc="{cta_img_1}" 
    layout="fixed" 
    splitTitle={true}
    className="cta-card cta-card--1 {style}"
/>

<CaseStudyCard 
    title="{cta_title_2}" 
    url="{cta_link_2}" 
    imageSrc="{cta_img_2}" 
    layout="fixed" 
    splitTitle={true}
    className="cta-card cta-card--2 {style}"
/>