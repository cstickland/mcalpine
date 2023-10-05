<script>
    import { slide } from "svelte/transition";
    import { childFilters, parentFilters, currentPage } from "./stores";
    export let categories = [];
    export let title = "title";
    export let isParent;
    let openCategory = false;
    let filters = [];

    $: if (filters.length && filters) {
        currentPage.set(1);
    }

    $: if (isParent && filters.length) {
        childFilters.set(new Set);
    }

    function toggleFilter(id) {
        if (isParent) {
            if ($parentFilters.has(id)) {
                if ($parentFilters.delete(id)) {
                    parentFilters.set($parentFilters);
                }
            } else {
                    $parentFilters = $parentFilters.add(id);
            }
            filters = [...$parentFilters];
            return;
        }
        if ($childFilters.has(id)) {
            if ($childFilters.delete(id)) {
                childFilters.set($childFilters);
            }
        } else {
            $childFilters = $childFilters.add(id);
        }
        filters = [...$childFilters];
    }
</script>

<ul class="product-archive-filters-section">
    <button
        class="filter-category-title"
        on:click={() => {
            openCategory = !openCategory;
        }}
    >
        <h5>{title}</h5>
        {#if openCategory}
            <span
                ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-up"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z"
                            /></g
                        ></g
                    ></svg
                >
            </span>
        {:else}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g data-name="Layer 2">
                        <g data-name="chevron-down">
                            <rect width="24" height="24" opacity="0" />
                            <path
                                d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                            />
                        </g>
                    </g>
                </svg>
            </span>
        {/if}
    </button>
    {#if openCategory}
        <div
            class="product-archive-category-list"
            transition:slide={{ axis: "y", duration: 300 }}
        >
            {#each categories as category}
                <li
                    on:click={() => {
                        toggleFilter(category.id);
                    }}
                    on:keydown
                >
                    {#if isParent}
                        <div
                            class="category-toggle {$parentFilters.has(
                                category.id
                            )
                                ? 'checked'
                                : 'unchecked'}"
                        >
                            <div class="toggle-circle" />
                        </div>
                    {:else}
                        <div
                            class="category-toggle {$childFilters.has(
                                category.id
                            )
                                ? 'checked'
                                : 'unchecked'}"
                        >
                            <div class="toggle-circle" />
                        </div>
                    {/if}
                    {@html category.name}
                </li>
            {/each}
        </div>
    {/if}
</ul>
