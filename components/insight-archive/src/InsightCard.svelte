<script>
    export let insight = [];
    import { fade, slide } from "svelte/transition";
    import { onMount } from 'svelte'
    let open = false;

    onMount(() => {
        if(insight.identifier.toLowerCase() == 'faq') {
            insight.permalink = `/faq/?id=${insight.id}`
        }
    })
</script>

<a href={insight.permalink ? insight.permalink : ""} class="insight-card mobile-show col-{insight.columnWidth}" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="insight-card-text">
        <h6 class="insight-identifier">{@html insight.identifier}</h6>
        <h3 class="insight-card-title">{@html insight.title}</h3>
    </div>
    <div class="insight-card-image-container">
        {#if insight.img && insight.img.length > 0}
        <img
            class="insight-card-background-image"
            src={insight.img}
            alt={insight.alt ? insight.alt : ""}
        />
        {/if}
        <div class="insight-card-hover-gradient" />
    </div>
</a>
