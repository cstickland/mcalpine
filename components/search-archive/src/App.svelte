<script>
    export let searchTerm = "";

    import { onMount } from "svelte";
    import InsightCard from "./InsightCard.svelte";
    import ProductCard from "./ProductCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";
    import Hero from "./Hero.svelte";

    import { filters, divideItemsIntoPages, allItems } from "./stores.js";
    import {
        getQuery,
        getData,
        determineProductResults,
        getProductsLevenshtein,
        getOthersLevenshtein
    } from "./functions.js";

    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get("page")) || 1;
    let postsPerPage = 12;
    let categories = getCategories();
    let transition = false;

    onMount(async () => {
        allItems.set(allInsights)
        const query = getQuery(searchTerm)
        const data = await getData(query)
        const productResults = determineProductResults(data)
        const productsWithDistances = getProductsLevenshtein(productResults, searchTerm)
     
        const otherResults = [...data.data.pages.edges, ...data.data.posts.edges]
        const othersWithDistances = getOthersLevenshtein(otherResults, searchTerm)

        const allResults = [...productsWithDistances, ...othersWithDistances].sort((a, b) => a.distance - b.distance)
        allItems.set(allResults)
    });

    $: totalPages = insightsDividedIntoPages.length;
    $: insightsDividedIntoPages = divideItemsIntoPages(
        postsPerPage,
        allInsights,
        currentPage,
        $filters
    );
    $: currentPageInsights = insightsDividedIntoPages[currentPage - 1] || [];

    filters.subscribe((value) => {
        insightsDividedIntoPages = divideItemsIntoPages(
            postsPerPage,
            allItems,
            currentPage,
            value
        );
    });

    function getCategories() {
        const categories = new Set();

        allItems.forEach((insight) => {
            if (insight.postType == "post") {
                categories.add(insight.identifier);
            }
            if (insight.postType == "product") {
                categories.add(insight.categoryName);

                if (
                    insight?.subcategoryName &&
                    insight?.subcategoryName.length > 0
                ) {
                    insight.subcategoryName.forEach((name) => {
                        categories.add(name);
                    });
                }
            }
        });
        return categories;
    }
</script>

<Hero {searchTerm} />
<div class="insight-archive-filters-container">
    <Filters {categories} />
</div>
<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            {#if transition == false}
                {#each currentPageInsights as insight}
                    {#if insight.postType === "post" || insight.postType === "page"}
                        <InsightCard {insight} />
                    {:else if insight.postType == "product"}
                        <ProductCard product={insight} />
                    {/if}
                {/each}
            {/if}
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:currentPage bind:transition {totalPages} />
        {/if}
    </div>
</section>
