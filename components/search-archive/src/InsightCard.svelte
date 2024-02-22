<script>
    export let insight = [];
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    let identifier = "";

    onMount(() => {
        if (insight.item.postType == "post") {
            insight.item.node.terms.nodes.forEach((term) => {
                if (term.name.toLowerCase() == "faq") {
                    insight.item.node.link = `/faq/?id=${insight.item.node.postId}`;
                    identifier = term.name;
                }
            });
            if (identifier == "") {
                identifier = insight?.item?.node?.terms?.nodes[0]?.name || "";
            }
        }
    });
</script>

<div
    class="insight-card mobile-show col-{insight.columnWidth}"
    >
    <div class="insight-card-text">
        {#if insight.item.postType == "page"}
            <h6 class="insight-identifier">Page</h6>
        {/if}
        {#if insight.item.postType == "post"}
            <h6 class="insight-identifier">{identifier}</h6>
        {/if}
        <h3 class="insight-card-title">{@html insight.item.node.title}</h3>
    </div>
    <div class="insight-card-image-container">
        
        <img
            class="insight-card-background-image"
            src={insight?.item?.node?.featuredImage?.node?.sourceUrl
                ? insight?.item?.node?.featuredImage?.node?.sourceUrl
                : ""}
            alt={insight?.item?.node?.featuredImage?.node?.altText
                ? insight?.item?.node?.featuredImage?.node?.altText
                : ""}
        />
        <div class="insight-card-hover-gradient" />
    </div>

    <div class="insight-card-link">
        <a href={insight.item.node.link ? insight.item.node.link : ""}
            ><span>View Resource</span>
            <div class="insight-link-arrow">
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
            </div></a
        >
    </div>
</div>
