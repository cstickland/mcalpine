<script>
    export let productDetails = {};
    export let backgroundColor = "";

    import DownloadLink from "./DownloadLink.svelte";
    import { product, activeSku } from "./stores.js";
    import { onMount } from "svelte";

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


    document.addEventListener("activeSku", (event) => {
        activeSku.set(event.activeSku);
    });

    const event = new Event("activeSku", { detail: "hiya" });
    event.activeSku = 1;
</script>

<div class="product-download-block-desktop suitability-block animate {backgroundColor}">
    <div class="suitability-content-container">
        <div class="grid-title-container">
            <h2 class="grid-title">Downloads</h2>
        </div>
        <ul class="grid-block-grid">
            {#if productDetails.skus[$activeSku].product_technical_drawing}
                <DownloadLink
                    title="Technical Drawing"
                    fileUrl={productDetails.skus[$activeSku]
                        .product_technical_drawing}
                />
            {/if}
            {#if productDetails.skus[$activeSku].product_installation_instructions}
                <DownloadLink
                    title="Installation Instructions"
                    fileUrl={productDetails.skus[$activeSku]
                        .product_installation_instructions}
                />
            {/if}

            {#if productDetails?.skus[$activeSku].downloads.length}
                {#each productDetails?.skus[$activeSku]?.downloads as download}
                    <DownloadLink
                        title={download.download_title}
                        fileUrl={download.download_file}
                    />
                {/each}
            {/if}
        </ul>
    </div>
</div>
<div class="product-download-block animate accordion {backgroundColor}">
    <div class=" accordion-question-container">
        <h2 class="grid-title">Downloads</h2>
        <div class="accordion-toggle-icon">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
        </div>
    </div>
    <div class="accordion-answer">
        <div class="suitability-content-container answer">
            <ul class="grid-block-grid">
                {#if productDetails.skus[$activeSku].product_technical_drawing}
                    <DownloadLink
                        title="Technical Drawing"
                        fileUrl={productDetails.skus[$activeSku]
                            .product_technical_drawing}
                    />
                {/if}
                {#if productDetails.skus[$activeSku].product_installation_instructions}
                    <DownloadLink
                        title="Installation Instructions"
                        fileUrl={productDetails.skus[$activeSku]
                            .product_installation_instructions}
                    />
                {/if}

                {#if productDetails?.skus[$activeSku].downloads.length}
                    {#each productDetails?.skus[$activeSku]?.downloads as download}
                        <DownloadLink
                            title={download.download_title}
                            fileUrl={download.download_file}
                        />
                    {/each}
                {/if}
            </ul>
        </div>
    </div>
</div>
