<script>
    import Card from "./Card.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";

    import {
        getData,
        divideItemsIntoPages,
        itemsDividedIntoPages,
        query,
        allItems,
        filters,
        currentPage,
    } from "./stores.js";
    import { onMount } from "svelte";

    export let postsPerPage;

    let transition = false;
    export let showFilters = true;
    let categories = new Set();

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
                message: download?.node?.downloadFields?.fileMessage,
                date: date,
                fileType: download?.node?.downloadFields?.fileType,
                categories: download?.node?.downloadCategories?.nodes,
            };
            items.push(downloadObject);
        });
        allItems.set(items);
        $allItems.forEach((item) => {
            item.categories.forEach((category) => {
                categories.add(category.name);
            });
        });
    });

    allItems.subscribe((value) => {
        itemsDividedIntoPages.set(divideItemsIntoPages(
            postsPerPage,
            value,
            currentPage,
            $filters
        ));
    });

    filters.subscribe((value) => {
        itemsDividedIntoPages.set(divideItemsIntoPages(
            postsPerPage,
            $allItems,
            currentPage,
            value
        ));
    });

    $: totalPages = $itemsDividedIntoPages.length;
    let currentPageItems;

    itemsDividedIntoPages.subscribe((value) => {
        currentPageItems = value[$currentPage - 1]
    })

    currentPage.subscribe((value) => {
        currentPageItems = $itemsDividedIntoPages[value - 1] || [];
    });
</script>

<div class="insight-archive-filters-container">
    {#if showFilters && [...categories].length}
        <Filters {categories}  />
    {/if}
</div>
<section class="download-archive">
    <div class="download-archive-grid-container">
        <ul class="download-archive-grid mobile-two-column">
            {#if transition == false}
                {#each currentPageItems as item}
                    <Card {...item} />
                {/each}
            {/if}
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination  bind:transition {totalPages} />
        {/if}
    </div>
</section>

<style lang="scss">
    @import "./colors.scss";

    .download-archive-grid-container {
        @include container-large;
        container-type: inline-size;
        container-name: download-grid;
    }
    .download-archive-grid {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        grid-template-columns: 1fr;
    }

    @supports (container-type: inline-size) {
        @container download-grid (min-width: 650px) {
            .download-archive-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        @container download-grid (min-width: 1000px) {
            .download-archive-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        @container download-grid (min-width: 1400px) {
            .download-archive-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }
</style>
