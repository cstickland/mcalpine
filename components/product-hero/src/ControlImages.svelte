<script>
    import { product, activeSku } from "./stores.js";
    import { slide } from 'svelte/transition'
    import { linear } from 'svelte/easing'
    let scrollPosition = 0;
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
            <div class="chevron-up" on:keydown on:click={() => {
                if(scrollPosition > 0) {
                    scrollPosition--;
                }
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-up"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z"

                            /></g
                        ></g
                    ></svg
                >
            </div>
            <div class="control-images">
            {#each $product?.skus as productSku, i}
                {#if i >= scrollPosition && i < scrollPosition + 7}
                <img
                out:slide={{axis: 'y', easing: linear, duration: 300}}

                in:slide={{ axis: 'y', easing: linear, duration: 300}}
                    on:click={() => {
                        activeSku.set(i);
                    }}
                    on:keydown
                    alt=""
                    class="product-image-thumbnail"
                    src={productSku.product_images[0].product_image}
                />
                {/if}
            {/each}
            </div>
            <div class="chevron-down"
            on:keydown
            on:click={() => {
                if(scrollPosition < $product.skus.length - 7) {
                    scrollPosition++;
                }
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-down"
                            ><rect width="24" height="24" opacity="0" /><path
                                d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                            /></g
                        ></g
                    ></svg
                >
            </div>
        {/if}
    {/if}
</div>
