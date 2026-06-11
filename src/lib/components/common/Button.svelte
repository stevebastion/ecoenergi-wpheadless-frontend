<script> 
    export let title = "Get in Touch";
    export let link = ""
    export let style = "";
    export let variant = "";
</script>

{#if link}
    <a href={link} class="btn {style} {variant}">
        {title}
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.11955 0.499918L9.54289 2.92326C9.93342 3.31379 9.93342 3.94695 9.54289 4.33748L7.11955 6.76082M7.28262 3.6304L0.49997 3.6304" stroke="#56BEE1" stroke-linecap="round"/>
        </svg>
    </a>
{:else}
    <button class="btn {style}">
        {title}
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.11955 0.499918L9.54289 2.92326C9.93342 3.31379 9.93342 3.94695 9.54289 4.33748L7.11955 6.76082M7.28262 3.6304L0.49997 3.6304" stroke="#56BEE1" stroke-linecap="round"/>
        </svg>

    </button>
{/if}

<style>
    
</style>