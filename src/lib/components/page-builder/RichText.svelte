<script>
    // WordPress WYSIWYG fields return ready-to-render HTML.
    export let content = '';
</script>

<div class="rich-text rich-text--content">
     {@html content}
</div>


<style>
    .rich-text {
        max-width: 1387px;
    }

    .rich-text :global(ul) {
        list-style: disc;
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .rich-text :global(ol) {
        list-style: decimal;
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .rich-text :global(p:first-of-type) {
       font-size: var( --type-20 );
       font-weight: var( --weight-semi-bold );
       margin-bottom: 1.5rem;
       line-height: 1.6;
    }

</style>