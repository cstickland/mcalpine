<script>
    export let productDetails = {};
    import { product, activeSku, display } from './stores.js'
    import { onMount } from 'svelte'
    import ProductDetails from './ProductDetails.svelte';
    import ProductImage from './ProductImage.svelte';

    onMount(() => {
        product.set(productDetails)
        console.log($product.skus)
    })

    activeSku.subscribe((value) => {
        display.set(false)
        setTimeout(() => {
            display.set(true)
        },300)
    })
</script>

<div class="product-hero-container">
   <ProductImage />
    <ProductDetails />
</div>
