<script>
    import Card from "./Card.svelte";
    import Pagination from "./Pagination.svelte";

    import {
        getData,
        divideItemsIntoPages,
        categoryQuery,
        warrantyQuery,
        allItems
    } from "./stores.js";
    import { onMount } from "svelte";

    export let archiveType = "";
    export let postsPerPage; 

    let currentPage = 1;
    let itemsDividedIntoPages;

    onMount(async () => {
        let query;
        $allItems = [];
        console.log(postsPerPage)

        if (archiveType == "warranties") {
            query = warrantyQuery;
            let items = [];
            let data = await getData(query);

            data.data.warranties.edges.forEach((warranty) => {
                let warrantyObject = {
                    title: warranty.node.title,
                    url: warranty.node.link,
                    imageUrl: warranty.node.featuredImage.node.sourceUrl,
                    imageAlt: warranty.node.featuredImage.node.altText,
                };
                items.push(warrantyObject);
            });
            allItems.set(items);
        }

        if (archiveType == "categories") {
            query = categoryQuery;
            let items = [];
            let data = await getData(query);
            console.log(data)
            data.data.productCategories.edges.forEach((category) => {
                let categoryObject = {
                    title: category.node.name,
                    url: category.node.link,
                    imageUrl: category.node.customFields.categoryImage?.sourceUrl,
                    imageAlt: category.node.customFields.categoryImage?.altText,
                };
                items.push(categoryObject);
            });
        allItems.set(items);

        }
    });


    allItems.subscribe((value) => {
        itemsDividedIntoPages =  divideItemsIntoPages(
            postsPerPage,
            value,
            currentPage
        );
    })

    $: totalPages = itemsDividedIntoPages.length;
    $: currentPageItems = itemsDividedIntoPages[currentPage - 1] || [];
</script>

<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid mobile-two-column">
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
