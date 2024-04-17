<script>
    import { filters } from './stores';
    import { getData, query } from "./functions";
    let isLoadingButton = false;
    export let allItems = [];
    export let endCursor = '';
    export let hasNextPage = false;

    async function loadMore() {
        isLoadingButton = true;

        let categories = [];
        let faqCategories = [];

        $filters.forEach(filter => {
            if(filter.taxonomyName === 'category') {
                categories.push(filter.slug);
            }
            if(filter.taxonomyName === 'faq_categories') {
                faqCategories.push(filter.slug)
            }
        })
        if(categories.length === 0) {
            categories = null
        }
        if(faqCategories.length === 0) {
            faqCategories = null
        }
        const variables  = {
            faqCategories: faqCategories,
            categories: categories,
            after: endCursor
        }
        let response = await getData(query, variables);

        allItems = [...allItems, ...response.data.contentNodes.nodes];
        endCursor = response.data.contentNodes.pageInfo.endCursor;
        hasNextPage = response.data.contentNodes.pageInfo.hasNextPage;
        isLoadingButton = false;
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
