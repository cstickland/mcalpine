<script>
    import { product, activeSku } from "./stores.js";
</script>

<div class="product-hero-control-images">
    {#if $product.skus && $product.skus.length <= 7}
        {#each $product?.skus as productSku, i}
            <img
                on:click={() => {
                    activeSku.set(i);
                }}
                on:keydown
                alt=""
                class="product-image-thumbnail"
                src={productSku.product_images[0].product_image}
            />
        {/each}
    {/if}
    {#if $product.skus && $product.skus.length > 7}
        {#if window.innerWidth < 1024}
            {#each $product?.skus as productSku, i}
                <img
                    on:click={() => {
                        activeSku.set(i);
                    }}
                    on:keydown
                    alt=""
                    class="product-image-thumbnail"
                    src={productSku.product_images[0].product_image}
                />
            {/each}
        {:else}
            {#each $product?.skus as productSku, i}
                <img
                    on:click={() => {
                        activeSku.set(i);
                    }}
                    on:keydown
                    alt=""
                    class="product-image-thumbnail"
                    src={productSku.product_images[0].product_image}
                />
            {/each}
        {/if}
    {/if}
</div>
