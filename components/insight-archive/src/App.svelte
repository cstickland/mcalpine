<script>
    export let allInsights = [];

    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";

    let currentPage = 1;
    let gridStyle = true;
    let postsPerPage = 16;
    let insightsDividedIntoPages = divideInsightsIntoPages();

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
                    page[page.length - 1].columnWidth = postsPerPage - count + 1;
                    pagesArray.push(page);
                    page = [];
                    count = 0;
                    count += insight.columnWidth;
                    page.push(insight);
                    return;
                }
            }
            page.push(insight);
            pagesArray.push(page);
        });
        console.log(pagesArray)
        return pagesArray;
    }

 

    $: totalPages = insightsDividedIntoPages.length;

    $: currentPageInsights = insightsDividedIntoPages[currentPage - 1];
</script>

<section class="product-archive hide-filters">
    <div class="product-archive-grid-container">
        <ul
            class={gridStyle
                ? "product-archive-grid columns"
                : "product-archive-grid rows"}
        >
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
