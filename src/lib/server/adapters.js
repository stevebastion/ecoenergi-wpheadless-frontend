/**
 * Content-type adapters.
 *
 * Each function turns a WPGraphQL response into an object that uses the SAME
 * field names the original Strapi-fed Svelte components expect (snake_case
 * attributes, `__component` blocks, `metaTitle` SEO, etc.). This is what lets
 * the .svelte files stay essentially unchanged.
 *
 * SEO comes from Yoast (`post.seo`, type PostTypeSEO). Home / About / Contact
 * and the Service Landing pages are now real WordPress Pages, so they are
 * Yoast-managed like everything else.
 */

import { adaptMedia, adaptGallery, adaptBlocks, adaptButton, adaptIconCard, adaptYoastSeo } from './wp.js';

/**
 * Normalise an ACF select field. WPGraphQL-for-ACF v2 always types `select`
 * fields as `[String]`, so even a single-value select (`multiple: 0`) returns
 * an array like `['residential']`. This helper unwraps to the first value.
 */
function acfSelectValue(field) {
	if (Array.isArray(field)) return field[0] || '';
	return field || '';
}

/* ---- Templated pages (Home / About / Contact) -------------------------- */

/** WP Page on the Home template -> Strapi `home` entity shape. */
export function adaptHome(page) {
	if (!page) return null;
	const f = page.homeFields || {};
	return {
		banner_title: f.bannerTitle || '',
		banner_content: f.bannerContent || '',
		banner_video: adaptMedia(f.bannerVideo),
		banner_video_poster: adaptMedia(f.bannerVideoPoster),
		banner_buttons: (f.bannerButtons || []).map(adaptButton),
		usps_title: f.uspsTitle || '',
		lead_content: f.leadContent || '',
		usp_items: (f.uspItems || []).map(adaptIconCard),
		trusted_content: f.trustedContent || '',
		trusted_images: adaptGallery(f.trustedImages),
		trusted_button: adaptButton(f.trustedButton),
		seo: adaptYoastSeo(page.seo)
	};
}

/** WP Page on the About template -> Strapi `about` entity shape. */
export function adaptAbout(page) {
	if (!page) return null;
	const f = page.aboutFields || {};
	return {
		title: f.title || '',
		banner_title: f.bannerTitle || '',
		banner_description: f.bannerDescription || '',
		staff: (f.staff || []).map((s) => ({
			name: s.name || '',
			staff_image: adaptMedia(s.staffImage)
		})),
		lead_content: f.leadContent || '',
		lead_button: adaptButton(f.leadButton),
		why_choose_us_intro: f.whyChooseUsIntro || '',
		why_choose_us_title: f.whyChooseUsTitle || '',
		why_choose_us_cards: (f.whyChooseUsCards || []).map(adaptIconCard),
		supporting_you_content: f.supportingYouContent || '',
		seo: adaptYoastSeo(page.seo)
	};
}

/** WP Page on the Contact template -> Strapi `contact` entity shape. */
export function adaptContact(page) {
	if (!page) return null;
	const f = page.contactFields || {};
	return {
		title: f.title || '',
		lead_in_text: f.leadInText || '',
		location: f.location
			? {
					address: f.location.streetAddress || '',
					lat: f.location.latitude ?? null,
					lng: f.location.longitude ?? null
				}
			: null,
		seo: adaptYoastSeo(page.seo)
	};
}

/** ACF Site Settings options page -> Strapi `global` entity shape. */
export function adaptGlobal(f) {
	if (!f) return null;
	return {
		siteName: f.siteName || '',
		siteDescription: f.siteDescription || '',
		favicon: adaptMedia(f.favicon),
		footer_nav_1_title: f.footerNav1Title || '',
		footer_nav_2_title: f.footerNav2Title || '',
		footer_nav_3_title: f.footerNav3Title || '',
		footer_logos: adaptGallery(f.footerLogos),
		phone_number: f.phoneNumber || '',
		email_address: f.emailAddress || '',
		residential_cta_title: f.residentialCtaTitle || '',
		residential_cta_image: adaptMedia(f.residentialCtaImage),
		residential_cta_link: f.residentialCtaLink || '',
		commercial_cta_title: f.commercialCtaTitle || '',
		commercial_cta_image: adaptMedia(f.commercialCtaImage),
		commercial_cta_link: f.commercialCtaLink || ''
	};
}

