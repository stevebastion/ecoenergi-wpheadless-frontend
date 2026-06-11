<script>
  import { PUBLIC_WP_URL, PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

  let formEl;
  let loading = false;
  let success = false;
  let errorMsg = '';

  async function handleSubmit(e) {
    e.preventDefault();
    errorMsg = '';
    loading = true;

    const formData = new FormData(formEl);

    const turnstileToken = formData.get('cf-turnstile-response');

    if (!turnstileToken) {
      errorMsg = 'Spam protection not ready. Please try again.';
      loading = false;
      return;
    }

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      telephone: formData.get('telephone'),
      company: formData.get('company'),
      message: formData.get('message'),
      page_url: window.location.pathname,
      form_type: 'contact',
      turnstile_token: turnstileToken
    };

    try {
      const res = await fetch(
        `${PUBLIC_WP_URL}/wp-json/eco-energi/v1/form-submission`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {

        // -- check if we have an error.message from the server

        throw new Error('Submission failed');
    
      }

      success = true;
      formEl.reset();
    } catch (err) {

      errorMsg = err?.message || 'Submission failed';
     
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
    async
    defer
  ></script>
</svelte:head>

<div class="form">
  {#if errorMsg}
    <p class="form__error">{errorMsg}</p>
  {/if}

  {#if success}
    <p class="form__success">Thanks — we’ll be in touch shortly.</p>
  {/if}

  <form bind:this={formEl} on:submit={handleSubmit}>
    <div class="form__fields">
      <div class="form__field">
        <label for="name">Name <span>*</span></label>
        <input type="text" id="name" name="name" placeholder="Name" required />
      </div>

      <div class="form__field">
        <label for="email">Email <span>*</span></label>
        <input type="email" id="email" name="email" placeholder="Email" required />
      </div>

      <div class="form__field">
        <label for="telephone">Telephone <span>*</span></label>
        <input type="tel" id="telephone" name="telephone" placeholder="Telephone" required />
      </div>

      <div class="form__field">
        <label for="company">Company</label>
        <input type="text" id="company" name="company" placeholder="Company" />
      </div>

      <div class="form__field form__field--wide">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Message" required></textarea>
      </div>
    </div>

    <footer>
      <!-- ✅ Turnstile widget (implicit render) -->
      <div
        class="cf-turnstile"
        data-sitekey={PUBLIC_TURNSTILE_SITE_KEY}
      ></div>

      <button type="submit" class="btn" disabled={loading}>
        {loading ? 'Sending…' : 'Submit'}
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M7.11955 0.499918L9.54289 2.92326C9.93342 3.31379 9.93342 3.94695 9.54289 4.33748L7.11955 6.76082M7.28262 3.6304L0.49997 3.6304"
            stroke="#56BEE1"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </footer>
  </form>
</div>

<style>
  .form__fields {
    display: grid;
    gap: 1.5rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 1.5rem;
    border: 1px solid #e3eef0;
    border-radius: calc(var(--border-radius) / 2);
    font-size: var(--type-18);
    background: #f0f8fa;
    color: var(--color-primary);
  }

  textarea {
    min-height: 150px;
  }

  footer {
    text-align: right;
  }

  .btn {

    width: 100%;
  }



  footer {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }

  @media (min-width: 768px) {
    .form__fields {
      grid-template-columns: 1fr 1fr;
    }

    .form__field--wide {
      grid-column: 1 / -1;
    }

    .btn {
      width: auto;
    }

    footer {
        margin-top: 2em;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

  }
</style>