<script>
    import Submit from "./Submit.svelte";
    import Hamburger from "../nav-controls/Hamburger.svelte";
    import {
        results,
        highlightResults,
        searchQuery,
        version,
        ajaxUrl,
        action,
        open,
    } from "../stores.js";
    import { fade } from "svelte/transition";
    export let form;
    $: fetchedResults = $results;
    $: totalResults = $results?.products?.length + $results?.other?.length;
    $: openClass = $open ? "open" : "closed";

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
<div  class="menu-container"  in:fade={{ duration: 200, delay: 200 }}
    out:fade={{duration: 200}}
>
<div
    class="results-container show"
    id="results-container"
  >
    {#if $searchQuery.length > 0}
        <div class="search-results__section-title">
            <div class="result-title">Suggestions</div>
        </div>
        <div class="search-results__section-title">
            <div class="result-title">Products</div>
            {#if fetchedResults.products}
                {#if fetchedResults?.products.length > 0}
                    {#each fetchedResults?.products as product, i}
                        {#if i < 3}
                            <a
                                href={product?.permalink}
                                class="search-product-result"
                            >
                                <img
                                    height="58px"
                                    width="58px"
                                    src={product?.skus[0]?.product_images[0]
                                        ?.product_image}
                                    alt=""
                                    class="result-image"
                                />
                                <div>
                                    {@html highlightResults(
                                        $searchQuery,
                                        product?.name
                                    )}
                                </div>
                            </a>
                        {/if}
                    {/each}
                {:else}
                    <div>No Products Found</div>
                {/if}
            {/if}
        </div>

        <div class="search-results__section-title">
            {#if fetchedResults.other}
                {#if fetchedResults?.other.length > 0}
                    <div class="result-title">Other</div>
                    {#each fetchedResults?.other as other, i}
                        {#if i < 3}
                            <a
                                href={other?.permalink}
                                class="search-product-result other"
                            >
                                <div>
                                    {@html highlightResults(
                                        $searchQuery,
                                        other?.name
                                    )}
                                </div>
                                <div class="other-post-type">
                                    {#if other?.post_type == "post"}Article{:else if other?.post_type == "page"}Page{/if}
                                </div>
                            </a>
                        {/if}
                    {/each}
                {/if}
            {/if}
        </div>
        {#if $version == 1}
            <Submit {totalResults} {form} />
        {/if}
    {/if}
</div>
{#if $version == 2}
    <div
        class="version-two-input"
        in:fade={{ duration: 200, delay: 200 }}
        out:fade={{duration: 200}}
    >
        {#if $searchQuery.length > 0}
            <Submit {form} />
        {/if}
        <div class="input-container">
            <input
                type="text"
                name="s"
                bind:value={$searchQuery}
                on:input={getResults}
                placeholder="Search a product name, SKU or term…"
                autofocus
            />
            <Hamburger {openClass} position="input" />
        </div>
    </div>
{/if}
</div>
<style lang="scss">
    @import "../../../../sass/abstracts/variables/_colors.scss";
    
    .menu-container {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr min-content;
    }
    .results-container {
        display: flex;
        flex-direction: column;
        background-color: #ffffff;
        width: 100%;
        flex-grow: 1;
        min-height: 50vh;
        overflow-y: scroll;
        padding-top: 0.5rem;

        .search-results__section-title {
            display: flex;
            padding: 0;
            flex-direction: column;
            color: $color__mcalpine-red;
        }
        .search-product-result {
            display: flex;
            flex-direction: row;
            align-items: center;
            text-decoration: none;
            padding: 0.625rem 1rem;
            color: #222222;
            font-size: 1rem;
            border-bottom: solid 1px #f4f4f4;

            &.other {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .other-post-type {
                    border-radius: 40px;
                    background-color: $color__mcalpine-red;
                    color: #ffffff;
                    padding: 0.375rem 1rem;
                }
            }
            &:hover {
                background: transparent
                    linear-gradient(270deg, #ffffff 0%, #7caef214 100%) 0% 0%
                    no-repeat padding-box;
            }

            .result-image {
                width: 2.5rem;
                height: 2.5rem;
                aspect-ratio: 1;
                object-fit: cover;
                margin-right: 1.625em;
            }
        }

        .result-title {
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 22px;
            color: $color__mcalpine-red;
            padding-left: 1rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-bottom: solid 1px #f4f4f4;
        }
    }
    .version-two-input {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        grid-row-start: 2;
        .input-container {
            width: 100%;
            padding: 1.5rem 1rem 1rem 1rem;
            display: flex;
            flex-direction: row;
        }
        input {
            width: 100%;
            flex-grow: 1;
            border: 0;
            outline: 0;
            padding: 0;
            padding-bottom: 0.875rem;
            border-bottom: solid 1px #ffffff;
            &:focus {
                border-bottom: solid 1px #7caef2;
            }
        }
    }
</style>
