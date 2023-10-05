<script>
    import { slide, fade } from "svelte/transition";

    import { filters } from "./stores.js";

    export let categories;
    let open = false;
    const categoriesArray = [...categories];
</script>

<div class="insight-archive-filters">
    <div class="insight-archive-filter-categories">
        <div
            class="dropdown-toggle"
            on:click={() => {
                open = !open;
            }}
            on:keydown={() => {
                open = !open;
            }}
        >
            Categories
            {#if open}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
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
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-down"
                            ><rect width="24" height="24" opacity="0" /><path
                                d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                            /></g
                        ></g
                    ></svg
                >
            {/if}
        </div>
        {#if open}
            <ul class="insight-archive-filter-dropdown" transition:slide={{ duration: 200 }}>
                {#each categoriesArray as category}
                    <li
                        on:click={() => {
                            if (!$filters.has(category)) {
                                $filters = $filters.add(category);
                            } else {
                                if ($filters.delete(category)) {
                                    $filters = $filters;
                                }
                            }
                        }}
                        on:keydown
                    >
                            <div class="category-toggle {$filters.has(category) ? "checked" : "unchecked"}">
                                <div class="toggle-circle" />
                            </div>
                                             {category}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <ul class="insight-archive-rounded-buttons">
        {#each [...$filters] as filter}
            <li
                on:keydown
                on:click={() => {
                    if ($filters.delete(filter)) {
                        $filters = $filters;
                    }
                }}
            >
                {filter}
            </li>
        {/each}
    </ul>
</div>
