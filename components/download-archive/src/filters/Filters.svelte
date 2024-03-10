<script>
    import FiltersSection from "./FilterSection.svelte";
    import { searchTerm, allActiveFilters, filteredQuery, } from "../filters.js";
    import {allItems, hasNextPage, endCursor, getData, parseDownloads, isLoading} from "../stores.js";
    import { slide } from "svelte/transition";

    export let categories;
    // export let fileTypes;
    export let downloadTypes;

    allActiveFilters.subscribe(async (values) => {
        isLoading.set(true)
        let downloadTypes = []
        let downloadCategories = [] 
        values.forEach((value) => {
            if(value.taxonomyName === 'download_types') {
                downloadTypes.push(value.slug)
            }
            if(value.taxonomyName === 'download_categories') {
                downloadCategories.push(value.slug)
            }
        })
        const query = filteredQuery($searchTerm, downloadCategories, downloadTypes, "TITLE", "ASC", "")
        const response = await getData(query)

        allItems.set([...parseDownloads(response?.data?.downloads?.edges)])
        hasNextPage.set(response?.data.downloads.pageInfo.hasNextPage)
        endCursor.set(response?.data.downloads.pageInfo.endCursor)
        isLoading.set(false)
    })

    searchTerm.subscribe(async (value) => {
         isLoading.set(true)
        let downloadTypes = []
        let downloadCategories = [] 
        $allActiveFilters.forEach((value) => {
            if(value.taxonomyName === 'download_types') {
                downloadTypes.push(value.slug)
            }
            if(value.taxonomyName === 'download_categories') {
                downloadCategories.push(value.slug)
            }
        })
        const query = filteredQuery(value, downloadCategories, downloadTypes, "TITLE", "ASC", "")
        const response = await getData(query)

        allItems.set([...parseDownloads(response?.data?.downloads?.edges)])
        hasNextPage.set(response?.data.downloads.pageInfo.hasNextPage)
        endCursor.set(response?.data.downloads.pageInfo.endCursor)
        isLoading.set(false)
    })

  </script>

<div class="filters" in:slide>
    <input
        type="text"
        on:input={(e) => {
            searchTerm.set(e.target.value);
        }}
        placeholder="Type SKU or filename"
    />
    <FiltersSection
        title="Download Type"
        items={downloadTypes}
        filters={allActiveFilters}
    />
    <FiltersSection
        title="Categories"
        items={categories}
        filters={allActiveFilters}
    />

</div>

<style lang="scss">
    @import "../colors.scss";
    .filters {
        grid-area: filters-open;
    }

    input {
        width: 100%;
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-radius: 0;
        padding: 0;
        padding-bottom: 1rem;
        padding-left: 2.5rem;
        border-bottom: solid 1px $color__mcalpine-grey-5;

        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg data-name='Layer 2'%3E%3Cg data-name='search'%3E%3Crect width='24' height='24' opacity='0' fill='%23e63128'/%3E%3Cpath fill='%23222222' d='M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
        background-repeat: no-repeat;
        background-position: left 5%;
        background-size: auto 60%;
        &:hover,
        &:focus {
            border-top: 0;
            border-left: 0;
            border-right: 0;
            box-shadow: none;
            border-bottom: solid 1px $color__mcalpine-grey-5;
        }

        &::placeholder {
        color: $color__mcalpine-grey-2;
        }
    }
</style>
