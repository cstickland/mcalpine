<script>
    import { currentPage } from "../stores.js";

    function loadMore() {
        currentPage.set($currentPage + 1);
    }
</script>

<button class="btn btn-black" aria-label="load more" on:click={loadMore}>
    Load More
</button>

<style>
    button {
        margin: 0 auto;
    }
</style>
