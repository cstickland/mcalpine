<script>
    let searchQuery = "";
    export let siteUrl = "";


    import Results from "./Results.svelte";
    import { onMount } from "svelte";
    import { slide } from 'svelte/transition';
    import { menuQuery, getData, previousSuggestions } from "./stores.js";
    import { getResults } from "./functions.js";

    let results = {};
    let menu = {};
    let interestsOpen = false;
    
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
<div>
                    <a href='/' class='site-logo'>
                        <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 699.73 114.15">
                            <defs>
                                <style>
                                    .cls-1 {
                                        fill: #e63228;
                                        stroke-width: 0px;
                                    }
                                </style>
                            </defs>
                            <g id="Layer_1-2">
                                <g id="McAlpine_Logo_-_New">
                                    <rect class="cls-1" x="465.55" width="36.42" height="114.15" />
                                    <polygon class="cls-1" points="662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55" />
                                    <polygon class="cls-1" points="346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0" />
                                    <polygon class="cls-1" points="576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83" />
                                    <path class="cls-1" d="m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z" />
                                    <path class="cls-1" d="m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z" />
                                    <polygon class="cls-1" points="125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0" />
                                    <path class="cls-1" d="m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z" />
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
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
            on:input={async () => {results = await getResults(searchQuery, previousSuggestions);}}
        />
        {#if results?.data != null || results?.other?.length > 0}
            <Results bind:results={results} bind:searchTerm={searchQuery} />
        {/if}
    </div>
    <div></div>
    <div></div>
</form>

<style lang="scss">
    .search-form {
        height: 100%;
        width: 100%;
        display: flex;
        gap: 1.25rem;
        justify-content: space-between;

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
            max-width: 740px;
            .search-field {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg data-name='Layer 2'%3E%3Cg data-name='search'%3E%3Crect width='24' height='24' opacity='0' fill='%23e63128'/%3E%3Cpath fill='%23e63128' d='M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
                background-repeat: no-repeat;
                background-position: 98% center;
                background-size: 1.75rem;
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
