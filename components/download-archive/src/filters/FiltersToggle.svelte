<script>
    import { allActiveFilters } from "../filters";
    export let filtersOpen;
</script>

<div class="filters-heading-container">
<button
    on:click={() => {filtersOpen = !filtersOpen}}
    class="filters-heading-open"
>
    <div class="filters-icon">
        <div class="filter-line line-one">
            <div class="filter-line-black" />
            <div class="filter-line-red" />
        </div>
        <div class="filter-line line-two">
            <div class="filter-line-black" />
            <div class="filter-line-red" />
        </div>
        <div class="filter-line line-three">
            <div class="filter-line-black" />
            <div class="filter-line-red" />
        </div>
    </div>
    Filters
</button>

{#if $allActiveFilters.size > 0}
<button class="clear-filters" on:keydown on:click={() => {allActiveFilters.set(new Set())}}>
    Clear Selection
</button>
{/if}
</div>
<style lang="scss">
    @import "../colors.scss";
    .filters-heading-container {
        display:flex;
        align-items: center;
        justify-content: space-between;

        .clear-filters {
        border: 0;
        text-decoration: underline;
        color: $color__mcalpine-black;
        outline: 0;
        background: transparent;
        cursor: pointer;
        }
    }
    .filters-heading-open {
        cursor: pointer;
        display: flex;
        align-items: center;
        border: 0;
        font-size: 1.25rem;
        background-color: transparent;

        &:hover,
        &:active {
            color: $color__mcalpine-red;
        }
    }
    .filters-icon {
        height: 100%;
        aspect-ratio: 1;
        margin-right: 1.25rem;
        width: 1.125rem;
        height: 1rem;
        display: flex;
        flex-direction: column;
        .filter-line {
            width: 100%;
            height: 5px;
            display: flex;
            align-items: center;
            position: relative;
            .filter-line-black {
                width: 100%;
                height: 2px;
                background-color: $color__mcalpine-black;
            }

            .filter-line-red {
                width: 2px;
                height: 5px;
                background-color: #f85b53;
                position: absolute;
            }

            &.line-one,
            &.line-three {
                .filter-line-red {
                    left: 4px;
                }
            }

            &.line-two {
                .filter-line-red {
                    right: 4px;
                }
            }
        }
    }
</style>
