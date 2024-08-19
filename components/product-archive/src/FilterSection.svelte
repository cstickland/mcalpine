<script>
    import { slide } from "svelte/transition";
    import { childFilters, parentFilters, currentPage, finishFilters, allFilters } from "./stores";
    export let categories = [];
    export let title = "title";
    export let isParent;
    let openCategory = false;
    let filters = [];

    $: if (filters.length && filters) {
        currentPage.set(1);
    }

    $: if (isParent && filters.length) {
        childFilters.set(new Set());
    }

    function toggleFilter(id) {
        currentPage.set(1);
        if($allFilters.has(id)) {
            if($allFilters.delete(id)) {
                allFilters.set($allFilters);
            }
        } else {
            allFilters.set($allFilters.add(id));
        }

        if (isParent) {
            if ($parentFilters.has(id)) {
                if ($parentFilters.delete(id)) {
                    parentFilters.set($parentFilters);
                }
            } else {
                $parentFilters = $parentFilters.add(id);
            }
            return;
        }
        if(title == "Finish") {
            if($finishFilters.has(id)) {
                if($finishFilters.delete(id)) {
                    finishFilters.set($finishFilters);
                }
            } else {
                $finishFilters = $finishFilters.add(id);
            }
            return
        }
        if ($childFilters.has(id)) {
            if ($childFilters.delete(id)) {
                childFilters.set($childFilters);
            }
        } else {
            $childFilters = $childFilters.add(id);
        }
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
                        toggleFilter(category.term_id);
                    }}
                    on:keydown
                >
                        <div
                            class="category-toggle {$allFilters.has(
                                category.term_id,
                            )
                                ? 'checked'
                                : 'unchecked'}"
                        >
                            <div class="toggle-circle" />
                        </div>
                    {@html category.name}
                </li>
            {/each}
        </div>
    {/if}
</ul>
