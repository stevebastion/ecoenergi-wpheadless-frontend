<script>
  import { tick } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { CATEGORIES, acceptAll, rejectAll } from '$lib/consent/consent.js';
  import {
    consent,
    preferencesOpen,
    initConsent,
    saveChoices,
    acceptAllCookies,
    rejectAllCookies,
    openPreferences,
    closePreferences
  } from '$lib/consent/consentStore.js';
  import { trackPageView } from '$lib/consent/analytics.js';

  let panel;
  let draft = { necessary: true, analytics: false, marketing: false };
  let opener = null;

  onMount(initConsent);

  // Count client-side navigations (and the first page) once analytics is live.
  const track = () => {
    if ($consent.choices.analytics) {
      trackPageView($page.url.pathname + $page.url.search, { title: document.title });
    }
  };
  afterNavigate(track);
  $: if ($consent.ready && $consent.choices.analytics) track();

  // Open the dialog with the current choices as the starting point.
  $: if ($preferencesOpen) openDialog();
  async function openDialog() {
    draft = { ...$consent.choices, necessary: true };
    opener = document.activeElement;
    document.body.style.overflow = 'hidden';
    await tick();
    panel?.focus();
  }

  function close() {
    closePreferences();
    document.body.style.overflow = '';
    opener?.focus?.();
    opener = null;
  }

  // The store closes the dialog itself after saving; make sure the page unlocks.
  $: if (!$preferencesOpen && typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }

  function onKeydown(event) {
    if (!$preferencesOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab' || !panel) return;

    // Keep Tab inside the dialog.
    const focusable = [
      ...panel.querySelectorAll('button, [href], input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')
    ];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if $consent.ready && !$consent.decided && !$preferencesOpen}
  <section class="cc cc-banner" aria-labelledby="cc-banner-title">
    <div class="cc-banner__text">
      <h2 id="cc-banner-title">Cookies on this site</h2>
      <p>
        We use essential cookies to make the site work. With your permission we'd also like to use
        analytics cookies to see how it's used and improve it. You can change your mind at any time.
        <a href="/privacy-policy">Privacy Policy</a>
      </p>
    </div>
    <div class="cc-banner__actions">
      <button type="button" class="cc-link" on:click={openPreferences}>Customise</button>
      <button type="button" class="btn" on:click={rejectAllCookies}>Reject non-essential</button>
      <button type="button" class="btn" on:click={acceptAllCookies}>Accept all</button>
    </div>
  </section>
{/if}

{#if $preferencesOpen}
  <div class="cc cc-backdrop" role="presentation" on:click|self={close}>
    <div
      class="cc-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cc-dialog-title"
      tabindex="-1"
      bind:this={panel}
    >
      <header class="cc-dialog__header">
        <h2 id="cc-dialog-title">Cookie preferences</h2>
        <button type="button" class="cc-close" aria-label="Close cookie preferences" on:click={close}>
          <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 3l12 12M15 3L3 15" />
          </svg>
        </button>
      </header>

      <div class="cc-dialog__body">
        <p>
          Choose which cookies we may use. Strictly necessary cookies are always on because the site
          cannot work without them.
          <a href="/privacy-policy">Privacy Policy</a>
        </p>

        {#each CATEGORIES as cat}
          <div class="cc-cat">
            <div class="cc-cat__head">
              <label for="cc-{cat.id}">{cat.label}</label>
              {#if cat.required}
                <span class="cc-always">Always on</span>
                <input id="cc-{cat.id}" type="checkbox" role="switch" checked disabled aria-describedby="cc-{cat.id}-desc" />
              {:else}
                <input
                  id="cc-{cat.id}"
                  type="checkbox"
                  role="switch"
                  bind:checked={draft[cat.id]}
                  aria-describedby="cc-{cat.id}-desc"
                />
              {/if}
            </div>
            <p id="cc-{cat.id}-desc">{cat.description}</p>

            {#if cat.cookies.length}
              <details>
                <summary>Cookies in this category ({cat.cookies.length})</summary>
                <ul>
                  {#each cat.cookies as cookie}
                    <li>
                      <strong>{cookie.name}</strong>: {cookie.purpose} <em>({cookie.duration})</em>
                    </li>
                  {/each}
                </ul>
              </details>
            {/if}
          </div>
        {/each}
      </div>

      <footer class="cc-dialog__footer">
        <button type="button" class="btn" on:click={() => saveChoices(rejectAll())}>Reject non-essential</button>
        <button type="button" class="btn" on:click={() => saveChoices(acceptAll())}>Accept all</button>
        <button type="button" class="btn cc-save" on:click={() => saveChoices(draft)}>Save preferences</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .cc {
    font-size: 1.4rem;
    line-height: 1.5;
    color: var(--color-primary);
  }

  h2 {
    margin: 0 0 0.5rem;
    font-size: var(--type-20);
    color: var(--color-primary);
  }

  p {
    margin: 0 0 1rem;
  }

  a {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  /* Buttons: Accept and Reject are deliberately identical in weight. */
  .btn {
    padding: 1rem 2rem;
    font-size: 1.4rem;
    white-space: nowrap;
  }

  .cc-link {
    background: none;
    border: 0;
    padding: 1rem 0.5rem;
    font: inherit;
    font-weight: var(--weight-semi-bold);
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    cursor: pointer;
  }

  /* ---- Banner ---------------------------------------------------------- */

  .cc-banner {
    position: fixed;
    z-index: 9000;
    left: 1.5rem;
    right: 1.5rem;
    bottom: 1.5rem;
    max-width: 96rem;
    margin: 0 auto;
    display: grid;
    gap: 1.5rem;
    padding: 2rem;
    background: var(--color-light);
    border-radius: var(--border-radius);
    box-shadow: 0 10px 40px rgba(18, 48, 83, 0.25);
    border: 1px solid rgba(18, 48, 83, 0.1);
  }

  .cc-banner__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }

  @media (min-width: 900px) {
    .cc-banner {
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 3rem;
    }
  }

  /* ---- Dialog ---------------------------------------------------------- */

  .cc-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9500;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: rgba(18, 48, 83, 0.6);
  }

  .cc-dialog {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 64rem;
    max-height: calc(100vh - 3rem);
    background: var(--color-light);
    border-radius: var(--border-radius);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    outline: none;
  }

  .cc-dialog__header,
  .cc-dialog__footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
  }

  .cc-dialog__header {
    justify-content: space-between;
    border-bottom: 1px solid rgba(18, 48, 83, 0.1);
  }

  .cc-dialog__header h2 {
    margin: 0;
    font-size: var(--type-30);
  }

  .cc-dialog__footer {
    flex-wrap: wrap;
    justify-content: flex-end;
    border-top: 1px solid rgba(18, 48, 83, 0.1);
  }

  .cc-dialog__body {
    overflow-y: auto;
    padding: 2rem;
  }

  .cc-close {
    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--color-primary);
    cursor: pointer;
  }

  .cc-close:hover {
    background: var(--color-primary-light);
  }

  /* The primary action in the dialog is filled. */
  .cc-save {
    background: var(--color-secondary);
  }

  .cc-cat {
    padding: 1.5rem 0;
    border-top: 1px solid rgba(18, 48, 83, 0.1);
  }

  .cc-cat__head {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .cc-cat__head label {
    flex: 1;
    font-weight: var(--weight-semi-bold);
    font-size: var(--type-16);
  }

  .cc-always {
    font-size: 1.2rem;
    color: var(--color-primary-tint);
    font-weight: var(--weight-semi-bold);
  }

  details {
    margin-top: 0.5rem;
  }

  summary {
    cursor: pointer;
    font-weight: var(--weight-semi-bold);
  }

  details ul {
    display: grid;
    gap: 0.5rem;
    margin: 1rem 0 0;
    padding-left: 2rem;
    list-style: disc;
  }

  /* ---- Switch (a real checkbox, so it works with keyboard and screen readers) */

  input[type='checkbox'] {
    appearance: none;
    position: relative;
    flex: none;
    width: 4.8rem;
    height: 2.6rem;
    margin: 0;
    border-radius: 2.6rem;
    background: #9aa8b8;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  input[type='checkbox']::after {
    content: '';
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s ease;
  }

  input[type='checkbox']:checked {
    background: var(--color-primary);
  }

  input[type='checkbox']:checked::after {
    transform: translateX(2.2rem);
  }

  input[type='checkbox']:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    input[type='checkbox'],
    input[type='checkbox']::after {
      transition: none;
    }
  }
</style>
