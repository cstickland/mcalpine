<script>
    export let insight = [];
    import { fade } from "svelte/transition";
    let open = false;
    $: openClass = open ? "open" : "closed";
</script>

<div class="insight-card {openClass}" in:fade={{ duration: 300 }}>
    <div class="insight-card-text">
        <h6 class="insight-identifier">{insight.identifier}</h6>
        <h3 class="insight-card-title">{insight.title}</h3>
    </div>
    <div class="insight-card-image-container">
        <img
            class="insight-card-background-image"
            src={insight.img}
            alt={insight.alt ? insight.alt : ""}
        />
        <div class="insight-card-hover-gradient"></div>
    </div>

    <div class="insight-card-link">
        <a href={insight.permalink ? insight.permalink : ""}
            ><span>View Resource</span><div class="insight-link-arrow"> ></div></a
        >
    </div>
</div>

