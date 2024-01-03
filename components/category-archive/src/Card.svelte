<script>
    export let url;
    export let imageUrl;
    export let imageAlt;
    export let title;
</script>

<li class="category-card-container">
    <a class="category-card" href={url}>
        <div class="category-card">
            {#if imageUrl && imageUrl.length > 0}
                <img class="category-card-image" src={imageUrl} alt={imageAlt} />
                {:else}
                <div></div>
            {/if}
            <div class="category-link-container">
                <h5>{title}</h5>
                <div class="product-category-link">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.922"
                        height="16.245"
                        viewBox="0 0 13.922 16.245"
                    >
                        <path
                            d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                            fill="#fff"
                        />
                    </svg>
                </div>
            </div>
        </div></a
    >
    <a class="category-card-link-small" href={url}>
        {title}
    </a>
</li>
