<script>
    export let allProducts = [];
    export let childCategories = [];
    export let parentCategories = [];
    export let showFilters = true;

    import ProductCard from "./ProductCard.svelte";
    import LoadMore from "./LoadMore.svelte";
    import GridToggleButtons from "./GridToggleButtons.svelte";
    import Filters from "./Filters.svelte";
    import ActiveFilters from "./ActiveFilters.svelte";
    import { onMount } from "svelte";
    import {
        parentFilters,
        childFilters,
        currentPage,
        postsPerPage,
    } from "./stores.js";

    let allProductsList;
    let openFilters = false;
    let filtersClass;
    let filtersClosedClass;
    let innerWidth = window.innerWidth;

    let columns = 4;

    if (showFilters) {
        filtersClass = "";
    } else {
        filtersClass = "hide-filters";
    }

    $: if (openFilters) {
        filtersClosedClass = "filters-open";
    } else {
        filtersClosedClass = "filters-closed";
    }

    $: totalProducts = allProductsList.length;
    $: totalPages = Math.ceil(totalProducts / $postsPerPage);
    $: postRangeHigh = $currentPage * $postsPerPage;
    $: postRangeLow = postRangeHigh - $postsPerPage;

    function updateWidth() {
        if (innerWidth < 1024 && columns === 4) {
            columns = 3;
        }
        if (innerWidth > 1024 && columns === 3) {
            columns = 4;
        }
        if (innerWidth < 768 && columns > 2) {
            columns = 2;
        }

        if(innerWidth > 767 && columns === 1) {
            columns = 2;
        }
    }

    function resetFilters() {
        parentFilters.set(new Set());
        childFilters.set(new Set());
    }

    $: if ($childFilters.size == 0 && $parentFilters.size == 0) {
        allProductsList = [...allProducts];
    }

    $: if ($childFilters.size > 0) {
        allProductsList = allProducts.filter(function (product) {
            let productFound = false;

            product.subcategoryId.forEach((subCategory) => {
                if ($childFilters.has(subCategory)) {
                    productFound = true;
                }
            });
            return productFound;
        });
    }

    $: if ($parentFilters.size > 0 && $childFilters.size == 0) {
        allProductsList = allProducts.filter(function (product) {
            return $parentFilters.has(product.categoryId);
        });
    }
    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let currentPageTemp = parseInt(urlParams.get("page")) || 1;
        currentPage.set(currentPageTemp);
        updateWidth();
    });
</script>

<svelte:window bind:innerWidth on:resize={updateWidth} />

<section class="product-archive {filtersClass} {filtersClosedClass}">
    {#if showFilters}
        {#if parentCategories?.length || childCategories?.length}
            <div class="filters-heading">
                <button
                    on:click={() => {
                        openFilters = !openFilters;
                    }}
                    class="filters-heading-open"
                >
                    <div class="filters-icon">
                        <div class="filter-line line-one">
                            <div class="filter-line-black" />
                            <div class="filter-line-red" />
                        </div>
                        <div class="filter-line line-two">
                            <div class="filter-line-black" />
                            <div class="filter-line-red" />
                        </div>
                        <div class="filter-line line-three">
                            <div class="filter-line-black" />
                            <div class="filter-line-red" />
                        </div>
                    </div>
                    Filters
                </button>
                {#if $parentFilters.size > 0 || $childFilters.size > 0}
                    <div
                        class="clear-filters"
                        on:click={() => {
                            resetFilters();
                        }}
                        on:keydown
                    >
                        Clear selection
                    </div>
                {/if}
            </div>
            {#if openFilters}
                <Filters {childCategories} {parentCategories} />
            {/if}
        {/if}
    {/if}
    <div class="archive-controls">
        {#if $parentFilters.size > 0 || $childFilters.size > 0}
            <ActiveFilters />
        {:else}
            <div />
        {/if}
        <div class="archive-controls-button-container">
            <GridToggleButtons bind:columns />
        </div>
    </div>
    <div class="product-archive-grid-container">
        <ul class="product-archive-grid columns-{columns}">
            {#each allProductsList as product, i}
                {#if i < postRangeHigh}
                    <ProductCard {product} />
                {/if}
            {/each}
        </ul>
    </div>
    <div class="pagination-container">
        {#if $currentPage < totalPages}
            <LoadMore />
        {/if}
    </div>
</section>
