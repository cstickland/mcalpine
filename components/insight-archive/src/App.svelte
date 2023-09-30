<script>
    export let allInsights = [];

    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";

    let currentPage = 1;
    let postsPerPage = 12;
    let gridStyle = true;

    let totalProducts = getTotal(allInsights);

    let insightsDividedIntoPages = divideInsightsIntoPages();

    function getTotal(insights) {
        let total = 0;
        insights.forEach((element) => {
            total += element.columnWidth;
        });
        return total;
    }

    function divideInsightsIntoPages() {
        let count = 0;
        let page = [];
        let pagesArray = [];

        while (allInsights.length > 0) {
            
            if(count < 12 ) {
                let pushInsight = allInsights.shift();
               page.push(pushInsight);
               count++;
            } else {
                pagesArray.push(page);
                page = [];
                count = 0;
            }
        }

        return pagesArray;
    }

    $: totalPages = Math.ceil(totalProducts / postsPerPage);

    $: currentPageInsights = insightsDividedIntoPages[currentPage - 1];
</script>

<section class="product-archive hide-filters">
    <div class="product-archive-grid-container">
        {insightsDividedIntoPages.length},
        {totalPages}
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
            <Pagination
                bind:currentPage
                {totalPages}
            />
        {/if}
    </div>
</section>
