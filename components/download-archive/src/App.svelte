<script>
    import Card from "./Card.svelte";
    import Pagination from "./Pagination.svelte";

    import {
        getData,
        divideItemsIntoPages,
        query, 
        allItems
    } from "./stores.js";
    import { onMount } from "svelte";

    export let archiveType = "";
    export let postsPerPage; 

    let currentPage = 1;
    let itemsDividedIntoPages;
    let transition = false;

    onMount(async () => {
        let query;
        $allItems = [];

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
            {#if transition == false}
            {#each currentPageItems as item}
                <Card {...item} />
            {/each}
            {/if}
        </ul>
    </div>
    <div class="pagination-container">
        {#if totalPages > 1}
            <Pagination bind:currentPage bind:transition {totalPages} />
        {/if}
    </div>
</section>
