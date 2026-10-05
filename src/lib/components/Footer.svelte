<script>
  export let global;
  export let navs;

   import { strapiMedia } from '$lib/utils/media';
   import { resolveNavPath } from '$lib/utils/resolveNavPath';
  import { openPreferences } from '$lib/consent/consentStore.js';
</script>

<footer class="img-cover">
  <div class="container">
    <figure>
      <img src="/logo.svg" width="219" alt="Eco Energi" />
    </figure>
    <div class="footer__items">
        <div class="footer__navs">
          {#each navs as nav, i}
            <div class="footer__col">
              <h4>{global.data[`footer_nav_${i + 1}_title`]}</h4>

              <ul>
                {#each nav as item}
                  <li>
                    {#if item.type === 'EXTERNAL'}
                      <a href={resolveNavPath(item)} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    {:else}
                      <a href={resolveNavPath(item)}>{item.title}</a>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>

          <div class="footer__meta">
            <div class="footer__contacts">
            {#if global.data.phone_number}
              <p class="footer__phone">
                <a href={`tel:${global.data.phone_number}`}>
                  {global.data.phone_number}
                </a>
              </p>
            {/if}

            {#if global.data.email_address}
              <p class="footer__email">
                <a href={`mailto:${global.data.email_address}`}>
                  {global.data.email_address}
                </a>
              </p>
            {/if}
            </div>

            {#if global.data.footer_logos}
              <div class="logos">
                {#each global.data.footer_logos as logo}
                  <img
                    src={strapiMedia(logo.url)}
                    alt={logo.alternativeText || ''}
                  />
                {/each}
              </div>
            {/if}
          </div>
    </div>

    <div class="footer__copyright">
      <p>
        &copy; {new Date().getFullYear()} EcoEnergi. All rights reserved.
        <a href="/privacy-policy">Privacy Policy</a>
        <button type="button" class="cookie-settings" on:click={openPreferences}>Cookie settings</button>
      </p>

      <a href="https://studiobastion.com" target="_blank" rel="noopener noreferrer">
        <small>Website by Studio Bastion</small>
      </a>
    </div>


  </div>
  
  
 <img loading="lazy" src="/contact-bg.webp" alt="" />

</footer>


<style>
   footer {
    
    padding: 4rem 0;
    position: relative;
  }
  .footer__phone,
  .footer__email {
   
    margin: 0;
    text-decoration: none;
    margin: 0;
    font-weight: var( --weight-semi-bold );
  }

  a {
     color: var( --color-light );
    text-decoration: none;
    transition: color .3s ease-in-out;
  }

  a:hover {
   
    color: var( --color-secondary );
  }

  .footer__copyright {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4rem;
  }

  .footer__copyright a,
  .footer__copyright {
     color: var( --color-primary-tint );
    
  }

  .footer__copyright p {
    margin: 0;
  }

  .footer__copyright a:hover {
    color: var( --color-light );
  }

  .cookie-settings {
    margin-left: 1rem;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    color: var( --color-primary-tint );
    text-decoration: underline;
    text-underline-offset: 0.2em;
    cursor: pointer;
  }

  .cookie-settings:hover {
    color: var( --color-light );
  }

  

  .footer__phone {
    font-size: var( --type-40 );
  }

  .footer__email {
    font-size: var( --type-30 );
    margin-bottom: 2rem;
  }

  footer:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      25deg,
      #123053 0%,
      #0094C6 59%,
      #8AD322 93%
    );
    opacity: 0.85;
    pointer-events: none;
    z-index: 1;
  }

  footer .container {
     background-color: var( --color-primary );
     border-radius: var( --border-radius );
     padding: clamp( 2rem, 1rem + 2vw, 4rem );
     position: relative;
      z-index: 2;
  }

  .footer__col h4 {
    color: var( --color-secondary ); 
    font-weight: var( --weight-regular );
    font-size: var( --type-20 );
    margin: 0;
  }

  .footer__col ul {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }

  .footer__col a {
    color: var( --color-light );
    text-decoration: none;
  }

  .footer__col a:hover {

    color: var( --color-secondary );
  }

  .footer__navs {
    display: grid;
    gap: 2rem;
  }

  figure {
    margin-bottom: 4rem
  }


  .footer__contacts {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  @media screen and ( max-width: 767px ) {

    footer {
      padding: 0;
      background-color: var( --color-primary );
    }

     footer:after {
      display: none;
    }

    .container {
      width: 100%;
      padding: 0 5vw;
      border-radius: 0 !important;
    }

    .footer__copyright {
      flex-direction: column;
      gap: 1rem;
    }

  }

  @media screen and ( min-width: 767px ) {
    .footer__navs {
      grid-template-columns: repeat( auto-fit, minmax( 180px, 1fr ) );
    }
  }


  @media screen and ( min-width: 1200px ) {
    .footer__items {
      display: flex;
      justify-content: space-between;
    }

    .footer__navs {
      flex: 1;
      grid-template-columns: 1fr 1fr 1fr;
      max-width: 920px
    }

    .footer__meta {
       
    }
  }

  .logos {
    display: flex;
    justify-content: flex-end;
    gap: 2rem;
    align-items: center;
    margin-top: 2rem;
  }

  .logos img {
    max-height: 75px;
    width: auto
  }

</style>