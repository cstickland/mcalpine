<script>
    import Content from "./nav-content/Content.svelte";
    import { onMount } from "svelte";
    import {
        open,
        getData,
        query,
        productCategories,
    } from "./stores.js";

    export let siteUrl = "";
    const graphQlUrl = `${siteUrl}/graphql`;

    onMount(async () => {
        await getData(graphQlUrl,  query, productCategories);
    });

    export let allProductsLink = ''

    let innerHeight;
</script>

<svelte:window bind:innerHeight />

<div class="product-text" on:click={() => { open.set(!$open), console.log('click')}}>Product</div>
<Content {allProductsLink} />

<style lang="scss">
    .product-text {
        cursor: pointer;
    }
</style>
