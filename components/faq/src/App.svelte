<script>
    import { query, getData } from "./stores.js";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import Accordion from "./Accordion.svelte";

    let questions = [];
    export let categories = new Set();
    let filteredQuestions = [];
    let filteredCategories = new Set();
    let searchTerm = "";

    onMount(async () => {
        let results = await getData(query);
        questions = results.data.faqs.edges;
  
        const container = document.getElementById("faq");
        setTimeout(() => {
            container.style.minHeight = "unset";
        }, 300);
    });

    $: if (searchTerm != "") {
        filteredQuestions = [];
        filteredCategories = new Set();
        questions.forEach((question) => {
            if (
                question.node.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.node.faqFields.answer
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            ) {
                filteredQuestions.push(question);
                filteredCategories.add(
                    question.node.faqCategories.edges[0].node.name
                );
            }
        });
    } else {
        filteredQuestions = [...questions];
        filteredCategories = [...categories];
    }
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
            {#if filteredQuestions.length > 0}
                {#each [...filteredCategories] as category}
                    <a href={"#" + category}>{category}</a>
                {/each}
            {/if}
        </div>
    </div>
    <div class="questions-container">
        {#each [...filteredCategories] as category}
            <div id={category} transition:fade>
                <h3 class="faq-category-title">{category}</h3>
                {#if filteredQuestions.length > 0}
                    {#each filteredQuestions as question}
                        {#if question.node.faqCategories.edges[0]}
                            {#if question.node.faqCategories.edges[0].node.name == category}
                                <Accordion
                                    question={question.node.title}
                                    answer={question.node.faqFields.answer}
                                    id={question.node.faqId}
                                />
                            {/if}
                        {/if}
                    {/each}
                {/if}
            </div>
        {/each}
    </div>
</section>
