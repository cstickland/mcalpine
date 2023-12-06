<script>
    export let url;
    export let imageUrl;
    export let imageAlt;
    export let title;
</script>

<li class="download-card-container">
    <a class="category-card" href={url}>
        <div class="category-card">
            <img class="category-card-image" src={imageUrl} alt={imageAlt} />
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
</li>

<style lang="scss">

    .download-card-container {
        background-color: var(--color-mcalpine-red);
    }
</style>
