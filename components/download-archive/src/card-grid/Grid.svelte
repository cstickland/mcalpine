<script>
    import { postsPerPage, currentPage } from "../stores";
    import Card from "./Card.svelte";
    import { filteredItems, sortBy } from "../filters.js";

    let items = [...$filteredItems];

    filteredItems.subscribe((value) => {
        items = sortItems($sortBy, value)
    });

    sortBy.subscribe((value) => {
        items = sortItems(value, $filteredItems)
    });

    function sortItems(sortNumber, items) {
        if(sortNumber === 1) {
            return [...items].sort((a,b) => { return b.date - a.date })
        }
        if(sortNumber === 2) {
            return [...items].sort((a,b) => { return a.date - b.date })
        }
        if (sortNumber === 3) {
            return [...items].sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
        }
        if (sortNumber === 4) {
            return [...items].sort((a,b) => (a.title > b.title) ? -1 : ((b.title > a.title) ? 1 : 0))
        }
    }

</script>

<div class="download-archive-grid-container">
    <ul class="download-archive-grid mobile-two-column">
        {#each items as item, i}
            {#if i < $postsPerPage * $currentPage}
                <Card {...item} />
            {/if}
        {/each}
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
