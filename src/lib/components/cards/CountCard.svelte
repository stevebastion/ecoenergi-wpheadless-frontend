<script>
    export let count = 1;
    export let label = "Label";
    export let description = "";
</script>
<div class="card card--count">
    <div class="card__count">
        {#if count !== undefined}
            {count}
        {:else}
            &mdash;
        {/if}
    </div>
    <div class="card__label">
        {#if label}
        <header>
            <h3>{label}</h3>
        </header>
        {/if}
        {#if description}
        <p>{description}</p>
        {/if}
    </div>
</div>

<style>
    .card--count {
        color: var( --color-light );
        padding: clamp( 2rem, 1rem + 2vw, 3rem );
        background-color: var( --color-primary );
        border-radius: var( --border-radius );
    }
    .card__count {
        font-size: clamp( 7rem, 5rem + 5vw, 9rem );
      
        color: transparent;
        -webkit-text-stroke: 2px var( --color-primary-tint );
        text-stroke: 2px var( --color-primary-tint );
        font-weight: 700;
        line-height: 1;
        margin-bottom: .5rem;
        text-align: right
    }

    h3 {
        color: var( --color-light );
        font-size: var( --type-40 );
        font-weight: var( --weight-semi-bold );
        margin-bottom: .5rem;
    }
</style>