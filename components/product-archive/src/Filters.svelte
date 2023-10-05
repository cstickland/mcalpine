<script>
    import FilterSection from "./FilterSection.svelte";
    import { slide } from "svelte/transition";
    import { parentFilters, childFilters } from "./stores.js";

    export let parentCategories = [];
    export let childCategories = [];
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
    <FilterSection
        title="Category"
        categories={parentCategories}
        bind:currentPage
        isParent={true}
    />
    <FilterSection
        title="Subcategory"
        categories={currentChildCategories}
        isParent={false}
    />
</div>
