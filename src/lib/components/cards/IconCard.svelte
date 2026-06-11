<script>
    export let label = "Title";
    export let iconSrc = "";
    export let description = "";
    export let layout = "std";
</script>
<div class="card card--icon card-layout--{layout}">
    {#if iconSrc}
    <figure class="card__icon">
        {#if iconSrc}
            <img src="{iconSrc}" alt="{label} icon" />
        {:else}
            &mdash;
        {/if}
    </figure>
    {/if}
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
    .card--icon {
        padding: clamp( 2rem, 1rem + 2vw, 3rem );
        background-color: var( --color-light );
        border-radius: calc( var( --border-radius ) / 2 );
        
    }

    .card__label p:last-child {
        margin-bottom: 0
    }

    h3 {
        font-size: var( --type-40 );
        font-weight: var( --weight-semi-bold );
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        position: relative;
    }

    h3:after {
         content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 102px;
        height: 1px;
        background: linear-gradient(90deg, var( --color-primary-tint ), var( --color-secondary-tint ));
    }

    .card__icon {
        margin-bottom: 1em;
    }

    .card__icon img {
        width: 44px;
        height: 44px;
        object-fit: contain;
    }

    .card-layout--alt h3 {
        font-size: var( --type-30 );
       
    }

   
</style>