<script>
  import { navigating } from '$app/stores';

  // idle -> loading (while SvelteKit fetches the next page) -> done -> idle
  let state = 'idle';
  let timer;

  $: if ($navigating) {
    clearTimeout(timer);
    state = 'loading';
  } else if (state === 'loading') {
    state = 'done';
    timer = setTimeout(() => (state = 'idle'), 500);
  }
</script>

<div
  class="nav-progress"
  class:loading={state === 'loading'}
  class:done={state === 'done'}
  aria-hidden="true"
></div>

<style>
  .nav-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0;
    opacity: 0;
    background: var(--color-secondary);
    box-shadow: 0 0 8px var(--color-secondary);
    pointer-events: none;
    z-index: 10001;
  }

  /* Creeps towards 85% so it feels alive on slow pages, then snaps to 100%. */
  .nav-progress.loading {
    opacity: 1;
    width: 85%;
    transition: width 10s cubic-bezier(0.1, 0.6, 0.2, 1);
  }

  .nav-progress.done {
    width: 100%;
    opacity: 0;
    transition: width 0.2s ease, opacity 0.3s ease 0.2s;
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-progress.loading,
    .nav-progress.done {
      transition: none;
    }
    .nav-progress.loading {
      width: 100%;
    }
  }
</style>
