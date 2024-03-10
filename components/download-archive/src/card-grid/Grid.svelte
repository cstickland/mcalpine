<script>
    import Card from "./Card.svelte";
    import { allItems, isLoading } from "../stores";
    import PlaceholderCard from "./PlaceholderCard.svelte";

    let items = [];

    allItems.subscribe((value) => {
        items = value;
        if(items.length > 0) {
            isLoading.set(false)
        }
    });
</script>

<div class="download-archive-grid-container">
    <ul class="download-archive-grid mobile-two-column">
        {#each items as item}
            <Card {...item} />
        {/each}
        {#if $isLoading}
            {#each Array(6) as _}
                <PlaceholderCard />
            {/each}
        {/if}
    </ul>
</div>

<style lang="scss">
    @import "../colors.scss";

    .download-archive-grid-container {
        container-type: inline-size;
        container-name: download-grid;
        grid-area: results;
        width: 100%;
    }
    .download-archive-grid {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        transition: grid-template-rows 1s;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    @supports (container-type: inline-size) {
        @container download-grid (min-width: 650px) {
            .download-archive-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        @container download-grid (min-width: 1000px) {
            .download-archive-grid {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }

        @container download-grid (min-width: 1400px) {
            .download-archive-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    }
</style>
