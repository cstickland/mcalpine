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


        $productCategories = getData(graphQlUrl, query, productCategories);
  

    export let allProductsLink = "";

    let innerHeight;
</script>

<svelte:window bind:innerHeight />

{#await $productCategories}
   <div> 
        <div class="product-text">Products</div>
   </div> 
{:then categories} 
 <div
    on:mouseenter={() => {
        open.set(true);
    }}
    use:clickOutside
    on:click_outside={() => {
        open.set(false);
    }}

    on:mouseleave={() => {
        open.set(false);
    }}
>
    <div class="product-text">Products</div>
    <Content {allProductsLink} />
</div>
   
{/await}

<style lang="scss">
    .product-text {
        cursor: pointer;
    }

   
</style>
