<script>
    import { query, getData } from "./stores.js"
    import { onMount } from "svelte"
    import { slide } from 'svelte/transition'

    import Accordion from "./Accordion.svelte"

    let questions = [];
    const categories = new Set();
    
    onMount(async () => {
        let results = await getData(query);
        questions = results.data.posts.edges;

        questions.forEach((question) => {
            categories.add(question.node.categories.edges[0].node.name);
        });
    });
</script>

<section class="faq-archive">
    {#each [...categories] as category}
        <div transition:slide>
            <h3 class="faq-category-title">{category}</h3>
            {#if questions.length > 0}
                {#each questions as question}
                    {#if question.node.categories.edges[0].node.name == category}
                        <Accordion
                            question={question.node.title}
                            answer={question.node.faqFields.answer}
                        />
                    {/if}
                {/each}
            {/if}
        </div>
    {/each}
</section>
