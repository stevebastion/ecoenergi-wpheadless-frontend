<script>
  import { page } from '$app/stores';
  import Button from '$lib/components/common/Button.svelte';

  $: status = $page.status;
  $: notFound = status === 404;
  $: heading = notFound ? "We can't find that page" : 'Something went wrong';
  $: message = notFound
    ? 'The page may have moved or no longer exists. Try one of the links below.'
    : "That's a problem on our side, not yours. Please try again in a moment, or get in touch if it keeps happening.";
</script>

<svelte:head>
  <title>{notFound ? 'Page not found' : 'Something went wrong'} | Eco Energi</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="error" data-header-theme="light">
  <div class="container">
    <p class="error__status" aria-hidden="true">{status}</p>
    <h1>{heading}</h1>
    <p class="error__message">{message}</p>

    <div class="error__actions">
      {#if !notFound}
        <button type="button" class="btn light" on:click={() => location.reload()}>
          Try again
          <svg aria-hidden="true" focusable="false" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.11955 0.499918L9.54289 2.92326C9.93342 3.31379 9.93342 3.94695 9.54289 4.33748L7.11955 6.76082M7.28262 3.6304L0.49997 3.6304" stroke="#56BEE1" stroke-linecap="round"/>
          </svg>
        </button>
      {/if}
      <Button title="Back to home" link="/" variant="light" />
      <Button title="Contact us" link="/contact" variant="light" />
    </div>
  </div>
</section>

<style>
  .error {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 80vh;
    padding: 16rem 0 8rem;
    background: var(--color-primary);
    color: var(--color-light);
    overflow: hidden;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .error__status {
    margin: 0 0 1rem;
    font-size: clamp(9rem, 6rem + 12vw, 20rem);
    font-weight: 700;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px var(--color-primary-tint);
  }

  h1 {
    color: var(--color-light);
    font-size: var(--type-54);
  }

  .error__message {
    max-width: 52ch;
    margin-bottom: 3rem;
  }

  .error__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
</style>
