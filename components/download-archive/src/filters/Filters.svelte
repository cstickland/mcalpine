<script>
    import FiltersSection from './FilterSection.svelte'
    import { allActiveFilters } from '../filters.js'

    export let categories;
    export let fileTypes;
    export let downloadTypes;
</script>

<div class="filters">
        <FiltersSection
            title='Download Type'
            items={downloadTypes}
            filters={allActiveFilters}
        />
        <FiltersSection
            title='Categories'
            items={categories}
            filters={allActiveFilters}
        />
        <FiltersSection
            title='File Type'
            items={fileTypes}
            filters={allActiveFilters}
        />
</div>

<style lang="scss">
    .filters {
        grid-area: filters-open;
    }
</style>
