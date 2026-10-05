<script>
  import '@glidejs/glide/dist/css/glide.core.min.css';
  import '@glidejs/glide/dist/css/glide.theme.min.css';

  import Glide from '@glidejs/glide';
  import { onMount, onDestroy } from 'svelte';

  export let sliderOptions = {
    type: 'slider',
    perView: 1,
    gap: 10,
    autoplay: false,
    animationDuration: 600,
    hoverpause: true
  }

  export let useBullets = false;
  export let useArrows = false;



  let sliderEl;
  let glide;

  onMount(() => {
    glide = new Glide(sliderEl, {
      ...sliderOptions
    });

    glide.mount();
  });

  onDestroy(() => {
    glide?.destroy();
  });
</script>

<div class="glide" bind:this={sliderEl}>
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
      <slot />
    </ul>
  </div>

  {#if useArrows}
  <div class="glide__arrows" data-glide-el="controls">
    <button type="button" class=" glide__arrow--left btn" data-glide-dir="<" aria-label="Previous slide"><svg aria-hidden="true" focusable="false" width="25" height="19" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.24358 17.6438L1.08578 10.486C0.304736 9.70494 0.304736 8.43861 1.08578 7.65756L8.24358 0.499766M5.74341 9.07178L24.3161 9.07178" stroke="#F0F8FA" stroke-linecap="round"/>
</svg>
</button>
    <button type="button" class=" glide__arrow--right btn" data-glide-dir=">" aria-label="Next slide"><svg aria-hidden="true" focusable="false" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5725 3.75025L23.7303 10.9081C24.5114 11.6891 24.5114 12.9554 23.7303 13.7365L16.5725 20.8943M19.0727 12.3223L0.5 12.3223" stroke="#F0F8FA" stroke-linecap="round"/>
</svg>
</button>
  </div>
    {/if}

    {#if useBullets}
        <div class="glide__bullets" data-glide-el="controls[nav]"></div>
    {/if}
</div>

<style>
  .glide {
    position: relative;
    margin: 2rem auto;
  }

  .glide__slide {
  
    position: relative;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  :global(.glide__slide--active) {
    opacity: 1;
  }

  .btn {
    text-align: center;
    padding: 1.5rem 3rem;
    
  }

  .btn svg {
     transform: translateX(0);
  }

  .btn:hover svg path { 
    stroke: var( --color-primary );
  }

  .glide__slide :global(img),
  .glide__slide :global(video) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .glide__arrows {
     display: flex;
     margin-top: 2em;
     justify-content: space-between;
    
  }
  
  @media screen and ( min-width: 768px ) {
    .glide__arrows {
      justify-content: flex-start;
      gap: 3rem;
    }
  }


</style>