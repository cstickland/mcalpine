<script>
    import { activeSku, product, display } from "./stores.js";
    import { fade } from 'svelte/transition'

</script>

<div class="product-details-container">
    <h1 class="h3 product-title">{@html $product.title}</h1>
    {#if $product?.skus && $product?.skus.length > 0}
    {#if $display}
    <div transition:fade>{@html $product?.skus[$activeSku]?.product_description}</div>
    <ul transition:fade>
        {#if $product?.skus[$activeSku]?.product_features}
        {#each $product?.skus[$activeSku]?.product_features as feature}
            <li>
                {@html feature.feature}
            </li>
        {/each}
        {/if}
    </ul>
    {/if}
    {/if}
    <a href="/where-to-buy" class="btn btn-black">WHERE TO BUY</a>
    <a href="https://www.reviews.io/company-reviews/store/mcalpine-plumbing" 
        class="btn btn-black btn-outline">LEAVE A REVIEW</a>
</div>
