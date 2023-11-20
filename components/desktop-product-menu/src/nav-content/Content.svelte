<script>
    import ProductMenu from "./menu/ProductMenu.svelte";
    import { open } from "../stores.js";
    import { slide } from "svelte/transition";

    export let allProductsLink = "";
    export const menus = {};
</script>

{#if $open}
<div class="nav-hover-padding-container">
    <div
        class="nav-content-container"
        in:slide={{ axis: "y", duration: 300 }}
        out:slide={{ axis: "y", duration: 200 }}
    >
        <ProductMenu />

        <a class="all-products-link" href={allProductsLink}
            >View All Products
            <div class="all-products-link-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-right"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(-90 12 12)"
                                opacity="0"
                            /><path
                                d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"
                            /></g
                        ></g
                    ></svg
                >
            </div></a
        >
    </div>
</div>
{/if}

<style lang="scss">
    @import "../../../../sass/abstracts/variables/_colors.scss";
.nav-hover-padding-container {
    padding-top: 31px;
    position: absolute;
    top: 48px;
    left: 0;
    width: 100%;

}
    .nav-content-container {
        padding: 75px 0;
       
        width: 100%;
        background-color: #ffffff;
        width: 100%;
        flex-grow: 1;
        max-height: 100%;
        overflow: hidden;
        padding-bottom: 0;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0px 25px 25px #00000014;
    }

    .all-products-link {
        text-decoration: none;
        color: #222222;
        font-size: 1.125rem;
        line-height: 1.5rem;
        margin-left: auto;
        display: flex;
        gap: 1.25rem;
        display: flex;
        align-items: center;
        margin-top: 50px;
        .all-products-link-arrow {
            background-color: $color__mcalpine-red;
            height: 3.5rem;
            width: 3.5rem;
            display: flex;
            align-items: center;
            justify-content: center;

            svg {
                height: 2.5rem;
                rect,
                path {
                    fill: #ffffff;
                }
            }
        }
    }
</style>
