<script>
    import Content from "./nav-content/Content.svelte";

    export let productCategories = {};


    export let allProductsLink = "";

    let innerHeight;
    let open = false;
    let activeMenu = 0;

    export function clickOutside(node) {
        const handleClick = (event) => {
            if (
                node &&
                !node.contains(event.target) &&
                !event.defaultPrevented
            ) {
                node.dispatchEvent(new CustomEvent("click_outside", node));
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            },
        };
    }
</script>

<svelte:window bind:innerHeight />

<div
    on:mouseenter={() => {
        open = true;
    }}
    use:clickOutside
    on:click_outside={() => {
        open = false;
    }}
    on:mouseleave={() => {
        open = false;
    }}
>
    <div class="product-text">Products</div>
    {#if open}
        <Content {productCategories} {allProductsLink} bind:activeMenu  />
    {/if}
</div>

<style lang="scss">
    .product-text {
        cursor: pointer;
    }
</style>
