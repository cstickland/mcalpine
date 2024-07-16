<script>
    import { slide } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    let innerWidth;

    let open = false;

    export let columns = 1;

    
</script>

<svelte:window bind:innerWidth />

<div class="layout-picker">
    <button
        class="layout-button columns-{columns}"
        on:click={() => (open = !open)}
    >
        <div class="square" />
        <div class="square" />
        {#if columns > 1}
            <div class="square" />
            <div class="square" />
        {/if}
        {#if columns > 2}
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
        {/if}
        {#if columns === 4}
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
            <div class="square" />
        {/if}
    </button>
    {#if open}
        <div class="layout-picker-options" transition:slide={{duration: 200, easing: cubicInOut}}>
            {#if innerWidth < 1024}
                <button
                    class=" layout-button columns-1"
                    on:click={() => {
                        columns = 1;
                        open = false;
                    }}
                >
                    <div class="square" />
                    <div class="square" />
                </button>
            {/if}
            <button
                class=" layout-button columns-2"
                on:click={() => {
                    columns = 2;
                    open = false;
                }}
            >
                {#each Array(4) as _}
                    <div class="square" />
                {/each}
            </button>
            {#if innerWidth > 767}
                <button
                    class=" layout-button columns-3"
                    on:click={() => {
                        columns = 3;
                        open = false;
                    }}
                >
                    {#each Array(9) as _}
                        <div class="square" />
                    {/each}
                </button>
            {/if}
            {#if innerWidth > 1023}
                <button
                    class=" layout-button columns-4"
                    on:click={() => {
                        columns = 4;
                        open = false;
                    }}
                >
                    {#each Array(16) as _}
                        <div class="square" />
                    {/each}
                </button>
            {/if}
        </div>
    {/if}
</div>

