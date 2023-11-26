<script>
    import Submit from "./Submit.svelte";
    import Hamburger from "../nav-controls/Hamburger.svelte";
    import {
        results,
        highlightResults,
        searchQuery,
        version,
        open,
    } from "../stores.js";
    import { fade } from "svelte/transition";
    export let form;
    $: totalResults = $results?.products?.length + $results?.other?.length;
    $: openClass = $open ? "open" : "closed";

</script>
<div  class="menu-container"  in:fade={{ duration: 200, delay: 200 }}
    out:fade={{duration: 200}}
>
<div
    class="results-container show"
    id="results-container"
  >
    {#if $searchQuery.length > 0}
        {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}
            <div class="search-results__section-title">
                <div class="result-title">Suggestions</div>
                {#each $results?.data?.productCategories as category, i}
                    {#if i < 3 && $searchQuery != category}
                        <div
                            class="search-product-result"
                            on:keydown
                            on:click={async () => {
                                searchQuery.set(category);
                            }}
                        >
                            {@html highlightResults($searchQuery, category)}
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
                <div class="search-results__section-title">
            <div class="result-title">Products</div>
            {#if $results?.data?.products?.nodes?.length > 0}
                {#each $results?.data?.products?.nodes as product, i}
                    {#if i < 3}
                        <a href={product?.link} class="search-product-result">
                            <img
                                height="58px"
                                width="58px"
                                src={product?.customFields2?.skus[0]
                                    ?.productImages[0]?.productImage
                                    ?.mediaItemUrl}
                                alt=""
                                class="result-image"
                            />
                            <div class="c-red search-product-sku-count">
                                {product?.customFields2?.skus.length}
                                {#if product?.customFields2?.skus.length > 1}
                                    Skus
                                {:else}Sku{/if}
                            </div>
                            <div>
                                {@html highlightResults(
                                    $searchQuery,
                                    product?.title
                                )}
                            </div>
                        </a>
                    {/if}
                {/each}
            {:else}
                <div class="search-product-result">No Products Found</div>
            {/if}
        </div>
        {#if $results?.data?.other != null && $results?.data?.other?.length > 0}
            <div class="search-results__section-title">
                <div class="result-title">Other Results</div>
                {#if $results?.data?.other}
                    {#each $results?.data?.other as other, i}
                        {#if i < 3}
                            <a
                                href={other?.permalink}
                                class="search-product-result other"
                            >
                                <div>
                                    {@html highlightResults(
                                        $searchQuery,
                                        other?.title
                                    )}
                                </div>
                                <div class="other-post-type">
                                    {#if other?.postType == "post"}Article{:else if other?.postType == "page"}Page{/if}
                                </div>
                            </a>
                        {/if}
                    {/each}
                {:else}
                    <div>No other pages found</div>
                {/if}
            </div>
        {/if}        {#if $version == 1}
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

            .search-product-sku-count {
                padding-right: 1rem;
            }

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
