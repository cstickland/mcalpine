<script>
    export let allInsights = [];

    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";

    let currentPage = 1;
    let postsPerPage = 16;
    let insightsDividedIntoPages = divideInsightsIntoPages();
    let filters = [];
    let categories = getCategories();

    function getCategories() {
        const categories = new Set();

        allInsights.forEach((insight) => {
            categories.add(insight.identifier);
        });
        console.log([...categories]);
        return categories;
    }

    function divideInsightsIntoPages() {
        let count = 0;
        let page = [];
        let pagesArray = [];

        allInsights.forEach((insight, i) => {
            if (i < allInsights.length - 1) {
                if (postsPerPage - count >= insight.columnWidth) {
                    count += insight.columnWidth;
                    page.push(insight);
                    return;
                }
                if (postsPerPage - count < insight.columnWidth) {
                    page[page.length - 1].columnWidth =
                        postsPerPage - count + 1;
                    pagesArray.push(page);
                    page = [];
                    count = 0;
                    count += insight.columnWidth;
                    page.push(insight);
                    return;
                }
            }
            if (postsPerPage > page.length) {
                page.push(insight);
                pagesArray.push(page);
                return;
            }
            pagesArray.push(page);
            page = [];
            page.push(insight);
            pagesArray.push(page);
        });
        console.log(pagesArray);
        return pagesArray;
    }

    $: totalPages = insightsDividedIntoPages.length;

    $: currentPageInsights = insightsDividedIntoPages[currentPage - 1];
</script>

<div class="insight-archive-filters-container">
    <Filters bind:filters {categories} />
</div>
<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            {#each currentPageInsights as insight}
                <InsightCard {insight} />
            {/each}
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:currentPage {totalPages} />
        {/if}
    </div>
</section>
