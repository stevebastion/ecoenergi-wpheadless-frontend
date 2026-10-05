<script>

  import { onMount } from 'svelte';
  import '@fontsource/poppins/400.css';
  import '@fontsource/poppins/400-italic.css';
  import '@fontsource/poppins/600.css';
  import '@fontsource/poppins/600-italic.css';
  import '$lib/styles/app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NavProgress from '$lib/components/common/NavProgress.svelte';
  // import app.css 


  export let data;

  //console.log('Layout data:', data);




  onMount(() => {
    // This runs after hydration
    document.documentElement.classList.add('sveltekit-ready');

  });

 
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<NavProgress />

<div class="app">
  <Header nav={data.navigation.main}   />

  <main id="main" tabindex="-1">
    <slot />
  </main>

  <Footer
    global={data.global}
    navs={data.navigation.footer}
  />
</div>

