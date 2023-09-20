<script>
    export let product = [];
    import { fade } from 'svelte/transition';
       let open = false;
    $: openClass = open ? 'open' : 'closed';

</script>

<div class="product-card {openClass}" in:fade={{duration: 300}} >
    <div class="product-block-image">
        <img src={product.image_url} alt="" />
        <div class="product-title">{@html product.title}</div>
        <div class="sku-count" on:click={() => {open = true}}>
            {product.skus.length}
            {#if product.skus.length == 1} SKU{/if}{#if product.skus.length > 1} SKUs{/if}

        </div>
        <a class="product-card-link" href={product.link}>></a>
    </div>
    <div class="sku-list-container">
        <div class="sku-list">
            {#each product.skus as sku}
                <span>
                    {sku} 
                    </span>

            {/each}
        </div>
        <div class="product-title">{@html product.title}</div>
        <div class="sku-close" on:click={() => {open = false}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>
        </div>
        <a class="product-card-link" href={product.link}>></a>
    </div>
</div>
