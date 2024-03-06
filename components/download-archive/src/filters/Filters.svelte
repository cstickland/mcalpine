<script>
    import FiltersSection from './FilterSection.svelte'
    import { onMount } from 'svelte'
    import { activeCategoryFilters, activeFileTypeFilters, activeDownloadTypeFilters } from '../filters.js'
    export let postsPerPage;

    export let categories;
    export let fileTypes;
    export let downloadTypes;
    
    activeCategoryFilters.subscribe((value) => {
        console.log(value)
    })
    activeFileTypeFilters.subscribe((value) => {
        console.log(value)
    })
    activeDownloadTypeFilters.subscribe((value) => {
        console.log(value)
    })


    onMount(() => {
        
    })
</script>

<div class="filters">
        <FiltersSection
            title='Download Type'
            items={downloadTypes}
            filters={activeDownloadTypeFilters}
        />
        <FiltersSection
            title='Categories'
            items={categories}
            filters={activeCategoryFilters}
        />
        <FiltersSection
            title='File Type'
            items={fileTypes}
            filters={activeFileTypeFilters}
        />
</div>

<style lang="scss">
    .filters {
        grid-area: filters-open;
    }
</style>
