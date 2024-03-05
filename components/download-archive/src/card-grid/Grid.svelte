<script>
    export let currentPageItems = [];
    
    import Card from "./Card.svelte";
</script>


<div class="download-archive-grid-container">
    <ul class="download-archive-grid mobile-two-column">
        {#each currentPageItems as item}
            <Card {...item} />
        {/each}
    </ul>
</div>

<style lang="scss">
    @import '../colors.scss';

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
        grid-template-columns: 1fr;
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

