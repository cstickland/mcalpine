<script>
    export let allProducts = [];
    export let childCategories = [];
    export let parentCategories = [];
    export let showFilters = true;

    import ProductCard from "./ProductCard.svelte";
    import Pagination from "./Pagination.svelte";
    import CardsPerPage from "./CardsPerPage.svelte";
    import GridToggleButtons from "./GridToggleButtons.svelte";
    import Filters from "./Filters.svelte";

    let currentPage = 1;
    let postsPerPage;
    let parentFilters = [];
    let childFilters = [];
    let allProductsList;
    let gridStyle = true;
    let openFilters = false;
    let filtersClass;

    if(showFilters) {
        filtersClass = ""
    } else {
        filtersClass = "hide-filters"
    }

    $: totalProducts = allProductsList.length;
    $: totalPages = Math.ceil(totalProducts / postsPerPage);
    $: postRangeHigh = currentPage * postsPerPage;
    $: postRangeLow = postRangeHigh - postsPerPage;
    function resetFilters() {
        parentFilters = [];
        childFilters = [];
    }

    $: if (childFilters.length == 0 && parentFilters.length == 0) {
         allProductsList = [...allProducts];
    }

    $: if (childFilters.length > 0) {
        allProductsList = allProducts.filter(function (product) {
            return childFilters.indexOf(product.subcategoryId) !== -1;
        });
    }

    $: if(parentFilters.length > 0 && childFilters.length == 0)  {
         allProductsList = allProducts.filter(function (product) {
            return parentFilters.indexOf(product.categoryId) !== -1;
        });
    }
    

</script>

<section class="product-archive {filtersClass}">
    {#if showFilters}
    <button on:click={() => {openFilters = !openFilters}} class="filters-heading">
        <div class="filters-icon">
            <div class="filter-line line-one">
                <div class="filter-line-black"></div>
                <div class="filter-line-red"></div>
            </div>
            <div class="filter-line line-two">
                <div class="filter-line-black"></div>
                <div class="filter-line-red"></div>
            </div>
            <div class="filter-line line-three">
                <div class="filter-line-black"></div>
                <div class="filter-line-red"></div>
            </div>
        </div>
        Filters
    </button>
    {#if openFilters}
    <Filters
        bind:childCategories
        bind:parentCategories
        bind:parentFilters
        bind:childFilters
        bind:currentPage
    />
    {/if}{/if}
    <div class="archive-controls">
        {#if parentFilters.length > 0 || childFilters.length > 0}
            <div class="product-archive-total-results">
                {totalProducts} Results matching your selection.
                <button on:click={resetFilters}>x</button>
            </div>
        {/if}
        <CardsPerPage bind:postsPerPage />
        <GridToggleButtons bind:gridStyle />
    </div>
    <div class="product-archive-grid-container">
    <ul class={gridStyle ? 'product-archive-grid columns' : 'product-archive-grid rows'}>
        {#each allProductsList as product, i}
            {#if i >= postRangeLow && i < postRangeHigh}
                <ProductCard {product} />
            {/if}
        {/each}
    </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:currentPage {totalPages} />
        {/if}
    </div>
</section>
