<script>
    export let allInsights = [];

    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";
   
    let currentPage = 1;
    let postsPerPage = 12;
    let gridStyle = true;
    let filtersClass;

 

    $: totalProducts = getTotal(allInsights);

    function getTotal(insights) {
        let total = 0;
        insights.forEach(element => {
            total += element.columnWidth;
        });
        console.log(total);
        return total;
    }
    $: totalPages = Math.ceil(totalProducts / postsPerPage);
    $: postRangeHigh = currentPage * postsPerPage;
    $: postRangeLow = postRangeHigh - postsPerPage;
 
    

</script>

<section class="product-archive {filtersClass}">

    <div class="product-archive-grid-container">
    <ul class={gridStyle ? 'product-archive-grid columns' : 'product-archive-grid rows'}>
        {#each allInsights as insight, i}
            {#if i >= postRangeLow && i < postRangeHigh}
                <InsightCard {insight} />
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
