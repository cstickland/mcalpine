<script>
    import { query, getData } from "./stores.js";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import Accordion from "./Accordion.svelte";

    let questions = [];
    let categories = new Set();
    let searchTerm = "";

    onMount(async () => {
        let results = await getData(query);
        questions = results.data.posts.edges;
        questions.forEach((question) => {
            categories.add(question.node.categories.edges[0].node.name);
        });

        const container = document.getElementById('faq');
        setTimeout(() => {
            
        container.style.minHeight = 'unset';
        }, 300)
    });
</script>

<section class="faq-archive">
    <div class="categories-container">
        <input
            class="faq-filter-search"
            type="text"
            bind:value={searchTerm}
            placeholder="Filter by term..."
        />
        <div class="category-links">
            <h5>Topics</h5>
            {#if questions.length > 0}
                {#each [...categories] as category}
                    <a href={"#" + category}>{category}</a>
                {/each}
            {/if}
        </div>
    </div>
    <div class="questions-container">
        {#each [...categories] as category}
            <div id={category} transition:fade>
                <h3 class="faq-category-title">{category}</h3>
                {#if questions.length > 0}
                    {#each questions as question}
                        {#if question.node.categories.edges[0].node.name == category}
                            <Accordion
                                question={question.node.title}
                                answer={question.node.faqFields.answer}
                                id={question.node.postId}
                            />
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</section>
