<script>
    import Button from '$lib/components/common/Button.svelte';

  export let title = "Ready to save on your energy costs?";
  export let description = "Contact us today for a free, no-obligation quote and let’s explore how solar could work for your home.";
  export let buttonText = "Get in Touch";
  export let buttonLink = "/contact";
</script>

<section class="contact-cta" data-header-theme="light">
    <div class="container container--wide img-cover">
        <div class="contact-cta__content">
            <h2>{title}</h2>
            <p>{description}</p>
            <Button title="{buttonText}" link="{buttonLink}" />
          
            
        </div>
         <img loading="lazy" src="/contact-bg-2.jpg" alt="" />
    </div>
    
</section>

<style>

    .contact-cta > div  {
        border-radius: var( --border-radius );
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;
        z-index: 2;
        aspect-ratio: 17 / 8;
        background-color: #eee;
        padding: clamp( 2rem, 1rem + 2vw, 4rem );
    }

    .contact-cta > div:after {
        background: var( --overlay-gradient );
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.85;
        pointer-events: none;
        z-index: 1;
    }

    .contact-cta__content {
        background: #fff;
        border-radius: calc( var( --border-radius ) / 2 );
        padding: clamp( 2rem, 1rem + 2vw, 4rem );
        position: relative;
        z-index: 2;
        max-width: 547px;
    }

    h2 {
        font-size: var( --type-40 );
        font-weight: var( --weight-semi-bold );
        padding-bottom: 1em;
        margin-bottom: 1em;
        position: relative;

    }

    h2:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 102px;
        height: 1px;
        background: linear-gradient(90deg, var( --color-primary-tint ), var( --color-secondary-tint ));
    }

    @media screen and ( max-width: 768px ) {
        .contact-cta > div {
            aspect-ratio: auto;
        }
         .contact-cta .container {
            width: 100%;
            border-radius: unset;
            padding: 3em 5vw;
        }
    }

</style>