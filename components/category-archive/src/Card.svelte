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
            </div>
        </div>
    </a>
    <a class="category-card-link-small" href={url}>
        {title}
    </a>
</li>
