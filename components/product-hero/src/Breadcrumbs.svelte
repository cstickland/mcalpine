<script>
    import { product } from "./stores.js";
</script>

<ol
    itemscope
    itemtype="https://schema.org/BreadcrumbList"
    class="hero-breadcrumbs"
>
    <li
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
    >
        <a
            href="/products"
            itemscope
            itemtype="https://schema.org/WebPage"
            itemprop="item"
            itemid={$product.parentLink}
            ><span itemprop="name">Products</span></a
        >
        <span class="breadcrumb-arrow">
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
        <meta itemprop="position" content='1' />
    </li>
    {#if $product.parentCategory && $product.parentLink}
        <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
        >
            <a
                href={$product.parentLink}
                itemscope
                itemtype="https://schema.org/WebPage"
                itemprop="item"
                itemid={$product.parentLink}
                ><span itemprop="name">{@html $product.parentCategory}</span></a
            >

            <span class="breadcrumb-arrow">
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
            <meta itemprop="position" content="2" />
        </li>
    {/if}
    {#if $product.childCategory && $product.childLink}
        <li
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
        >
            <a
                class="breadcrumb-middle-link"
                href={$product.childLink}
                itemscope
                itemtype="https://schema.org/WebPage"
                itemprop="item"
                itemid={$product.childLink}
                ><span itemprop="name">{@html $product.childCategory}</span></a
            >
            <meta itemprop="position" content="3" />

            <span class="breadcrumb-arrow">
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
        </li>
    {/if}
    <div class="breadcrumbs-current">{@html $product.title}</div>
</ol>
