<script>
    import { parentFilters, childFilters } from "./stores.js";

    function removeFilter(id) {
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
    }
</script>

<ul class="active-filters">
    {#if $childFilters.size == 0 && $parentFilters.size > 0}
        {#each [...$parentFilters] as filter}
            <li
                on:keydown
                on:click={() => {
                    removeFilter(filter);
                }}
            >
                {filter}
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
    {/if}
    {#if $childFilters.size > 0}
        {#each [...$childFilters] as filter}
            <li
                on:keydown
                on:click={() => {
                    removeFilter(filter);
                }}
            >
                {filter}
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
    {/if}
</ul>
