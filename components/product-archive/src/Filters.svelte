<script>
    import FilterSection from "./FilterSection.svelte";
    import { slide } from "svelte/transition";
    import { parentFilters } from "./stores.js";

    export let parentCategories = [];
    export let childCategories = [];
    export let finishes = [];
    export let currentPage;

    export let currentChildCategories = [];

    $: if ($parentFilters.size > 0) {
        currentChildCategories = [];

        childCategories.forEach((category) => {
            if ($parentFilters.has(category.parent)) {
                currentChildCategories.push(category);
            }
        });
    } else {
        currentChildCategories = childCategories;
    }
  
</script>

<div class="product-archive-filters" transition:slide={{ duration: 300 }}>
    {#if parentCategories.length > 1}
        <FilterSection
            title="Category"
            categories={parentCategories}
            bind:currentPage
            isParent={true}
        />
    {/if}
    {#if currentChildCategories.length > 0}
        <FilterSection
            title="Subcategory"
            categories={currentChildCategories}
            isParent={false}
        />
    {/if}
    {#if finishes.length > 0}
        <FilterSection title="Finish" categories={finishes} isParent={false} />
    {/if}
</div>
