<script>
    import { slide } from "svelte/transition";
    import { onMount, tick } from "svelte";
    let open = false;

    export let question = "";
    export let answer = "";
    export let id;
    let accordionElement;

    onMount(async () => {
        await tick();
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const myParam = urlParams.get("id");

            if (myParam == id) {
                open = true;
                accordionElement.scrollIntoView({ behaviour: "smooth" });
            }
        }, 300);
    });
</script>

<div class="accordion {open ? 'open' : ''}" {id} bind:this={accordionElement}>
    <div class="open-gradient" />
    <div
        class="accordion-question-container"
        on:click={() => {
            open = !open;
        }}
        on:keydown
    >
        <h5 class="accordion-question">{question}</h5>

        <div class="accordion-toggle-icon">
            <div class="vertical-line" />
            <div class="horizontal-line" />
        </div>
    </div>
    {#if open}
        <div class="accordion-answer" transition:slide>
            <div itemprop="text">{@html answer}</div>
        </div>
    {/if}
</div>
