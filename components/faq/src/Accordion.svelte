<script lang="ts">
    import { slide } from "svelte/transition";
    let open = false;

    export let question = "";
    export let answer = "";
</script>

<div class="accordion {open ? 'open' : ''}">
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
            {@html answer}
        </div>
    {/if}
</div>
