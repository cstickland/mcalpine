<script>
    import { currentPage } from "./stores";
    export let totalPages;
    function setCurrentcurrentPage(newPage) {
        currentPage.set(newPage);
        const url = new URL(location);
        url.searchParams.set("page", newPage);
        history.pushState({}, "", url);
    }
</script>

{#if $currentPage > 1}
    <button
        class="prev-next-button"
        on:click={() => {
            setCurrentcurrentPage($currentPage - 1);
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
                setCurrentcurrentPage($currentPage - 2);
            }}>{$currentPage - 2}</button
        >
    {/if}
    {#if $currentPage > 1}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrentcurrentPage($currentPage - 1);
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
                setCurrentcurrentPage(parseInt($currentPage) + 1);
            }}>{parseInt($currentPage) + 1}</button
        >
    {/if}
    {#if $currentPage == 1 && totalPages > 2}
        <button
            class="pagination-button"
            on:click={() => {
                setCurrentcurrentPage(parseInt($currentPage) + 2);
            }}>{parseInt($currentPage) + 2}</button
        >
    {/if}
    {#if $currentPage < totalPages - 1 && totalPages > 3}
        <div class="pagination-seperator-dots"><span>...</span></div>
        <button
            class="pagination-button"
            on:click={() => {
                setCurrentcurrentPage(totalPages);
            }}>{totalPages}</button
        >
    {/if}
</div>

{#if $currentPage < totalPages}
    <button
        class="prev-next-button"
        on:click={() => {
            setCurrentcurrentPage($currentPage + 1);
        }}
    >
        Next
    </button>
{:else}
    <button class="prev-next-button" disabled>Next</button>
{/if}
