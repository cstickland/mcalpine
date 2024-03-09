<script>
    import { currentPage, postsPerPage } from "../stores.js";
    import { filteredItems } from "../filters.js";

    function loadMore() {
        currentPage.set($currentPage + 1);
    }
</script>

{#if $postsPerPage * $currentPage < $filteredItems.size}
    <button class="btn btn-black" aria-label="load more" on:click={loadMore}>
        Load More
    </button>
{/if}

<style>
    button {
        margin: 0 auto;
    }
</style>
