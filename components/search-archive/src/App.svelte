<script>
    export let searchTerm = "";

    import { onMount } from "svelte";
    import InsightCard from "./InsightCard.svelte";
    import ProductCard from "./ProductCard.svelte";
    import PLaceholderCard from "./PlaceholderCard.svelte";
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
    import PlaceholderCard from "./PlaceholderCard.svelte";

        let postsPerPage = 12;
    let categories;
    let totalResults = '';
    let firstLoad = true;

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
        allItems.set(allResults);
        totalResults = $allItems.length;
        categories = getCategories();
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
        totalPages = insightsDividedIntoPages.length;

    });
    filters.subscribe((value) => {
        insightsDividedIntoPages = divideItemsIntoPages(
            postsPerPage,
            $allItems,
            $currentPage,
            value
        );
        if(!firstLoad) {
        currentPage.set(1)
            firstLoad = false;
        }
        totalPages = insightsDividedIntoPages.length;
    });


    function getCategories() {
        let categories = new Set();

        $allItems.forEach((insight) => {
            if (insight.item.postType == "post") {
                insight.item.node.terms.nodes.forEach((term) => {
                categories.add(term.name);
                })
            }
            if (insight.postType == "product") {
                insight.item.terms.nodes.forEach((term) => {
                    categories.add(term.name)
                })
            }
        });
        const sortedCategories = new Set(Array.from(categories).sort())
        return sortedCategories;
    }
</script>

<Hero {searchTerm} {totalResults} />
<div class="insight-archive-filters-container">
    <Filters {categories} />
</div>
<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            <!-- {#if transition == false && insightsDividedIntoPages && insightsDividedIntoPages.length} -->
            <!--     {#each insightsDividedIntoPages[$currentPage - 1] as insight} -->
            <!--         {#if insight.postType === "other"} -->
            <!--             <InsightCard {insight} /> -->
            <!--         {:else if insight.postType == "product"} -->
            <!--             <ProductCard product={insight} /> -->
            <!--         {/if} -->
            <!--     {/each} -->
            <!-- {:else} -->
                {#each Array(12) as _}
                  <PlaceholderCard />
                {/each}
            <!-- {/if} -->
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination {totalPages} />
        {/if}
    </div>
</section>
