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

    export let postsPerPage; 

    let currentPage = 1;
    let itemsDividedIntoPages;
    let transition = false;

    onMount(async () => {
        $allItems = [];
            let items = [];
            let data = await getData(query);
            console.log(data)
            data.data.downloads.edges.forEach((download) => {
                let downloadObject = {
                    title: download.node.title,
                    imageUrl: download.node.featuredImage.node.sourceUrl,
                    imageAlt: download.node.featuredImage.node.altText
                         };
                items.push(downloadObject);
            });
            allItems.set(items);
        }
    );


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
