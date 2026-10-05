<script>    import { optimised, srcset } from '$lib/utils/img';
 
    import { strapiMedia } from '$lib/utils/media';
    export let data;


</script>

{#if data && data.file }
    {#if data.file.mime === 'image/jpeg' || data.file.mime === 'image/png' || data.file.mime === 'image/gif' || data.file.mime === 'image/webp'}
        <figure class="image-16_9 m-image-4_3 img-cover">
            <img loading="lazy" width={data.file.formats?.large?.width} height={data.file.formats?.large?.height} src={optimised(strapiMedia(data.file.url), 1280)} srcset={srcset(strapiMedia(data.file.url), data.file.width || Infinity)} sizes="(min-width: 1024px) 66vw, 100vw" alt={data.file.alternativeText || ''} />
        </figure>
    {:else if data.file.mime === 'video/mp4' || data.file.mime === 'video/webm' || data.file.mime === 'video/ogg'}
        <div class="video-frame">
            
                <video controls>
                    <source src={data.file.url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
        
        </div>
    {/if}
{/if}

<style>
    .video-frame video {
        width: 100%;
        height: auto;
        border-radius: var( --border-radius );
    }
</style>