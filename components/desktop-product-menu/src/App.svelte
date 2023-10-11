<script>
    import Content from "./nav-content/Content.svelte";
    import { onMount } from "svelte";
    import {
        open,
        getData,
        query,
        productCategories,
        clickOutside,
    } from "./stores.js";
    export let siteUrl = "";
    const graphQlUrl = `${siteUrl}/graphql`;

    onMount(async () => {
        await getData(graphQlUrl, query, productCategories);
    });

    export let allProductsLink = "";

    let innerHeight;
</script>

<svelte:window bind:innerHeight />

<div
    on:mouseenter={() => {
        open.set(true);
    }}
    use:clickOutside
    on:click_outside={() => {
        open.set(false);
    }}
>
    <div class="product-text">Product</div>
    <Content {allProductsLink} />
</div>

<style lang="scss">
    .product-text {
        cursor: pointer;
    }
</style>
