<script>
    export let productDetails = {};
    import { product, activeSku, display } from "./stores.js";
    import { onMount } from "svelte";
    import ProductDetails from "./ProductDetails.svelte";
    import ProductImage from "./ProductImage.svelte";

    onMount(() => {
        product.set(productDetails);

        const urlParams = new URLSearchParams(window.location.search);
        const skuActive = urlParams.get("sku");
        if ($product.skus && $product.skus.length) {
            $product.skus.forEach((productSku, i) => {
                if (productSku.sku == skuActive) {
                    activeSku.set(i);
                }
            });
        }
    });

    activeSku.subscribe((value) => {
        const event = new Event("activeSku");
        event.activeSku = value;
        document.dispatchEvent(event);

        display.set(false);
        setTimeout(() => {
            display.set(true);
        }, 300);
    });
</script>

<div class="product-hero-container">
    <ProductImage />
    <ProductDetails />
</div>
