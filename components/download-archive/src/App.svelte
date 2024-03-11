<script>
    import Filters from "./filters/Filters.svelte";
    import ActiveFilters from "./filters/ActiveFilters.svelte";
    import LoadMore from "./pagination/LoadMore.svelte";
    import FiltersToggle from "./filters/FiltersToggle.svelte";
    import Grid from "./card-grid/Grid.svelte";
    import Sort from "./filters/Sort.svelte";
    import { onMount } from "svelte";
    import {
        allItems,
        getData,
        parseDownloads,
        hasNextPage,
        endCursor,
        initialQuery,
    } from "./stores.js";
    import {
        allCategories,
        allFileTypes,
        allDownloadTypes,
        allActiveFilters,
        filteredQuery
    } from "./filters.js";

    export let postsPerPage;

    let filtersOpen = false;

    onMount(async () => {
        const response = await getData(initialQuery)
        allItems.set([...parseDownloads(response?.data?.downloads?.edges)])
        hasNextPage.set(response?.data.downloads.pageInfo.hasNextPage)
        endCursor.set(response?.data.downloads.pageInfo.endCursor)
        allDownloadTypes.set(response?.data.downloadTypes.nodes)
        allCategories.set(response?.data.downloadCategories.nodes)
    });

    allActiveFilters.subscribe(async (value) => {
        let downloadTypes = []
        let downloadCategories = []

        if(value.filters) {
        value.filters.forEach((value) => {
            if(value.taxonomyName === 'download_types') {
                downloadTypes.push(value.slug)
            }
            if(value.taxonomyName === 'download_categories') {
                downloadCategories.push(value.slug)
            }
        })
        }
        const query = filteredQuery(value.searchTerm, downloadCategories, downloadTypes, value.sort, value.order, $endCursor)
        const response = await getData(query)
        allItems.set([...parseDownloads(response?.data?.downloads?.edges)])
        hasNextPage.set(response?.data.downloads.pageInfo.hasNextPage)
        endCursor.set(response?.data.downloads.pageInfo.endCursor)
    })

</script>

<section class="download-archive {filtersOpen ? 'filters-open' : ''}">
    <FiltersToggle bind:filtersOpen />
    {#if filtersOpen}
        <Filters
            bind:categories={$allCategories}
            bind:fileTypes={$allFileTypes}
            bind:downloadTypes={$allDownloadTypes}
            {postsPerPage}
        />
    {/if}
    <ActiveFilters />
    <Sort />
    <Grid />
    {#if $hasNextPage}
        <div class="pagination-container">
            <LoadMore />
        </div>
    {/if}
</section>

<style lang="scss">
    @import "./colors.scss";

    .download-archive {
        @include container-large;
        padding-top: 0;
        width: 100%;
        display: grid;
        gap: 0.625rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas:
            "filters sort"
            "active active"
            "results results"
            "pagination pagination";

        &.filters-open {
            grid-template-areas:
                "filters sort" 
                "active active" 
                "filters-open filters-open" 
                "results results"
                "pagination pagination";
        }
    }

    @media only screen and (min-width: 1024px) {
        .download-archive {
        @include container-large;
        gap:2rem;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas:
            "filters active active sort"
            "results results results results"
            "pagination pagination pagination pagination";

        &.filters-open {
            grid-template-areas:
                "filters active active sort"
                "filters-open results results results"
                "pagination pagination pagination pagination";
        }
    }

    }
</style>
