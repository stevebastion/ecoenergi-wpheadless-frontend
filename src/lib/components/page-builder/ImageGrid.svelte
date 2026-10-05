<script> 
    import { strapiMedia } from '$lib/utils/media';
    export let data;


</script>

{#if data.Images && data.Images.length > 0}
<div class="image-grid" data-items={data.Images.length}>
    {#each data.Images as item}
        {#if item.mime === 'image/jpeg' || item.mime === 'image/png' || item.mime === 'image/gif' || item.mime === 'image/webp'}
            <figure >
                {#if item.formats.medium}
                <img loading="lazy" width={item.formats.medium.width} height={item.formats.medium.height} src={strapiMedia(item.formats.medium.url)} alt={item.alternativeText || ''} />
                {:else}
                <img loading="lazy" width={item.width} height={item.height} src={strapiMedia(item.url)} alt={item.alternativeText || ''} />
                {/if}
            </figure>
        {:else if item.mime === 'video/mp4' || item.mime === 'video/webm' || item.mime === 'video/ogg'}
            <div class="video-frame">
                
                    <video controls>
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
            
            </div>
        {/if}
    {/each}
</div>
{/if}

<style>

    .image-grid {
        display: grid;
        gap: 1rem;
    }

    figure {
        position: relative;
       
    }

    figure img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .image-grid[data-items='1'] {
        grid-template-columns: 1fr;
    }

    .image-grid[data-items='2'] {
        grid-template-columns: repeat(2, 1fr);
    }

    /* 3 Column Layout for 3 images - first image larger */
    .image-grid[data-items='3'] {
        grid-template-columns: repeat(2, 1fr);
    }

    .image-grid[data-items='3'] > *:nth-of-type(1) {
        grid-row: span 2;
        grid-column: span 1;
    }

    /* 4 Coliumn Layout */   
    .image-grid[data-items='4'] { 
        grid-template-columns: repeat(4, 1fr);
    }

    .image-grid[data-items='4'] > * {
        grid-row: span 1;
        grid-column: span 1;
    }

    .image-grid[data-items='4'] > *:nth-of-type(1) {
        grid-row: span 2;
        grid-column: span 2;
    }

    .image-grid[data-items='4'] > *:nth-of-type(2) {
        grid-row: span 1;
        grid-column: span 2;
    }

    /* 5 Coliumn Layout */   
    .image-grid[data-items='5'] { 
        grid-template-columns: repeat(5, 1fr);
    }   
    .image-grid[data-items='5'] > * {
        grid-row: span 1;
        grid-column: span 1;
    }
    .image-grid[data-items='5'] > *:nth-of-type(3) {
        grid-row: span 2;
        grid-column: span 2;
    }
    .image-grid[data-items='5'] > *:nth-of-type(1) {
        grid-row: span 1;
        grid-column: span 1;
    }
    .image-grid[data-items='5'] > *:nth-of-type(2) {
        grid-row: span 1;
        grid-column: span 2;
    }
    .image-grid[data-items='5'] > *:nth-of-type(4) {
        grid-row: span 1;
        grid-column: span 2;
    }

    /* 6 Coliumn Layout */ 
    .image-grid[data-items='6'] { 
        grid-template-columns: repeat(4, 1fr);
    }   
    .image-grid[data-items='6'] > * {
        grid-row: span 1;
        grid-column: span 1;
    }

    .image-grid[data-items='6'] > *:nth-of-type(4) {
        grid-column: span 2;
    }

     .image-grid[data-items='6'] > *:nth-of-type(5) {
        grid-column: span 2;
    }

     .image-grid[data-items='6'] > *:nth-of-type(6) {
        grid-column: span 2;
    }

 
    .image-grid[data-items='6'] > *:nth-of-type(1) {
        grid-row: span 2;
        grid-column: span 2;
    }
   

    /* 7+ Column Layout */
    .image-grid[data-items='7'] { 
        grid-template-columns: repeat(4, 1fr);
    }   
    .image-grid[data-items='7'] > * {
        grid-row: span 1;
        grid-column: span 1;
    }
    
    .image-grid[data-items='7'] > *:nth-of-type(1) {
        grid-row: span 2;
        grid-column: span 2;
    }

    .image-grid[data-items='7'] > *:nth-of-type(5),
    .image-grid[data-items='7'] > *:nth-of-type(4) {
        grid-row: span 1;
        grid-column: span 2;
    }

     .image-grid[data-items='7'] > *:nth-of-type(5) {
        grid-row: span 2;
     }

     .image-grid[data-items='7'] > *:nth-of-type(6),
    .image-grid[data-items='7'] > *:nth-of-type(7) {
        grid-column: span 2;
         grid-row: span 1;
    }


   

    .video-frame video {
        width: 100%;
        height: auto;
        border-radius: var( --border-radius );
    }

    @media screen and ( max-width: 600px ) {
        :global(.block--image-grid) {
            overflow: hidden;
            width: 100vw;
            transform: translateX(-5vw);
        }
        .image-grid {
            transform-origin: 50% 50%;
            padding: 6em 0;
            transform: scale(1.5);
            overflow: hidden;
        }
    }

</style>