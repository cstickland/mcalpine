<script>
    export let allItems = [];
    export let hasNextPage = false;
    export let endCursor = '';
    export let categories = [];
    export let showFilters = true;

    import InsightCard from "./InsightCard.svelte";
    import LoadMore from "./LoadMore.svelte";
    import Filters from "./Filters.svelte";
    import { filters } from "./stores.js";
    import { getData, query } from './functions'

    filters.subscribe(async (values) => {
        let categories = [];
        let faqCategories = [];
        endCursor = ''
        values.forEach(filter => {
            if(filter.taxonomyName === 'category') {
                categories.push(filter.slug);
            }
            if(filter.taxonomyName === 'faq_categories') {
                faqCategories.push(filter.slug)
            }
        })
        if(categories.length === 0) {
            categories = null
        }
        if(faqCategories.length === 0) {
            faqCategories = null
        }
    
        const variables  = {
            faqCategories: faqCategories,
            categories: categories,
            after: endCursor
        }
        let response = await getData(query, variables);

        console.log(response)
        allItems = [...response.data.contentNodes.nodes];
        endCursor = response.data.contentNodes.pageInfo.endCursor;
        hasNextPage = response.data.contentNodes.pageInfo.hasNextPage;
    });
</script>

<div class="insight-archive-filters-container">
    {#if showFilters}
        <Filters {categories} bind:allItems />
    {/if}
</div>
<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            {#each allItems as item}
                <InsightCard insight={item} />
            {/each}
        </ul>
    </div>
    <div class="pagination-container">
        {#if hasNextPage}
            <LoadMore bind:allItems bind:hasNextPage bind:endCursor />
        {/if}
    </div>
</section>
