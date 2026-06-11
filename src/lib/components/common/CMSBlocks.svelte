<script>
  export let data;

  import RichText from '$lib/components/page-builder/RichText.svelte';
  import ImageGrid from '$lib/components/page-builder/ImageGrid.svelte';
  import Media  from '$lib/components/page-builder/Media.svelte';
</script>


{#if data}
<div class="">
    <section class="blocks container vr vr--space-y">
        {#each data as block}
            <div class="block block--{block.__component}">
                {#if block.__component === 'shared.rich-text'}
                    <RichText content={block.body} />
                {/if}
                {#if block.__component === 'shared.image-grid'}
                    <ImageGrid data={block} />
                {/if}
                {#if block.__component === 'shared.media'}
                    <Media data={block} />
                {/if}
            </div>
        {/each}
    </section>
</div>
{/if}