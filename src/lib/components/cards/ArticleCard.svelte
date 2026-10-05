<script>
    import { optimised, srcset } from '$lib/utils/img';
    export let title;
    export let description;
    export let image;
    export let url;
    export let date = '2024-01-15';
</script>
<a href={url} class="card card--common card--article">
    <figure class="img-cover">
        <img loading="lazy" decoding="async" src={optimised(image, 1024)} srcset={srcset(image)} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" alt="" />
    </figure>
    <div>
        <time datetime={date}>{new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        <header>
            <h3>
                {title}
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.54348 1H20.5C21.6046 1 22.5 1.89543 22.5 3V15.9565M17.2029 6.2971L1 22.5" stroke="#D4EB3C" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </h3>
        </header>

    </div>
</a>

<style>
    a {
        display: block;
    }
    figure {
        border-radius: calc( var( --border-radius ) /2 );
        overflow: hidden;
    }
    .card {
        background-color: var( --color-primary-light );
    }
    .card:hover {
        background-color: var( --color-primary );
    }
    time {
        color: var( --color-primary-tint );
    }
</style>