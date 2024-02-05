<script>
    export let allInsights = [];

    import InsightCard from "./InsightCard.svelte";
    import Pagination from "./Pagination.svelte";
    import Filters from "./Filters.svelte";
    import { onMount } from 'svelte';
    import { filters, currentPage } from "./stores.js";
    import {divideInsightsIntoPages, getCategories} from './functions.js'; 

    onMount(() => {
        
    const urlParams = new URLSearchParams(window.location.search);
    const currentPageTemp = parseInt(urlParams.get('pagination')) || 1;
    currentPage.set(currentPageTemp);
    })
   
 
    let categories = getCategories();
    export let showFilters = true;

    $: totalPages = insightsDividedIntoPages.length;
    const insightsDividedIntoPages = divideInsightsIntoPages($filters);
    let currentPageInsights;
  
   
  currentPage.subscribe((value) => {
        currentPageInsights = insightsDividedIntoPages[value - 1];
   })
</script>

<div class="insight-archive-filters-container">
    {#if showFilters}
        <Filters {categories} />
    {/if}
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
            <Pagination  {totalPages} />
        {/if}
    </div>
</section>
