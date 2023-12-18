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

<div class="insight-card mobile-show col-{insight.columnWidth}" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="insight-card-text">
        <h6 class="insight-identifier">{@html insight.identifier}</h6>
        <h3 class="insight-card-title">{@html insight.title}</h3>
    </div>
    <div class="insight-card-image-container">
        <img
            class="insight-card-background-image"
            src={insight.img}
            alt={insight.alt ? insight.alt : ""}
        />
        <div class="insight-card-hover-gradient" />
    </div>

    <div class="insight-card-link">
        <a href={insight.permalink ? insight.permalink : ""}
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
