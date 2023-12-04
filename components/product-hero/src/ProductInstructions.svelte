<script>
    import { activeSku, product } from "./stores.js";
    import { fade } from "svelte/transition";
    import DownloadSvg from "./DownloadSvg.svelte";
</script>

{#if $product?.skus && $product?.skus.length > 0}
    {#each $product.skus as productSku, i}
        {#if i == $activeSku }
            <div class="product-instructions-container" in:fade>
                {#if productSku.product_installation_instructions}
                <div class="installation-instructions">
                    <a
                        href={productSku.product_installation_instructions}
                        download
                        >Installation Instructions
                        <DownloadSvg />
                    </a>
                </div>
                {/if}
                {#if productSku.product_technical_drawing}
                <div class="technical-drawing">
                    <a
                        href={productSku.product_technical_drawing}
                        download
                        >Technical Drawing
                        <DownloadSvg />
                    </a>
                </div>
                {/if}
            </div>
        {/if}
    {/each}
{/if}
