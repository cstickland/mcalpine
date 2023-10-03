<script>
    export let allInsights = [];


    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";

    import { filters } from './stores.js';

    let currentPage = 1;
    let postsPerPage = 16;
    let categories = getCategories();
    
    $: totalPages = insightsDividedIntoPages.length;
    $: insightsDividedIntoPages = divideInsightsIntoPages($filters);
    $: currentPageInsights = insightsDividedIntoPages[currentPage - 1];
    
    function getCategories() {
        const categories = new Set();

        allInsights.forEach((insight) => {
            categories.add(insight.identifier);
        });
              return categories;
    }

    function divideInsightsIntoPages(filters) {
        let count = 0;
        let page = [];
        let pagesArray = [];
        let insights = [];

        currentPage = 1;

        if(filters.size == 0) {
            insights = allInsights;
        }

        if(filters.size > 0) {
            insights = [];
            allInsights.forEach((insight) => {
                if(filters.has(insight.identifier)) {
                    insights.push(insight);
                }
            })
        }

        insights.forEach((insight, i) => {
            if (i < insights.length - 1) {
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
        return pagesArray;
    }


</script>

<div class="insight-archive-filters-container">
    <Filters  {categories} />
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
