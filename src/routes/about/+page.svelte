<script>
	import { resolve } from '$app/paths';

	import Masthead from '$lib/components/common/Masthead.svelte';
	import IconCard from '$lib/components/cards/IconCard.svelte';
	import GlobaclServicesCta from '$lib/components/common/GlobalServicesCta.svelte';
	import ContactCTA from '$lib/components/global/ContactCTA.svelte';
	import { page } from '$app/stores';
	import { strapiMedia } from '$lib/utils/media';
	// SEO
	import MetaHead  from '$lib/components/seo/MetaHead.svelte';
	export let data;

</script>

<MetaHead
  pageSeo={data.aboutPage?.seo}
  globalSeo={data.global.data.defaultSeo}
  pageTitle={data.aboutPage?.title || 'About us'}
/>


<Masthead
	preTitle="{data.aboutPage.title}"
	title="{data.aboutPage.banner_title}"
	description="{data.aboutPage.banner_description}"
	blockHeader={true}
/>

<div class="vr vr--space-y vr--space-m-bottomNone">
<section class="lead"  data-header-theme="dark">
	<div class="container content-grid grid-aic">
		<aside>
			{#if data.aboutPage.staff.length > 0}
				<ul class="staff-list">
					{#each data.aboutPage.staff as member}
						<li class="staff-member">
							{#if member.staff_image}
								<figure class="staff-photo img-cover">
									<img loading="lazy" width="{member.staff_image.width}" height="{member.staff_image.height}" src={strapiMedia(member.staff_image.formats?.thumbnail?.url || member.staff_image.url)} alt={member.name} />
								</figure>
							{/if}
							<div class="staff-info">
								<p class="staff-name">{member.name}</p>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</aside>
		<article class="brand-alt-header">
	
			{#if data.aboutPage.lead_content}
				{@html data.aboutPage.lead_content}
			{/if}
		</article>
	</div>
</section>

<section class="panel panel--dark container container--wide grid--3 about-cards" data-header-theme="light">
	<div>
		{#if data.aboutPage.why_choose_us_title}
			<h2>{data.aboutPage.why_choose_us_title}</h2>
		{/if}
		{#if data.aboutPage.why_choose_us_intro}
			<p>{data.aboutPage.why_choose_us_intro}</p>
		{/if}
	</div>
	{#if data.aboutPage.why_choose_us_cards.length > 0}
		{#each data.aboutPage.why_choose_us_cards as card}
			<IconCard
				label={card.Title}
				description={card.Description}
				iconSrc={strapiMedia(card.Icon?.url)}
				layout={'alt'}
			/>
		{/each}
	{/if}
</section>

<section class="container content-grid--3 grid-aic supporting-you" data-header-theme="dark">
		<div>
		{#if data.aboutPage.supporting_you_content}
			{@html data.aboutPage.supporting_you_content }
		{/if}
		</div>
	
		<GlobaclServicesCta
			cta_title_1="{data.global.data.residential_cta_title}"
			cta_link_1="{data.global.data.residential_cta_link}"
			cta_img_1="{strapiMedia(data.global.data.residential_cta_image?.url)}"
			cta_title_2="{data.global.data.commercial_cta_title}"
			cta_link_2="{data.global.data.commercial_cta_link}"
			cta_img_2="{strapiMedia(data.global.data.commercial_cta_image?.url)}"
			style="narrow"
		/>
	
</section>

<ContactCTA />
</div>


<style>
	.staff-list {
		display: grid;
		grid-template-columns: 1fr 1fr;  
		gap: clamp(1rem, 2vw, 2rem);
	}

	.staff-member {
		text-align: center
	}

	.staff-photo {
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		overflow: hidden;
		max-width: 300px;
		margin:0 auto  1em auto;
		background-color: var( --color-brand-light );
	}

	.panel--dark {
		align-content: center
	}

	.panel--dark h2 {
		font-size: var( --type-40 );
	}

	:global(.about-cards .card) {
		color: var( --color-primary );
	}


	:global(.about-cards .card:nth-of-type(3)) {
		background-color: var( --color-secondary );
	}

	

	:global(.about-cards .card:nth-of-type(5)) {
		background-color: var( --color-secondary-tint );
	}

	:global(.about-cards .card:nth-of-type(6)) {
		background-color: var( --color-primary-tint );
	}

	:global(.about-cards .card:nth-of-type(3) h3:after),
	:global(.about-cards .card:nth-of-type(5) h3:after),
	:global(.about-cards .card:nth-of-type(6) h3:after) {
		background: var( --color-light );
	}

	:global(.supporting-you h2) {
		font-size: var( --type-30 );
		color: var( --color-secondary );
	}

</style>