<script>
    import Card from "./Card.svelte";
    import Pagination from "./Pagination.svelte";

    import { getData, divideItemsIntoPages, categoryQuery, warrantyQuery } from './stores.js';
    import { onMount } from 'svelte';

    export let archiveType = '';
    export let postsPerPage = 12;

    let allItems = [];
    let currentPage = 1;

    $: totalPages = itemsDividedIntoPages.length;
    $: itemsDividedIntoPages = divideItemsIntoPages(postsPerPage, allItems, currentPage);
    $: currentPageItems = itemsDividedIntoPages[currentPage - 1];
    
    onMount(async () => {
        let query;
        allItems = [];

        if(archiveType == 'warranties') {
            query = warrantyQuery;
            let data = await getData(query);

            data.warranties.edges.forEach((warranty) => {
                let warrantyObject = {
                    title: warranty.node.title,
                    url: warranty.node.link,
                    imageUrl: warranty.node.featuredImage.node.sourceUrl,
                    imageAlt: warranty.node.featuredImage.node.altText,
                };
            allItems.push(warrantyObject);
            })
        }

        if(archiveType == 'categories') {
            query = categoryQuery;
            let data = await getData(query);
            
             data.productCategories.edges.forEach((category) => {
                let categoryObject = {
                    title: category.node.name,
                    url: category.node.link,
                    imageUrl: category.node.customFields.categoryImage.sourceUrl,
                    imageAlt: category.node.customFields.categoryImage.altText,
                };
                allItems.push(categoryObject);
            })
        }       
    })
</script>

<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid">
            {#each currentPageItems as item}
                <Card {...item} />
            {/each}
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:currentPage {totalPages} />
        {/if}
    </div>
</section>
