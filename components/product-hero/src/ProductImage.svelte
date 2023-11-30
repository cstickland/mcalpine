<script>
    import { product, activeSku, display } from "./stores.js";
    import { fade } from "svelte/transition";
</script>

<div class="product-hero-image">
    <div class="hero-breadcrumbs">
        <a href="<?php echo get_site_url(); ?>">Home</a>
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13.922"
                height="16.245"
                viewBox="0 0 13.922 16.245"
            >
                <path
                    d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                />
            </svg>
        </span>

        <a class="breadcrumb-middle-link" href="/products">Products</a>
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13.922"
                height="16.245"
                viewBox="0 0 13.922 16.245"
            >
                <path
                    d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                />
            </svg>
        </span>
        <div class="breadcrumbs-current">{$product.title}</div>
    </div>
    {#if $product.skus && $product.skus.length > 0}
        <div class="active-sku">
            Viewing: {#if $display}<span transition:fade>{$product.skus[$activeSku].sku}</span>{/if}
        </div>
        {#if $display}
        <img
            transition:fade
            class="product-image active"
            src={$product.skus[$activeSku].product_images[0].product_image}
            alt=""
        />
        {/if}
    {/if}
    {#if $product.schematic_image}
        <div class="product-hero-schematic-image">
            {@html $product.schematic_image}
        </div>
    {/if}
    {#if $product?.skus}
        <div class="product-hero-control-images">
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
        </div>
    {/if}
</div>
