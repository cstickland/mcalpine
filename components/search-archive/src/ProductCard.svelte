<script>
    import { fade } from 'svelte/transition'
    export let product = [];
    let open = false;
    $: openClass = open ? "open" : "closed";
</script>

<div class="product-card-container" in:fade={{ delay: 300, duration: 300}}>
    <div class="product-card {openClass}" >
        <div class="product-block-image">
            <a class="product-image-link" href={product.link}><img src={product?.item?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl} alt="" /></a>
            <div class="product-title">{@html product.item.title}</div>
            <div
                class="sku-count"
                on:click={() => {
                    open = true;
                }}
                on:keydown
            >
                <span class="sku-count-default">
                    {product.item.customFields2.skus.length}
                    {#if product.item.customFields2.skus.length == 1}
                        SKU{/if}{#if product.item.customFields2.skus.length > 1} SKUs{/if}
                </span>
                <span class="sku-count-small">SKUs</span>
            </div>
            <a class="product-card-link" href={product.link}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13.922"
                    height="16.245"
                    viewBox="0 0 13.922 16.245"
                    ><path
                        d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                        fill="#fff"
                    /></svg
                >
            </a>
        </div>
        <div class="sku-list-container">
            <div class="sku-list">
                {#each product.item.customFields2.skus as sku}
                    <span>
                        <a href={`${product.item.link}/?sku=${sku.sku}`}>{sku.sku}</a>
                    </span>
                {/each}
            </div>
            <div class="product-title">{@html product.item.title}</div>
            <div
                class="sku-close"
                on:click={() => {
                    open = false;
                }}
                on:keydown
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="close"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                            /></g
                        ></g
                    ></svg
                >
            </div>
            <a class="product-card-link" href={product.item.link}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13.922"
                    height="16.245"
                    viewBox="0 0 13.922 16.245"
                    ><path
                        d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                        fill="#fff"
                    /></svg
                >
            </a>
        </div>
    </div>
    <a href={product.item.link} class="product-title-small">{@html product.item.title}</a>
</div>
