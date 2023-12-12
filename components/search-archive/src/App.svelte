<script>
    export let allInsights = [];

    import { onMount } from "svelte";
    import InsightCard from "./InsightCard.svelte";
    import ProductCard from "./ProductCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";

    import { filters, divideItemsIntoPages, allItems } from "./stores.js";

    let currentPage = 1;
    let postsPerPage = 12;
    let categories = getCategories();
    let transition = false;

    onMount(() => {
        allItems.set(allInsights);
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
            allInsights,
            currentPage,
            value
        );
    });

    function getCategories() {
        const categories = new Set();

        allInsights.forEach((insight) => {
            if (insight.postType == "post") {
                categories.add(insight.identifier);
            }
            if(insight.postType == 'product') {
                categories.add(insight.categoryName);

                if(insight?.subcategoryName && insight?.subcategoryName.length > 0) {
                    insight.subcategoryName.forEach((name) => {
                        categories.add(name);
                    })
                }
            }
        });
        return categories;
    }
</script>

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
