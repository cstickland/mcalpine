<script>
    import Card from "./Card.svelte";
    // import Pagination from "./Pagination.svelte";
    import LoadMore from "./LoadMore.svelte";

    import {
        getData,
        getCategoryQuery,
        getWarrantyQuery,
        allItems,
        currentPage
    } from "./stores.js";
    import { onMount } from "svelte";

    export let archiveType = "";
    export let postsPerPage;

    const urlParams = new URLSearchParams(window.location.search);
    currentPage.set(parseInt(urlParams.get("pagination")) || 1);
    let transition = false;
    let endCursor = '';
    let hasNextPage = false;

    onMount(async () => {
        let query;
        $allItems = [];

        if (archiveType == "warranties") {
            query = getWarrantyQuery(postsPerPage, endCursor);
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
           endCursor = data.data.warranties.pageInfo.endCursor;
           hasNextPage = data.data.warranties.pageInfo.hasNextPage;

        }

        if (archiveType == "categories") {
            query = getCategoryQuery(postsPerPage, endCursor);
            let items = [];
            let data = await getData(query);
            data.data.productCategories.edges.forEach((category) => {
                let categoryObject = {
                    title: category.node.name,
                    url: category.node.link,
                    imageUrl:
                        category.node.customFields.categoryImage?.sourceUrl,
                    imageAlt: category.node.customFields.categoryImage?.altText,
                };
                items.push(categoryObject);
            });
            allItems.set(items);
            endCursor = data.data.productCategories.pageInfo.endCursor;
           hasNextPage = data.data.productCategories.pageInfo.hasNextPage;
        }
    });


</script>

<section class="insight-archive">
    <div class="insight-archive-grid-container">
        <ul class="insight-archive-grid mobile-two-column">
            {#if transition == false}
                {#each  [...$allItems] as item}
                    <Card {...item} />
                {/each}
            {/if}
        </ul>
    </div>
    <div class="pagination-container">
        {#if hasNextPage}
            <LoadMore {archiveType} {postsPerPage} bind:hasNextPage bind:endCursor />
        {/if}
        <!-- {#if totalPages > 1} -->
        <!--     <Pagination  bind:transition {totalPages} /> -->
        <!-- {/if} -->
    </div>
</section>
