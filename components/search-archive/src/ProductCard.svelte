<script>
    export let product = [];
    let open = false;
    $: openClass = open ? "open" : "closed";
</script>

<div class="product-card-container">
    <a href={product.link} class="product-card {openClass}" >
        <div class="product-block-image">
            <div class="product-image-link" href={product.link}><img src={product?.customFields2?.skus[0]?.productImages[0]?.productImage?.mediaItemUrl} alt="" /></div>
            <div class="product-title">{@html product.title}</div>
            <div
                class="sku-count"
                on:click={() => {
                    open = true;
                }}
                on:keydown
            >
                <span class="sku-count-default">
                    {product.customFields2.skus.length}
                    {#if product.customFields2.skus.length == 1}
                        SKU{/if}{#if product.customFields2.skus.length > 1} SKUs{/if}
                </span>
                <span class="sku-count-small">SKUs</span>
            </div>
            <a class="product-card-link" href={product.link}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13.922"
                    height="16.245"
                    viewBox="0 0 13.922 16.245"
                    ><path
                        d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                        fill="#fff"
                    /></svg
                >
            </a>
        </div>
        <div class="sku-list-container">
            <div class="sku-list">
                {#each product.customFields2.skus as sku}
                    <span>
                        {sku.sku}
                    </span>
                {/each}
            </div>
            <div class="product-title">{@html product.title}</div>
            <div
                class="sku-close"
                on:click={() => {
                    open = false;
                }}
                on:keydown
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="close"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                            /></g
                        ></g
                    ></svg
                >
            </div>
            <a class="product-card-link" href={product.link}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13.922"
                    height="16.245"
                    viewBox="0 0 13.922 16.245"
                    ><path
                        d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                        fill="#fff"
                    /></svg
                >
            </a>
        </div>
    </a>
    <a href={product.link} class="product-title-small">{@html product.title}</a>
</div>
