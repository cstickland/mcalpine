<script>
    import Pagination from "./pagination/Pagination.svelte";
    import Filters from "./filters/Filters.svelte";
    import LoadMore from "./pagination/LoadMore.svelte";
    import FiltersToggle from "./filters/FiltersToggle.svelte";
    import Grid from "./card-grid/Grid.svelte";

    import {
        getData,
        divideItemsIntoPages,
        itemsDividedIntoPages,
        query,
        allItems,
        currentPage,
    } from "./stores.js";
    import { allCategories, allFileTypes, allDownloadTypes } from './filters.js'
    import { onMount } from "svelte";

    export let postsPerPage;
    export let paginationType = 2;

    let transition = false;
    let filtersOpen = false;

    onMount(async () => {
        let items = [];
        let data = await getData(query);
        const urlParams = new URLSearchParams(window.location.search);
        currentPage.set(parseInt(urlParams.get("pagination")) || 1);

        data.data.downloads.edges.forEach((download) => {
            let date = new Date(
                Date.parse(
                    download?.node?.downloadFields?.fileDownload?.dateGmt
                )
            );
            let downloadObject = {
                title: download.node.title,
                imageUrl: download?.node?.featuredImage?.node?.sourceUrl,
                imageAlt: download?.node?.featuredImage?.node?.altText,
                fileUrl:
                    download?.node?.downloadFields?.fileDownload?.mediaItemUrl,
                date: date,
                fileType: download?.node?.downloadFields?.fileDownload?.mediaItemUrl?.split(/[#?]/)[0].split('.').pop().trim(),
                categories: download?.node?.downloadCategories?.nodes,
                downloadType: download?.node?.downloadTypes?.nodes

            };
            items.push(downloadObject);
        });
        allItems.set(items);
        console.log($allItems) 
        $allItems.forEach((item) => {
            item.categories.forEach((category) => {
                $allCategories.add({name: category.name, id: category.id});
            });
            $allFileTypes.add({name: item.fileUrl.split(/[#?]/)[0].split('.').pop().trim().toUpperCase(), id: item.fileUrl.split(/[#?]/)[0].split('.').pop().trim()})
        });
        console.log($allFileTypes) 
    });

    allItems.subscribe((value) => {
        itemsDividedIntoPages.set(
            divideItemsIntoPages(postsPerPage, value, currentPage, new Set())
        );
    });

    $: totalPages = $itemsDividedIntoPages.length;
    let currentPageItems;

    itemsDividedIntoPages.subscribe((value) => {
        currentPageItems = value[$currentPage - 1];
    });

    currentPage.subscribe((value) => {
        if (paginationType === 1) {
            currentPageItems = $itemsDividedIntoPages[value - 1] || [];
        }
        if (paginationType === 2) {
            let itemsToDisplay = [];
            for (let i = 0; i < value && i < totalPages; i++) {
                itemsToDisplay.push(...$itemsDividedIntoPages[i]);
            }
            currentPageItems = itemsToDisplay;
        }
    });
</script>

<section class="download-archive {filtersOpen ? 'filters-open' : ''}">
    <FiltersToggle bind:filtersOpen />
    {#if filtersOpen}
        <Filters bind:categories={$allCategories} bind:fileTypes={$allFileTypes} {postsPerPage} />
    {/if}
    <Grid {currentPageItems} />
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:transition {totalPages} />
        {/if}
        <LoadMore />
    </div>
</section>

<style lang="scss">
    @import "./colors.scss";

    .download-archive {
        @include container-large;
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
</style>
