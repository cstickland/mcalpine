<script>
    import { product, activeSku } from './stores.js'

</script>

<div class="product-skus-container">
    {#if  $product?.skus && $product?.skus.length > 0}
        <ul>
            {#each $product.skus as productSku, i}
                {#if i == 0}
                    <div class="sku-headers">
                        <div class="title">Sku</div>
                        <div class="attribute-title">{productSku.product_config_label}</div>
                    </div>
                {/if}
                <li on:click={() => {
                    activeSku.set(i);
                }} on:keydown class={i == $activeSku ? 'active' : ""}>
                    {#each productSku.product_images as image, i}
                        {#if i == 0}
                            <div class="sku-image-container">
                                <img src={image.product_image} alt={productSku.sku} />
                            </div>
                        {/if}
                    {/each}
                    <div class="sku-text">{productSku.sku}</div>
                    <div>{productSku.product_config_attribute}</div>
                </li>
            {/each}
        </ul>
    {/if}
</div>
