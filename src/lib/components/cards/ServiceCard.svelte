<script>
    import { optimised, srcset } from '$lib/utils/img';
    export let title;
    export let iconURL = '';
    export let description;
    export let url;
    export let imageSrc;
    export let imageAlt = "";
    export let imageWidth;
    export let imageHeight;

    // Keep '&' with the word before it so "Maintenance & Servicing" breaks as
    // "Maintenance &" / "Servicing" rather than three lines.
    $: displayTitle = (title || '').replace(/ & /g, '\u00a0& ');
</script>

<a href="{url}" class="card card--common card--service">
    <figure class="img-cover">
        {#if iconURL}
            <span class="figure__icon">
                <img loading="lazy" src="{iconURL}" alt="" />
            </span>
        {/if}
        <img loading="lazy" decoding="async" src={optimised(imageSrc, 1024)} srcset={srcset(imageSrc, imageWidth)} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" alt="{imageAlt}" width="{imageWidth}" height="{imageHeight}" />
    </figure>
    <div>
        <header>
            <h3>
                <span class="card__title">{displayTitle}</span>
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.54348 1H20.5C21.6046 1 22.5 1.89543 22.5 3V15.9565M17.2029 6.2971L1 22.5" stroke="#D4EB3C" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </h3>
        </header>
        {#if description}
            <div class="card__description">
                <p>{description}</p>
            </div>
        {/if}
    </div>
</a>

<style>
     .card {
        background-color: var( --color-light );
       
     }

     .card:hover {
        background-color: var( --color-primary );
     }

    /* Round the image itself (not the figure) so the icon badge can overhang the
       card edge without being clipped. */
    figure {
        border-radius: calc( var( --border-radius ) / 2 );
    }

    figure > img {
        border-radius: inherit;
    }

    /* Icon badge: bottom-left of the image, flush with the card edge. Its
       background matches the card so it reads as a cut-out, and flips on hover. */
    .figure__icon {
        position: absolute;
        z-index: 2;
        left: calc( clamp( 2rem, 1rem + 1vw, 3rem ) * -1 );
        bottom: 2.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6.4rem;
        height: 6.4rem;
        border-radius: 50%;
        background-color: var( --color-light );
        transition: background-color 0.3s ease;
    }

    .figure__icon img {
        position: static;
        width: 2.8rem;
        height: 2.8rem;
        object-fit: contain;
    }

    .card:hover .figure__icon {
        background-color: var( --color-primary );
    }

    .card__description {
       opacity: 0;
    }

    /* Arrow sits bottom-right, level with the last line of the title. */
    .card h3 {
        align-items: flex-end;
        justify-content: space-between;
    }

    svg {
        flex: none;
    }

    /* min-content = width of the longest word, so every space becomes a line break. */
    .card__title {
        width: min-content;
    }

    .card__description p:last-child {
        margin-bottom: 0;
    }

    a > div {
        transform: translateY(50%);
         transition: transform 0.3s ease;
    }

    a:hover .card__description {
        opacity: 1;
        color: var( --color-light );
    }

    a:hover > div {
        transform: translateY(0);
       
    }

</style>