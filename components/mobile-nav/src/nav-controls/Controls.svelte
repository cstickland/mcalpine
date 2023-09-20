<script>
    import {
        open,
        searchOpen,
        searchQuery,
        ajaxUrl,
        action,
        results,
        version,
        openClassVersionTwo
    } from "../stores.js";
    import Logo from "./Logo.svelte";
    import Hamburger from "./Hamburger.svelte";
    import SearchIcon from "./Search-Icon.svelte";

    $: openClassVersionOne = $open ? "open" : "closed";


    $: openClass =  cycleHamburger();

    function cycleHamburger()  {
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
    };

    import { fade } from "svelte/transition";

    async function getResults() {
        if (searchQuery == "") {
            results.set({});
            return;
        }

        let formData = new FormData();
        formData.append("s", $searchQuery);
        formData.append("action", action);

        const fetchPromise = await fetch($ajaxUrl, {
            method: "POST",
            body: formData,
        });

        const response = await fetchPromise.json();
        results.set(response);
    }
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
                on:input={getResults}
                placeholder="Search a product name, SKU or term…"
                autofocus
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
            <Hamburger  position={"controls"} openClass={$openClassVersionTwo} />
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../variables.scss";

    .mobile-nav-controls {
        padding: 1.125rem;
        box-shadow: 0 -3px 10px #0000000d;

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
        }
    }
</style>
