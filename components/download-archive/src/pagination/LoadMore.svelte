<script>
    import { postsPerPage, allItems, endCursor, hasNextPage, isLoading, getData, parseDownloads } from "../stores.js";
    import { filteredQuery, allActiveFilters } from '../filters.js'

    let isLoadingButton = false;

    async function loadMore() {
        isLoadingButton = true
        let downloadTypes = []
        let downloadCategories = [] 
        $allActiveFilters.filters.forEach((value) => {
            if(value.taxonomyName === 'download_types') {
                downloadTypes.push(value.slug)
            }
            if(value.taxonomyName === 'download_categories') {
                downloadCategories.push(value.slug)
            }
        })
        const query = filteredQuery($allActiveFilters.searchTerm, downloadCategories, downloadTypes, $allActiveFilters.sort, $allActiveFilters.order, $endCursor)
        const response = await getData(query)
        allItems.set([...$allItems, ...parseDownloads(response?.data?.downloads?.edges)])
        hasNextPage.set(response?.data.downloads.pageInfo.hasNextPage)
        endCursor.set(response?.data.downloads.pageInfo.endCursor)
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
