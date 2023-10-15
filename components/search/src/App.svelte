<script>
    let searchQuery = "";
    export let siteUrl = "";
    export let ajaxUrl = "";

    const action = "advancedSearch";

    import Results from "./Results.svelte";
    import { onMount } from "svelte";
    import { slide } from 'svelte/transition';
    import { menuQuery, getData } from "./stores.js";

    let results = {};
    let menu = {};
    let interestsOpen = false;
    async function getResults() {
        if (searchQuery == "") {
            results = {};
            return;
        }

        let formData = new FormData();
        formData.append("s", searchQuery);
        formData.append("action", action);

        const fetchPromise = await fetch(ajaxUrl, {
            method: "POST",
            body: formData,
        });

        const response = await fetchPromise.json();
        results = response;
    }

    onMount(async () => {
        let fetchMenu = await getData(menuQuery);

        menu = fetchMenu.data.menus.edges[0].node;
    });
</script>

<form
    class="search-form"
    id="search-form"
    role="search"
    method="get"
    action={siteUrl}
>
    <div
        name="interest"
        class="select-interest {interestsOpen ? 'open' : 'closed'}"
        on:click={() => {
            interestsOpen = !interestsOpen;
        }}
        on:keydown
    >
        <div class="interest-title">
           Select Interest 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-down"
                        ><rect width="24" height="24" opacity="0" /><path
                            d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                        /></g
                    ></g
                ></svg
            >
        </div>
        {#if interestsOpen}
            <div class="interest-links" transition:slide={{duration: 200}}>
                {#if menu?.menuItems?.nodes}
                    {#each menu?.menuItems?.nodes as item}
                        <a href={item.url}>{item.label}</a>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>

    <div class="search-form__input">
        <span class="screen-reader-text">Search for:</span>
        <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search a product name, SKU or term…"
            autocomplete="off"
            id="search-field"
            class="search-field"
            name="s"
            on:input={getResults}
        />
        {#if results?.products?.length > 0 || results?.other?.length > 0}
            <Results {results} searchTerm={searchQuery} />
        {/if}
    </div>
</form>

<style lang="scss">
    .search-form {
        height: 100%;
        width: 100%;
        display: flex;
        gap: 1.25rem;

        .select-interest {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: #ffffff 0% 0% no-repeat padding-box;
            border-radius: 8px 8px 0 0;
            padding: 0 0.75rem;
            position: relative;
            width: min-content;
            border: solid 1px transparent;
            border-bottom: solid 1px #f4f4f4;
            
            &:hover, &.open {
                box-shadow: inset 0px 0px 6px #0000000d, 0px 3px 6px #7caef24d;
                border: 1px solid #7caef2;
            }

            &:focus:active {
                box-shadow: 0px 3px 6px #7caef24d;
                border: 1px solid #7caef2;
            }
            .interest-title {
                height: 100%;
                white-space: nowrap;
                display: flex;
                align-items: center;
                cursor: pointer;

                svg {
                    width: 1.5rem;
                    margin-left: 1.5rem;

                    rect, path {
                    fill: #e63128;
                    }
                }
            }
            .interest-links {
                position: absolute;
                width: calc(100% + 2px);
                top: 100;
                left: -1px;
                background: #ffffff 0% 0% no-repeat padding-box;
                border-radius: 0 0 8px 8px;
                box-shadow: 0px 3px 6px #7caef24d;
                border: 1px solid #7caef2;
                border-top: 0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                a {
                text-decoration: none;
                color: #5a5a5a;
                padding: 0.5rem 0.75rem;
                transition: padding 0.2s ease-in-out;

                &:hover {
                    color: #e63128;
                    background: transparent linear-gradient(75deg, #FFFFFF 0%, #7CAEF240 100%) 0% 0% no-repeat padding-box;
                    padding-left: 0.625rem;
                }
                }
            }
        }

        .search-form__input {
            height: 100%;
            width: 100%;
            position: relative;
            .search-field {
                background-color: #fff;
                border: 1px solid #f4f4f4;
                color: #222222;
                max-width: 740px;
                width: 100%;
                border-radius: 0.5rem;
                padding: 0.75rem 2rem;
                font-size: 1rem;
                line-height: 1;

                &:hover {
                    box-shadow: inset 0px 0px 6px #0000000d,
                        0px 3px 6px #7caef24d;
                    border: 1px solid #7caef2;
                    border-radius: 5px;
                }

                &:focus {
                    border-radius: 8px 8px 0px 0px;
                    outline: 0;
                }
            }
        }
    }
</style>
