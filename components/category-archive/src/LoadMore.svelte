<script>
    import {
        allItems,
        getCategoryQuery,
        getWarrantyQuery,
        getData,
    } from "./stores.js";
    export let archiveType = "";
    export let endCursor;
    export let hasNextPage;
    export let postsPerPage;
    let isLoadingButton = false;

    async function loadMore() {
        isLoadingButton = true;
        let items = [];

        if (archiveType == "categories") {
            const query = getCategoryQuery(postsPerPage, endCursor);
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
            endCursor = data.data.productCategories.pageInfo.endCursor;
            hasNextPage = data.data.productCategories.pageInfo.hasNextPage;
        }

        if (archiveType == "warranties") {
            const query = getWarrantyQuery(postsPerPage, endCursor);
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
            endCursor = data.data.warranties.pageInfo.endCursor;
            hasNextPage = data.data.warranties.pageInfo.hasNextPage;
        }

        allItems.set([...$allItems, ...items]);
        isLoadingButton = false
    }
</script>

<button class="btn btn-black" aria-label="load more" on:click={loadMore}>
    {!isLoadingButton ? "Load More" : "Loading..."}
</button>

<style>
    button {
        margin: 0 auto;
    }
</style>
