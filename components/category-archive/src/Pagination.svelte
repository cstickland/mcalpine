<script>

    import * as animateScroll from "svelte-scrollto";
    import {currentPage} from './stores.js';
    export let totalPages;
    export let transition;

    function setCurrent$currentPage(newPage) {

        animateScroll.scrollTo({element: "#category-archive", duration: 200});
        // setTimeout(() => {
        transition = true;
        currentPage.set(newPage);
        const url = new URL(location);
        url.searchParams.set("pagination", newPage);
        history.pushState({}, "", url);
        setTimeout(() => {

        transition = false;
        }, 10)
        // }, 600);
    }
</script>

{#if $currentPage > 1}
    <button
        class="prev-next-button"
        on:click={() => {
            setCurrent$currentPage($currentPage - 1);
        }}>Prev</button
    >
{:else}
    <button class="prev-next-button" disabled>Prev</button>
{/if}

<div class="page-number-buttons">
    {#if $currentPage == totalPages && totalPages > 2}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrent$currentPage($currentPage - 2);
            }}>{$currentPage - 2}</button
        >
    {/if}
    {#if $currentPage > 1}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrent$currentPage($currentPage - 1);
            }}>{$currentPage - 1}</button
        >
    {/if}

    <button class="pagination-button pagination-button__current"
        >{$currentPage}</button
    >

    {#if $currentPage < totalPages}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrent$currentPage($currentPage + 1);
            }}>{$currentPage + 1}</button
        >
    {/if}
    {#if $currentPage == 1 && totalPages > 2}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrent$currentPage($currentPage + 2);
            }}>{$currentPage + 2}</button
        >
    {/if}
    {#if $currentPage < totalPages - 1 && totalPages > 3}
        <div class="pagination-seperator-dots"><span>...</span></div>
        <button
            class="pagination-button"
            on:click={() => {
                setCurrent$currentPage(totalPages);
            }}>{totalPages}</button
        >
    {/if}
</div>

{#if $currentPage < totalPages}
    <button
        class="prev-next-button"
        on:click={() => {
            setCurrent$currentPage($currentPage + 1);
        }}
    >
        Next
    </button>
{:else}
    <button class="prev-next-button" disabled>Next</button>
{/if}
