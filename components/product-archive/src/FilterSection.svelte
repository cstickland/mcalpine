<script>

    import { slide } from "svelte/transition";
    export let categories = [];
    export let filters = [];
    export let title = "title";
    export let currentPage;
    export let isParent;
    export let childFilters;

    $: if (filters.length && filters) {
        currentPage = 1;
        console.log(filters)
    }

    $: if (isParent && filters.length) {
        childFilters = [];
    }

    let openCategory = false;
</script>

<ul class="product-archive-filters-section">
    <button
        class="filter-category-title"
        on:click={() => {
            openCategory = !openCategory;
        }}
    >
        <h4>{title}</h4>
        {#if openCategory}
            <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="chevron-up"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z"/></g></g></svg>
 </span>
       {:else}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g data-name="Layer 2">
                        <g data-name="chevron-down">
                            <rect width="24" height="24" opacity="0"/>
                            <path d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"/>
                        </g>
                    </g>
                </svg>
            </span>
        {/if}
    </button>
    {#if openCategory}
    <div class="product-archive-category-list" transition:slide={{axis: "y", duration: 300}}>
        {#each categories as category}
            <li on:click={() => {
                if(filters.indexOf(category.id) == -1) {
                    filters.push(category.id);
                    console.log(filters)
                } else {
                    let spliceValue = filters.indexOf(category.id);
                    filters.splice(spliceValue, 1)
                    console.log(filters)
                }
            }} on:keydown>
                <div class="category-toggle checked">
                    <div class="toggle-circle" />
                </div>
                <input
                    type="checkbox"
                    bind:group={filters}
                    name={category.name}
                    value={category.id}
                />
                {@html category.name}
            </li>
        {/each}
    </div>
    {/if}
</ul>
