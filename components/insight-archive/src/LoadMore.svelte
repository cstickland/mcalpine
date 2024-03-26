<script>
import { currentPage } from "./stores";
    let isLoadingButton = false;

    async function loadMore() {
        isLoadingButton = true;
        let items = [];
        currentPage.set($currentPage + 1);
        isLoadingButton = false
    }
</script>

<button class="btn btn-black" aria-label="load more" on:click={loadMore}>
    {!isLoadingButton ? "Load More" : "Loading..."}
</button>

<style>
    button {
        margin: 0 auto;
    }
</style>
