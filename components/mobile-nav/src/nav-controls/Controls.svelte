<script>
    import {
        open,
        searchOpen,
        searchQuery,
        results,
        version,
        openClassVersionTwo,
    } from "../stores.js";
    import { getResults, previousSuggestions } from "../search-stores.js";
    import Logo from "./Logo.svelte";
    import Hamburger from "./Hamburger.svelte";
    import SearchIcon from "./Search-Icon.svelte";
    import { fade } from "svelte/transition";
    let timer;

    $: openClassVersionOne = $open ? "open" : "closed";

    $: openClass = cycleHamburger();

    function cycleHamburger() {
        if ($version == 1) {
            if ($open) {
                return "open";
            } else {
                return "closed";
            }
        }

        if ($version == 2) {
            if ($open && !$searchOpen) {
                return "open";
            } else {
                return "closed";
            }
        }
    }

    searchQuery.subscribe(async (value) => {
        if (value == "") {
            results.set({});
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(async () => {
            const data = await getResults(value, previousSuggestions);
            results.set(data);
        }, 200);
    });
</script>

<div class="mobile-nav-controls {openClass}">
    {#if $version == 1}
        {#if !$searchOpen}
            <Logo />
        {:else}
            <input
                in:fade={{ axis: "x", delay: 200, duration: 200 }}
                out:fade={{ axis: "x", duration: 200 }}
                type="text"
                name="s"
                bind:value={$searchQuery}
                placeholder="Search a product name, SKU or term…"
                autofocus
                autocomplete="off"
            />
        {/if}
    {:else}
        <Logo />
    {/if}
    <div class="control-icons">
        <SearchIcon />
        {#if $version == 1}
            <Hamburger openClass={openClassVersionOne} position={"controls"} />
        {:else if $version == 2}
            <Hamburger position={"controls"} openClass={$openClassVersionTwo} />
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../variables.scss";

    .mobile-nav-controls {
        padding: 1.125rem;
        box-shadow: 0 3px 10px #0000000d;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 2;
        background-color: #ffffff;

        .control-icons {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
        }

        input {
            border: 0;
            flex-grow: 1;
            outline: 0;
            padding: 0;

            &:focus-visible {
                box-shadow: none;
            }
        }
    }
</style>
