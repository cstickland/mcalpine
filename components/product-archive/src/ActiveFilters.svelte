<script>
    import {
        allFilters,
        parentFilters,
        childFilters,
        finishFilters,
    } from "./stores.js";

    export let taxonomies;

    function findTaxonomyTitle(id) {
        let title = "";
        taxonomies.forEach((element) => {
            if (element.term_id === id) {
                title = element.name;
            }
        });
        return title;
    }

    function removeFilter(id) {
        if ($allFilters.has(id)) {
            if ($allFilters.delete(id)) {
                allFilters.set($allFilters);
            }
        }

        if ($parentFilters.has(id)) {
            if ($parentFilters.delete(id)) {
                parentFilters.set($parentFilters);
            }
        }
        if ($childFilters.has(id)) {
            if ($childFilters.delete(id)) {
                childFilters.set($childFilters);
            }
        }
        if ($finishFilters.has(id)) {
            if ($finishFilters.delete(id)) {
                finishFilters.set($finishFilters);
            }
        }
    }
</script>

<ul class="active-filters">
    {#each [...$allFilters] as filter}
        <li
            on:keydown
            on:click={() => {
                removeFilter(filter);
            }}
        >
            {@html findTaxonomyTitle(filter)}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="close"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                            /></g
                        ></g
                    ></svg
                >
            </span>
        </li>
    {/each}
</ul>
