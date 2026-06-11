<script>
    export let title;
    export let iconURL;
    export let description;
    export let url;
    export let imageSrc;
    export let imageAlt = "";
    export let imageWidth;
    export let imageHeight;
</script>

<a href="{url}" class="card card--common card--service">
    <figure class="img-cover">
        <span class="figure__icon">
            <img loading="lazy" src="{iconURL}" alt="{title} Icon" />   
        </span>
        <img loading="lazy" src="{imageSrc}" alt="{imageAlt}" width="{imageWidth}" height="{imageHeight}" />
    </figure>
    <div>
        <header>
            <h3>
                {title}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    .card__description {
       opacity: 0;
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