<script>
    export let insight = [];
    import { fade } from "svelte/transition";
    import { onMount } from 'svelte'
    let open = false;
</script>

<a href={insight.link ? insight.link : ""} class="insight-card mobile-show col-{insight.columnWidth}" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="insight-card-text">
        {#if insight.contentTypeName === 'faq'}
            <h6 class="insight-identifier">FAQ</h6>
        {:else}
            <h6 class="insight-identifier">{insight.categories.nodes[0].name.toUpperCase()}</h6>
        {/if}
        <h3 class="insight-card-title">{@html insight.title}</h3>
    </div>
    <div class="insight-card-image-container">
        {#if insight?.featuredImage?.node?.sourceUrl}
        <img
            class="insight-card-background-image"
            src={insight.featuredImage.node.sourceUrl}
            alt={insight.featuredImage.node.altText}
        />
        {/if}
        <div class="insight-card-hover-gradient" />
    </div>
</a>