/* ---- Collection types -------------------------------------------------- */

/** Native WP Page (Default template) -> Strapi `page` entity shape. */
export function adaptPage(page) {
	if (!page) return null;
	const f = page.pageBuilder || {};
	return {
		id: page.databaseId,
		title: page.title || '',
		slug: page.slug || '',
		// `use_page_builder` toggle: true -> render `blocks`, false -> render `content`.
		use_page_builder: !!f.usePageBuilder,
		content: page.content || '',
		blocks: adaptBlocks(f.blocks),
		seo: adaptYoastSeo(page.seo)
	};
}

/** Native WP Post (full) -> Strapi `article` entity shape. */
export function adaptArticle(post) {
	if (!post) return null;
	const f = post.articleFields || {};
	return {
		id: post.databaseId,
		title: post.title || '',
		slug: post.slug || '',
		publishedAt: post.date || null,
		description: f.description || '',
		cover: adaptMedia(f.cover),
		blocks: adaptBlocks(f.blocks),
		seo: adaptYoastSeo(post.seo)
	};
}

/** Native WP Post (listing card) -> Strapi `article` card shape. */
export function adaptArticleCard(post) {
	if (!post) return null;
	const f = post.articleFields || {};
	return {
		id: post.databaseId,
		title: post.title || '',
		slug: post.slug || '',
		publishedAt: post.date || null,
		description: f.description || '',
		cover: adaptMedia(f.cover)
	};
}

/** Case Study CPT (full) -> Strapi `case-study` entity shape. */
export function adaptCaseStudy(cs) {
	if (!cs) return null;
	const f = cs.caseStudyFields || {};
	return {
		id: cs.databaseId,
		title: cs.title || '',
		slug: cs.slug || '',
		description: f.description || '',
		testimonial: f.testimonial || '',
		testimonial_author: f.testimonialAuthor || '',
		lead_in_content: f.leadInContent || '',
		cover_image: adaptMedia(f.coverImage),
		content_blocks: adaptBlocks(f.contentBlocks),
		services: (f.services?.nodes || []).map((s) => ({
			title: s.title || '',
			slug: s.slug || '',
			category: s.serviceFields?.category || '',
			url: `/our-services/${s.serviceFields?.category || ''}/${s.slug || ''}`
		})),
		seo: adaptYoastSeo(cs.seo)
	};
}

/** Case Study CPT (listing card) -> Strapi `case-study` card shape. */
export function adaptCaseStudyCard(cs) {
	if (!cs) return null;
	const f = cs.caseStudyFields || {};
	return {
		id: cs.databaseId,
		title: cs.title || '',
		slug: cs.slug || '',
		description: f.description || '',
		cover_image: adaptMedia(f.coverImage)
	};
}

/** Service CPT (full) -> Strapi `company-service` entity shape. */
export function adaptService(svc) {
	if (!svc) return null;
	const f = svc.serviceFields || {};
	return {
		id: svc.databaseId,
		title: svc.title || '',
		slug: svc.slug || '',
		category: acfSelectValue(f.category),
		banner_title: f.bannerTitle || '',
		banner_text: f.bannerText || '',
		intro: f.intro || '',
		cover_image: adaptMedia(f.coverImage),
		content_blocks: adaptBlocks(f.contentBlocks),
		seo: adaptYoastSeo(svc.seo)
	};
}

/** Service CPT (listing card) -> Strapi `company-service` card shape. */
export function adaptServiceCard(svc) {
	if (!svc) return null;
	const f = svc.serviceFields || {};
	return {
		id: svc.databaseId,
		title: svc.title || '',
		slug: svc.slug || '',
		category: acfSelectValue(f.category),
		banner_text: f.bannerText || '',
		svg_icon: adaptMedia(f.svgIcon),
		cover_image: adaptMedia(f.coverImage)
	};
}

/** WP Page on the Service Landing template -> Strapi `service-landing` shape. */
export function adaptServiceLanding(sl) {
	if (!sl) return null;
	const f = sl.serviceLandingFields || {};
	return {
		id: sl.databaseId,
		title: sl.title || '',
		slug: sl.slug || '',
		banner_title: f.bannerTitle || '',
		banner_description: f.bannerDescription || '',
		services_to_show: acfSelectValue(f.servicesToShow),
		seo: adaptYoastSeo(sl.seo)
	};
}
