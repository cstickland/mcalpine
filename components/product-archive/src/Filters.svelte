<script>
    import FilterSection from "./FilterSection.svelte";
    import { fade } from "svelte/transition";

    export let parentCategories = [];
    export let childCategories = [];
    export let childFilters = [];
    export let parentFilters = [];
    export let currentPage;
  
    export let currentChildCategories = [];

    $: if (parentFilters.length > 0) {
        currentChildCategories = [];
       
        childCategories.forEach((category) => {
            if (parentFilters.find((id) => id == category.parent)) {
                currentChildCategories.push(category);
            }
        });
    }
</script>

<div class="product-archive-filters" in:fade={{duration: 300}} out:fade={{duration: 300}}>
    <FilterSection
        title="Category"
        categories={parentCategories}
        bind:filters={parentFilters}
        bind:currentPage
        bind:childFilters={childFilters}
        isParent={true}
    />
    {#if parentFilters.length == 0}
        <FilterSection
            title="Subcategory"
            categories={childCategories}
            bind:filters={childFilters}
            bind:currentPage
            isParent={false}
        />
    {/if}
    {#if parentFilters.length > 0}
        <FilterSection
            title="Subcategory"
        categories={currentChildCategories}
            bind:filters={childFilters}
            bind:currentPage
            isParent={false}
        />
    {/if}
</div>
