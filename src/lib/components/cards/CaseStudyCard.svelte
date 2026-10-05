<script>
    export let title = "Case Study Title";
    export let imageSrc = "https://images.pexels.com/photos/35687782/pexels-photo-35687782.jpeg";
    export let url = "#";
    export let description = "";
    export let layout = "std";
    export let className = "";
    /** One word per line (CTA tiles). "&" stays with the word before it. */
    export let splitTitle = false;

    $: displayTitle = splitTitle ? (title || '').replace(/ & /g, '\u00a0& ') : title;
</script>

<a href="{url}" class="card card--case-study {layout} img-cover {className}">
    <div>
        <header>
            <h3>
                <span class="card__title" class:card__title--split={splitTitle}>{displayTitle}</span>
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
    <img loading="lazy" src="{imageSrc}" alt="" />
</a>


<style>
    a {
        background-color: #ccc;
        position: relative;
        aspect-ratio: 54 / 50;
        display: flex;
        padding: clamp( 1.5rem, 1rem + 1vw, 2rem );
        flex-direction: column;
        justify-content: flex-end;
        text-decoration: none;
        border-radius: var( --border-radius );
        overflow: hidden;
    }

    a.narrow {
        aspect-ratio: 54 / 36;
    }

    a > div {
        position: relative;
        z-index: 2;
        
    }

    a:has(.card__description) > div {
        transform: translateY(35%);
        transition: transform 0.3s ease;
    }

    svg {
         flex: none;
         transition: transform 0.3s ease;
    }

    a:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg,rgba(18, 48, 83, 0.07) 0%, rgba(18, 48, 83, 0.85) 100%);
       
        opacity: 1;
        transition: all 0.3s ease;
        pointer-events: none
    }

    h3 {
        color: var( --color-light );
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        font-size: var( --type-30 );
        font-weight: var( --weight-semi-bold );
        margin: 0;
        white-space: break-spaces;
    }

    /* min-content = width of the longest word, so every space breaks the line. */
    .card__title--split {
        width: min-content;
    }

    .card__description {
        opacity: 0;
        transition: opacity 0.3s ease;  
    }
     
    .card__description p {
        color: var( --color-light );
        font-size: var( --type-20 );
        margin: 0;
         white-space: break-spaces;
    }

    a:hover svg {
        transform: rotate(45deg);
       
    }

    a:hover:after {
       
         background: linear-gradient(180deg,rgba(2, 93, 62, 0) 0%, rgba(2, 93, 62, 0.85) 54%);
         opacity: .6;
    }

    a:hover .card__description {
        opacity: 1;
       
    }

    a:hover > div {
        transform: translateY(0);
       
    }

    :global(a.fixed > div) {
        transform: translateY(0)
    }

   

</style>