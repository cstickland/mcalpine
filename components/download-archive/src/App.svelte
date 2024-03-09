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
        setUp,
    } from "./stores.js";
    import {
        allCategories,
        allFileTypes,
        allDownloadTypes,
        filteredItems,
        filterItems,
        allActiveFilters,
        searchTerm
    } from "./filters.js";

    export let postsPerPage;

    let filtersOpen = false;

    onMount(async () => {
        let tempFileTypes = new Set()
        let tempDownloadTypes = new Set()
        let tempCategories = new Set()

        allItems.set(await setUp());
        $allItems.forEach((item) => {
            item.categories.forEach((category) => {
                tempCategories.add(JSON.stringify({
                    name: category.name,
                    id: category.id,
                    filterType: "category",
                }));
            });
            item.downloadTypes.forEach((downloadType) => {
                tempDownloadTypes.add(JSON.stringify({
                    name: downloadType.name,
                    id: downloadType.id,
                    filterType: "downloadType",
                }));
            });
            tempFileTypes.add(JSON.stringify({
                name: item.fileUrl
                    .split(/[#?]/)[0]
                    .split(".")
                    .pop()
                    .trim()
                    .toUpperCase() || '',
                id: item.fileUrl.split(/[#?]/)[0].split(".").pop().trim(),
                filterType: "fileType",
            }));
        });
        allCategories.set(new Set([...tempCategories].map((s) => { return JSON.parse(s)})))
        allDownloadTypes.set(new Set([...tempDownloadTypes].map((s) => { return JSON.parse(s)})))
        allFileTypes.set(new Set([...tempFileTypes].map((s) => { return JSON.parse(s)})))
    });

    allItems.subscribe((value) => {
        if($allActiveFilters.size === 0 && $searchTerm === '') {
            filteredItems.set(value)
            return
        }
        filteredItems.set(filterItems($allActiveFilters, value, $searchTerm))
    })

    allActiveFilters.subscribe((value) => {
        if(value.size === 0) {
            filteredItems.set($allItems)
            return
        }
        filteredItems.set(filterItems(value, $allItems, $searchTerm))
    })

    searchTerm.subscribe((value) => {
        if(value.size === '' && $allActiveFilters.size === 0) {
            filteredItems.set($allItems)
            return
        }
        filteredItems.set(filterItems($allActiveFilters, $allItems, value))
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
    <div class="pagination-container">
        <LoadMore />
    </div>
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
