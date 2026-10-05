<script>
    import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';

    export let preTitle = "";
    export let title = "";
    export let description = "";
    export let blockHeader = false;
    export let backgroundImage = "";
    export let className = "";
</script>

<section class="masthead {className} {blockHeader ? 'masthead--block' : ''}" data-header-theme="light">
    <div class="container">
        <div>
        <Breadcrumbs />
       
        {#if title}
            <h1 class="masthead__title">{title}</h1>
        {/if}
        {#if description}
            <p class="masthead__description">{description}</p>
        {/if}
        </div>
    </div>
</section>

<style>

    .masthead {
       background: var( --color-primary );
       color: var( --color-light );
       background-image: url('/std-header.jpg');
       background-size: cover;
       background-position: center;
       position: relative;
       padding: 14rem 0 4rem 0;
    }

    .masthead:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var( --color-primary );
        opacity: 0.93;
        z-index: 0;
    }

    .masthead__pretitle {
        color: var( --color-secondary );
    }

    .masthead__title {
        font-size: var( --type-54 );
        color: var( --color-light );
    }

    .container {
        position: relative;
        z-index: 2;
      
    }

    @media screen and ( min-width: 1024px ) {

        .masthead--service .container  div{
            max-width: 720px;
        }

        .masthead:not(.masthead--block) {
            background-color: transparent;
            padding-top: 11rem;
        }

        .masthead.masthead--block {
            padding-top: clamp(10em, 40vh, 20em);
            display: flex;
            align-items: flex-end;
            justify-content: center;
            
            padding-bottom: 10vh;
        }

        :global(main:not(.masthead--block)) {
            position: relative;
        }

        :global(main:has(.masthead:not(.masthead--block))) {
            background: transparent;
            padding-top: var( --mastheadPadding );
        }

        :global(main .masthead:not(.masthead--block)) {
            background: transparent
        }

         :global(main .masthead:not(.masthead--block):after) {
            display: none;
         }

        :global(main:has(.masthead:not(.masthead--block))::after) {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            /* 100vh capped at 700px; once the viewport passes 1400px tall, 50vh */
            height: max( min( 100vh, 700px ), 50vh );
            background: var( --color-secondary );
            z-index: 0;
            background-image: url('/std-header.jpg');
            background-size: cover;
            background-position: center;
        } 

         :global(main:has(.masthead:not(.masthead--block))::before) {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            /* 100vh capped at 700px; once the viewport passes 1400px tall, 50vh */
            height: max( min( 100vh, 700px ), 50vh );
            background-color: var( --color-primary );
            opacity: 0.85;
            z-index: 1;
         }

         :global(main:has(.masthead:not(.masthead--block)) > *) {
            position: relative;
            z-index: 2;
         }

    }

</style>