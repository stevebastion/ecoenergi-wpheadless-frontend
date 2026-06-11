<script>
	import { page } from '$app/stores';
	import { strapiMedia } from '$lib/utils/media';
	import CaseStudyCard from '$lib/components/cards/CaseStudyCard.svelte';
	import ArticleCard from '$lib/components/cards/ArticleCard.svelte';
	import ServiceCard from '$lib/components/cards/ServiceCard.svelte';
	import ContactCTA from '$lib/components/global/ContactCTA.svelte';
	import LatestCaseStudies from '$lib/components/global/LatestCaseStudies.svelte';

	
	import IconCard from '$lib/components/cards/IconCard.svelte';
	import CountCard from '$lib/components/cards/CountCard.svelte';


	import Button from '$lib/components/common/Button.svelte';
	import GlobaclServicesCta from '$lib/components/common/GlobalServicesCta.svelte';


	// SEO
	import MetaHead  from '$lib/components/seo/MetaHead.svelte';

	export let data;

</script>

<MetaHead 
  pageSeo={data.pageData?.seo}
  globalSeo={data.global.data.defaultSeo}
  url={$page.url.href}
/>

<section class="hero" data-header-theme="light">
	<div class="container ">
		<div class="masthead__content">
			<header>
				<h1>{data.pageData.banner_title}</h1>
				{#if data.pageData.banner_content}
					<p>{data.pageData.banner_content}</p>
				{/if}
				{#if data.pageData.banner_buttons.length > 0}
					<div class="masthead__buttons button-group">
						{#each data.pageData.banner_buttons as button}
							<Button 
								title="{button.label}" 
								link="{button.url}" 
								variant="wide light" 
							/>
						{/each}
					</div>
				{/if}
			</header>
		</div>
	</div>
	{#if data.pageData.banner_video}
		<video
			class="masthead__video"
			autoplay
			muted
			loop
			playsinline
			poster={strapiMedia(data.pageData.banner_video_poster?.url)}
		>
			<source src={strapiMedia(data.pageData.banner_video.url)} type="video/mp4" />
			Your browser does not support the video tag.
		</video>

	{:else if data.pageData.banner_video_poster}
		<img
			class="masthead__image img-cover"
			src={data.pageData.banner_video_poster.url}
			alt="{data.pageData.title} banner image"
		/>
	{/if}
</section>

<section data-header-theme="dark">
	<div class="container lead_content">
		 <article>
			{#if data.pageData.lead_content}
				<div class="rich-text rich-text--content">
	 				 {@html data.pageData.lead_content}
 				</div>
			{/if}
		 </article>
		 <aside>
		 		<GlobaclServicesCta
					cta_title_1="{data.global.data.residential_cta_title}"
					cta_link_1="{data.global.data.residential_cta_link}"
					cta_img_1="{strapiMedia(data.global.data.residential_cta_image?.url)}"
					cta_title_2="{data.global.data.commercial_cta_title}"
					cta_link_2="{data.global.data.commercial_cta_link}"
					cta_img_2="{strapiMedia(data.global.data.commercial_cta_image?.url)}"
					style="narrow"
				/>
		 </aside>
	</div>
</section>


<div class="vr vr--space-y vr--space-m-bottomNone">
{#if data.pageData.usp_items.length > 0}
<section class="icon-cards" data-header-theme="dark"> 
	<div class="panel container container--wide">
		<header class="section__header">
			<h2>{@html data.pageData.usps_title}</h2>
			<Button title="Learn More" link="/about" />
		</header>
		<div class="icon-cards__grid grid grid--3">
			{#each data.pageData.usp_items as item, i}
				<IconCard
					label={item.Title}
					iconSrc={strapiMedia(item.Icon?.url)}
					description={item.Description}
				/>
			{/each}
		</div>
	</div>
</section>
{/if}


<section class="trusted">
	<div class="container trusted__content content-grid grid-aic">
		<aside>
			{#if data.pageData.trusted_images?.length > 0}
				{#each data.pageData.trusted_images as image}
					<figure class="trusted__figure img-cover">
						<img src="{strapiMedia(image?.url)}" alt="{image.alt || 'Trusted company logo'}" />
					</figure>
				{/each}
			{/if}

			<svg class="trusted__svg" width="485" height="544" viewBox="0 0 485 544" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_52_85)">
					<path d="M271.481 0.302734C350.147 0.302734 411.822 31.0473 446.933 62.2451L448.584 63.7314C460.728 74.9106 468.925 90.1799 468.925 106.392C468.925 120.672 464.834 132.798 452.68 147.125L452.678 147.127L294.76 335.037C283.42 348.348 271.335 353.416 256.104 353.416C225.605 353.416 203.372 332.106 203.372 302.595C203.372 290.233 206.311 278.147 215.449 268.998L215.477 268.969L339.486 123.297L339.839 122.883L339.396 122.566C321.932 110.049 294.017 103.918 271.481 103.918C183.048 103.918 113.061 179.179 113.061 271.803C113.061 364.424 182.061 439.687 271.481 439.688C319.73 439.688 355.731 419.099 380.453 393.366C397.067 379.898 408.144 367.838 429.402 367.838C460.879 367.838 484.303 390.325 484.303 421.817C484.303 432.915 478.259 447.208 468.069 458.392L468.061 458.401L468.053 458.412C429.313 505.663 358.679 543.5 271.679 543.5C117.193 543.5 0.5 423.716 0.5 272C0.500062 120.283 116.208 0.500232 271.481 0.302734Z" stroke="#D4EB3C"/>
				</g>
				<defs>
				<clipPath id="clip0_52_85">
					<rect width="485" height="544" fill="white"/>
				</clipPath>
				</defs>
			</svg>

		</aside>
		<article>
			{#if data.pageData.trusted_content}
				<div class="rich-text rich-text--content">
	 				 {@html data.pageData.trusted_content}
 				</div>
				{#if data.pageData.trusted_button}
					<Button 
						title="{data.pageData.trusted_button.label}" 
						link="{data.pageData.trusted_button.url}" 
					/>
				{/if}
			{/if}
		</article>
	</div>
</section>



<section> 
	<LatestCaseStudies caseStudies={data.latestCaseStudies.data} />
</section>


<ContactCTA />
</div>

<style>
	/* Hero Section ---- */
	.hero {
		height: 100vh;
		position: relative;
		overflow: hidden;
		max-height: 1080px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: var( --color-light );
	}

	.hero:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: .83;
		background: var( --overlay-gradient );
		pointer-events: none;
		z-index: 2
	}

	.hero video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.hero h1 {
		color: var( --color-light );
		margin-bottom: .5em;
	}

	.hero p {
		font-size: var( --type-20 );
		margin-top: 1rem;
		margin-bottom: 3em;
	}

	.masthead__content {
		position: relative;
		z-index: 3;
		color: var( --color-light );
		max-width: 900px;
	}

	:global(main:has(.hero)) {
		padding-top: 0 !important;
	}

	/* Layout Specifics ---- */
	.lead_content {
		display: grid;
		gap: 2rem;
		padding-top: 4em;
	}

	.lead_content aside {
		display: grid;
		gap: 2rem;
	}

	@media screen and ( min-width: 550px ) and ( max-width: 1199px ) {
		.lead_content aside {
			
			grid-template-columns: 1fr 1fr;
			
		}
	}

	

	@media screen and ( min-width: 1200px ) {
		.lead_content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 4em;
			padding-top: 0;
		}
		.lead_content aside {
			flex: 1;
			max-width: 547px;
		}
		.lead_content article {
			max-width: 830px;
		}
	
		.lead_content aside {
			display: grid;
			grid-template-columns: 1fr;
			min-width: 420px;
			flex-shrink: 0;
			max-width: 546px;
			gap: 3rem;
		}

		.lead_content {
			margin-top: -100px;
			position: relative;
			z-index: 3;
		}
	}

	/* Trusted Section ---- */
	.trusted aside {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		grid-template-areas:
		"left top-right"
		"left bottom-right";
		align-items: stretch;
		position: relative;
		gap: 2em;
		max-width: 830px;
		align-items: center
	}

	.trusted aside figure {
		background: #eee;
		aspect-ratio: 40 / 45;
		max-height: 450px;
	}

	.trusted aside figure:nth-of-type(1) {
		grid-area: left;
	}

	.trusted aside figure:nth-of-type(2) {
		grid-area: top-right;
	}

	.trusted aside figure:nth-of-type(3) {
		grid-area: bottom-right;
	}

	.trusted__svg {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		width: 90%;
		height: auto;
		max-width: 485px;
	}
	
	

	@media screen and ( min-width: 900px ) {
		.trusted__content {
		   gap: clamp( 2em, 5vw + 1em, 20em );
		}
	}

	@media screen and ( min-width: 1400px ) {
		.trusted__content {
			gap: 8em;
		}

		.trusted__content aside {
			max-width: 830px;
			
		}
	}


</style>
