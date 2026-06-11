<script>

  import { onMount } from 'svelte';
   import '$lib/styles/app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  // import app.css 

    import { beforeNavigate } from '$app/navigation';

  beforeNavigate(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => Promise.resolve());
    }
  });
  

  export let data;

  //console.log('Layout data:', data);




  onMount(() => {
    // This runs after hydration
    document.documentElement.classList.add('sveltekit-ready');

  });

 
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
</svelte:head>



<div class="app" style="view-transition-name: main;" >
  <Header nav={data.navigation.main}   />

  <main >
    <slot />
  </main>

  <Footer
    global={data.global}
    navs={data.navigation.footer}
  />
</div>

