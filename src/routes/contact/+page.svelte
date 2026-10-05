<script>
    import { page } from '$app/stores';
    import Masthead from '$lib/components/common/Masthead.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import ContactForm from '$lib/components/forms/ContactForm.svelte';
    import MapBoxMap from '$lib/components/common/MapBoxMap.svelte';
    import MetaHead  from '$lib/components/seo/MetaHead.svelte';
    export let data;


    let markers = [];

    if( data.pageData.location ) {

      markers.push(
        {
            coordinates: [ data.pageData.location.center[0], data.pageData.location.center[1] ],
            text: "Eco Energi"
        }
      )

  
    }

</script>

<MetaHead
  pageSeo={data.pageData?.seo}
  globalSeo={data.global.data.defaultSeo}
  pageTitle={data.pageData?.title || 'Contact'}
/>


<section data-header-theme="dark">
<div class="vr vr--space-bottom">
<div class="container" data-header-theme="dark">
    <h1>{data.pageData.title}</h1>
    <p>{data.pageData.lead_in_text}</p>
</div>

<div class="panel panel--dark container container--wide grid--2" >
    <article>
        <h2>Choose the option that works best for you:</h2>
        <ul class="contact-list">
            {#if data.global.data.phone_number}
            <li class="contact-list__item"> 
                <p>Call us to speak directly with one of our engineers:</p>
                <div class="contact-list__row">
                    <span>
                        <svg width="13" height="24" viewBox="0 0 13 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_235_1131)">
                            <path d="M11.0343 0.324341H1.96622C1.05613 0.324341 0.318359 1.0765 0.318359 2.00434V21.9957C0.318359 22.9235 1.05613 23.6757 1.96622 23.6757H11.0343C11.9443 23.6757 12.6821 22.9235 12.6821 21.9957V2.00434C12.6821 1.0765 11.9443 0.324341 11.0343 0.324341Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.6821 2.00434V21.9957C12.6821 22.9233 11.9441 23.6757 11.0327 23.6757H1.96622C1.0564 23.6757 0.318359 22.9233 0.318359 21.9957V2.00434C0.318359 1.07677 1.0564 0.324341 1.96622 0.324341H11.0327C11.9441 0.324341 12.6821 1.07677 12.6821 2.00434Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.50018 22.7497C6.92097 22.7497 7.26208 22.402 7.26208 21.973C7.26208 21.544 6.92097 21.1962 6.50018 21.1962C6.0794 21.1962 5.73828 21.544 5.73828 21.973C5.73828 22.402 6.0794 22.7497 6.50018 22.7497Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7.98182 1.4303H6.55664" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.36108 1.4303H5.30859" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.6826 20.1909H0.380859" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M0.441406 2.61566H12.6827" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_235_1131">
                            <rect width="13" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </span>
                    <a href={`tel:${data.global.data.phone_number}`}>
                        {data.global.data.phone_number}
                    </a>
                </div>
            </li>
            {/if}
            {#if data.global.data.email_address}
            <li class="contact-list__item"> 
                <p>Email us with details of your project</p>
                <div class="contact-list__row">
                    <span>
                        <svg width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.6086 4.8028L22.5793 16.2011C22.5793 17.1944 21.7673 18.0021 20.7647 18.0021H3.81111C3.45316 18.0021 3.11836 17.8979 2.84233 17.7176C2.33658 17.4012 2 16.8392 2 16.2011L3.02754 4.8028C3.02754 4.49527 3.10768 4.2054 3.2448 3.95089C3.29645 3.85191 3.36056 3.75647 3.43179 3.6681C3.50302 3.58149 3.5796 3.50196 3.66686 3.43126C3.98563 3.16084 4.39522 3 4.84221 3H21.7958C22.2463 3 22.6541 3.16261 22.9711 3.43126C23.0566 3.50196 23.1349 3.58326 23.2062 3.6681C23.2774 3.7547 23.338 3.84838 23.3896 3.94912C23.4501 4.0587 23.4982 4.17536 23.5338 4.30085C23.5819 4.45815 23.6086 4.62959 23.6086 4.8028Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.66406 3.43127L11.4374 10.7202C12.2245 11.4573 13.4355 11.4891 14.2582 10.7927L22.9701 3.43127" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <a href={`mailto:${data.global.data.email_address}`}>
                        {data.global.data.email_address}
                    </a>
                </div>
            </li>
            {/if}
        </ul>
    </article>
    <aside>
        <div class="form-wrapper">
            <div class="contact-list__row">
                   <span>
                       <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.9983 12.045C17.9996 12.0884 17.9996 12.1305 17.9983 12.1764C17.9895 13.8711 17.9299 16.1373 17.9223 19.3977C17.9223 19.7362 17.5421 19.9432 17.2467 19.7672L14.1352 17.9126L13.888 17.7663C13.3126 17.4229 12.6193 17.3274 11.9678 17.4935C11.3341 17.6547 10.6674 17.7415 9.98047 17.7427C9.39238 17.744 8.81823 17.6832 8.26562 17.5642C5.18319 16.9047 2.75223 14.486 2.14513 11.4437C2.05007 10.9714 2.00064 10.483 1.9981 9.98461C1.98163 5.6704 5.55202 2.16821 9.96019 2.16821C12.9983 2.16821 15.8221 3.91869 17.1352 6.58035C17.191 6.69193 17.2442 6.80598 17.2936 6.92127C17.8906 8.2986 18.0072 9.53211 17.9983 12.045Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.10382 11.264C6.75551 11.264 7.28381 10.7472 7.28381 10.1098C7.28381 9.47237 6.75551 8.95563 6.10382 8.95563C5.45213 8.95563 4.92383 9.47237 4.92383 10.1098C4.92383 10.7472 5.45213 11.264 6.10382 11.264Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.97101 11.264C10.6227 11.264 11.151 10.7472 11.151 10.1098C11.151 9.47237 10.6227 8.95563 9.97101 8.95563C9.31932 8.95563 8.79102 9.47237 8.79102 10.1098C8.79102 10.7472 9.31932 11.264 9.97101 11.264Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.8401 11.264C14.4918 11.264 15.0201 10.7472 15.0201 10.1098C15.0201 9.47237 14.4918 8.95563 13.8401 8.95563C13.1885 8.95563 12.6602 9.47237 12.6602 10.1098C12.6602 10.7472 13.1885 11.264 13.8401 11.264Z" stroke="#123053" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                   </span>
                   Request a Quote or Consultation
                </div>
             <ContactForm />
        </div>
       
    </aside>
</div>
</div>
</section>
<section class="map" data-header-theme="light">
    <MapBoxMap 
        center={data.pageData.location ? [data.pageData.location.center[0], data.pageData.location.center[1]] : [-1.6178, 54.9783]}
        markers={markers}
        zoom={12}
        style="light"
        markerText="Eco Energi North East Ltd"
    />
</section>



<style>

    .contact-list {
        display: grid;
        gap: 2em;
    }

    article h2 {
        margin-bottom: 1em
    }

    .form-wrapper {
        background: var( --color-light );
        padding: clamp( 2rem, 1rem + 2vw, 3rem );
        border-radius: var( --border-radius );
    }

    .form-wrapper .contact-list__row {
        color: var( --color-primary );
        line-height: 1.1;
    }

    
    

    .contact-list__row {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: var( --type-40 );
        font-weight: var( --weight-semi-bold );
    }

    .form-wrapper .contact-list__row {
        align-items: flex-start;
    }

    .contact-list__row  a {
        text-decoration: none;
        color: var( --color-light );
    }

    .contact-list__row span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.5rem;
        height: 4.5rem;
        background-color: var( --color-secondary );
        border-radius: 50%;
        flex-shrink: 0;
    }

    .panel--dark {
        display: grid;
        gap: clamp( 4rem, 2rem + 4vw, 6rem );
   }

   @media screen and ( max-width: 767px ) {

    .panel--dark {
       width: 100%;
       padding-left: 5vw;
        padding-right: 5vw;
        border-radius: 0;
    }


   }


   @media screen and ( min-width: 1024px ) {
      .panel--dark {
         display: flex;
         justify-content: space-between;
         align-self: flex-start;
         gap: clamp( 4rem, 2rem + 4vw, 6rem );
      }

      .panel--dark > * {
         flex-basis: 50%;
      }

      

      article {
        max-width: 678px;
      }
      aside {
        max-width: 820px;
      }
     
   }

</style>