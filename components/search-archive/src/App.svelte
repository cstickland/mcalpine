<script>
    export let searchTerm = "";

    import { onMount } from "svelte";
    import InsightCard from "./InsightCard.svelte";
    import ProductCard from "./ProductCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";
    import Hero from "./Hero.svelte";

    import { filters, divideItemsIntoPages, allItems, currentPage } from "./stores.js";
    import {
        getQuery,
        getData,
        determineProductResults,
        getProductsLevenshtein,
        getOthersLevenshtein,
    } from "./functions.js";

        let postsPerPage = 12;
    let categories = getCategories();
    let transition = false;
    let totalResults = "??";

    onMount(async () => {
        let productsWithDistances = [];
        const query = getQuery(searchTerm);
        const data = await getData(query);
        const productResults = determineProductResults(data);
        if (productResults && productResults.length > 0) {
            productsWithDistances = getProductsLevenshtein(
                productResults,
                searchTerm
            );
        }
        setPostType(data.data.pages.edges, "page");
        setPostType(data.data.posts.edges, "post");

        const otherResults = [
            ...data.data.pages.edges,
            ...data.data.posts.edges,
        ];
        const othersWithDistances = getOthersLevenshtein(
            otherResults,
            searchTerm
        );

        const allResults = [
            ...productsWithDistances,
            ...othersWithDistances,
        ].sort((a, b) => a.distance - b.distance);
        console.log(allResults);
        allItems.set(allResults);
        totalResults = $allItems.length;
    });

    function setPostType(items, type) {
        items.forEach((item) => {
            item.postType = type;
        });
    }

    let totalPages = 0;
    $: insightsDividedIntoPages = divideItemsIntoPages(
        postsPerPage,
        $allItems,
        $currentPage,
        $filters
    );

    allItems.subscribe((value) => {
        insightsDividedIntoPages = divideItemsIntoPages(
            postsPerPage,
            value,
            $currentPage,
            $filters
        );
        console.log(insightsDividedIntoPages)
        totalPages = insightsDividedIntoPages.length;

    });
    filters.subscribe((value) => {
        insightsDividedIntoPages = divideItemsIntoPages(
            postsPerPage,
            $allItems,
            $currentPage,
            value
        );

        totalPages = insightsDividedIntoPages.length;
    });


    function getCategories() {
        const categories = new Set();

        $allItems.forEach((insight) => {
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

<Hero {searchTerm} {totalResults} />
<div class="insight-archive-filters-container">
    <Filters {categories} />
</div>
<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            {#if transition == false && insightsDividedIntoPages && insightsDividedIntoPages.length}
                {#each insightsDividedIntoPages[$currentPage - 1] as insight}
                    {#if insight.postType === "other"}
                        <!-- <InsightCard {insight} /> -->
                    {:else if insight.postType == "product"}
                        <ProductCard product={insight} />
                    {/if}
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
