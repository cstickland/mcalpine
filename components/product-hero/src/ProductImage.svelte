<script>
    import { product, activeSku, display } from "./stores.js";
    import { scale, slide } from "svelte/transition";
    import {  quadInOut } from 'svelte/easing'
    import ControlImages from './ControlImages.svelte'
    let shareOpen = false;
</script>

<div class="product-hero-image">
    <div class="hero-breadcrumbs">
        <a href="/">Home</a>
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
        <div class="breadcrumbs-current">{@html $product.title}</div>
    </div>
    {#if $product.skus && $product.skus.length > 0}
        <div class="active-sku">
            Viewing: {#if $display}<span
                    transition:scale={{start: 0.9, opacity: 0, duration: 300, easing: quadInOut }}
                    >{$product.skus[$activeSku].sku}</span
                >{/if}
        </div>
        <div class="product-image-div active">
        {#each $product.skus as productSku, i}
            {#if i == $activeSku && $display}
                <img
                    transition:scale={{start: 0.9, opacity: 0, duration: 300, easing: quadInOut }}
                    class="product-image active"
                    src={productSku.product_images[0].product_image}
                    alt=""
                />
            {/if}
        {/each}
        </div>
    {/if}
    {#if $product.schematic_image}
        <div class="product-hero-schematic-image">
            {@html $product.schematic_image}
        </div>
    {/if}
    {#if $product?.skus && $product?.skus.length > 1}
        <ControlImages />
    {/if}
    <div class="product-share {shareOpen ? 'active' : ''}">
        <div
            class="product-share-icon"
            on:click={() => {
                shareOpen = !shareOpen;
            }}
            on:keydown
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="share"
                        ><rect width="24" height="24" opacity="0" /><path
                            d="M18 15a3 3 0 0 0-2.1.86L8 12.34V12v-.33l7.9-3.53A3 3 0 1 0 15 6v.34L7.1 9.86a3 3 0 1 0 0 4.28l7.9 3.53V18a3 3 0 1 0 3-3z"
                        /></g
                    ></g
                ></svg
            >
        </div>
        {#if shareOpen}
            <div class="product-share-links" transition:slide={{ axis: "x" }}>
                <a
                    href={`https://www.facebook.com/share.php?u=${encodeURI(
                        window.location.href
                    )}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 15.531 25.423"
                    >
                        <path
                            d="M21.531,3.708A.706.706,0,0,0,20.825,3H17.3a6.735,6.735,0,0,0-7.06,6.354v3.812H6.706A.706.706,0,0,0,6,13.874v3.671a.706.706,0,0,0,.706.706h3.53v9.46a.706.706,0,0,0,.706.706h4.236a.706.706,0,0,0,.706-.706v-9.46h3.7a.706.706,0,0,0,.692-.522l1.017-3.671a.706.706,0,0,0-.678-.89h-4.73V9.356A1.412,1.412,0,0,1,17.3,8.085h3.53a.706.706,0,0,0,.706-.706Z"
                            transform="translate(-6 -2.994)"
                            fill="#fff"
                        />
                    </svg>
                </a>

                <a
                    href={`https://twitter.com/intent/tweet?&url=${encodeURI(
                        window.location.href
                    )}`}
                >
                    <svg
                        id="Layer_2"
                        data-name="Layer 2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1000.78 936.69"
                    >
                        <defs>
                            <style>
                                .cls-1 {
                                    fill: #fff;
                                    stroke-width: 0px;
                                }
                            </style>
                        </defs>
                        <g id="svg5">
                            <g id="layer1">
                                <path
                                    id="path1009"
                                    class="cls-1"
                                    d="m2.44,0l386.39,516.64L0,936.69h87.51l340.42-367.76,275.05,367.76h297.8l-408.13-545.7L954.57,0h-87.51l-313.51,338.7L300.24,0H2.44Zm128.69,64.46h136.81l604.13,807.76h-136.81L131.13,64.46Z"
                                />
                            </g>
                        </g>
                    </svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(window.location.href)}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34">
                        <g transform="translate(-0.281 -0.121)">
                            <rect
                                width="34"
                                height="34"
                                transform="translate(34.281 34.121) rotate(180)"
                                fill="#fff"
                                opacity="0"
                            />
                            <path
                                d="M17.56,8.4A8.231,8.231,0,0,0,9.3,16.617v8.3a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3a2.739,2.739,0,0,1,3.036-2.725,2.824,2.824,0,0,1,2.471,2.824v8.2a1.271,1.271,0,0,0,1.271,1.271h2.965a1.271,1.271,0,0,0,1.271-1.271v-8.3A8.231,8.231,0,0,0,17.56,8.4Z"
                                transform="translate(3.831 3.46)"
                                fill="#fff"
                            />
                            <rect
                                width="6.354"
                                height="16.519"
                                rx="0.9"
                                transform="translate(4.236 13.131)"
                                fill="#fff"
                            />
                            <circle
                                cx="3.177"
                                cy="3.177"
                                r="3.177"
                                transform="translate(4.236 4.236)"
                                fill="#fff"
                            />
                        </g>
                    </svg>
                </a>
                <a href="mailto:">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 29.999 24"
                    >
                        <path
                            d="M27.5,4H6.5A4.5,4.5,0,0,0,2,8.5v15A4.5,4.5,0,0,0,6.5,28h21A4.5,4.5,0,0,0,32,23.5V8.5A4.5,4.5,0,0,0,27.5,4Zm0,3-9.75,6.7a1.5,1.5,0,0,1-1.5,0L6.5,7Z"
                            transform="translate(-2 -4)"
                            fill="#fff"
                        />
                    </svg>
                </a>
                <div on:keydown on:click={() => {
                    navigator.clipboard.writeText(encodeURI(window.location.href))
                    alert('Added Url to Clipboard')
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        ><g data-name="Layer 2"
                            ><g data-name="link-2"
                                ><rect
                                    width="24"
                                    height="24"
                                    opacity="0"
                                /><path
                                    d="M13.29 9.29l-4 4a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4-4a1 1 0 0 0-1.42-1.42z"
                                /><path
                                    d="M12.28 17.4L11 18.67a4.2 4.2 0 0 1-5.58.4 4 4 0 0 1-.27-5.93l1.42-1.43a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-1.27 1.28a6.15 6.15 0 0 0-.67 8.07 6.06 6.06 0 0 0 9.07.6l1.42-1.42a1 1 0 0 0-1.42-1.42z"
                                /><path
                                    d="M19.66 3.22a6.18 6.18 0 0 0-8.13.68L10.45 5a1.09 1.09 0 0 0-.17 1.61 1 1 0 0 0 1.42 0L13 5.3a4.17 4.17 0 0 1 5.57-.4 4 4 0 0 1 .27 5.95l-1.42 1.43a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l1.42-1.42a6.06 6.06 0 0 0-.6-9.06z"
                                /></g
                            ></g
                        ></svg
                    >
                </div>
            </div>
        {/if}
    </div>
</div>
