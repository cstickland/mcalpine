<script>
    import FiltersSection from './FilterSection.svelte'
    import {filters} from '../filters.js';
    import {itemsDividedIntoPages, divideItemsIntoPages, allItems, currentPage} from '../stores.js';
    export let postsPerPage;

    export let categories;
    export let fileTypes;
    export let downloadTypes;
    
    let filtersArray = [categories, fileTypes, downloadTypes];

    filters.subscribe((value) => {
        itemsDividedIntoPages.set(
            divideItemsIntoPages(postsPerPage, $allItems, currentPage, value)
        );
    });
</script>

<div class="filters">
    {#each filtersArray as filterSection}
        <FiltersSection
            title={filterSection.title}
            items={filterSection.items}
            bind:filters={filterSection.filters}
        />
    {/each}
</div>

<style lang="scss">
    .filters {
        grid-area: filters-open;
    }
</style>
