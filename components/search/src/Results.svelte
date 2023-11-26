<script>
    import Submit from "./Submit.svelte";
    import { highlightResults } from "./functions";
    import { results, searchQuery } from "./stores.js";

    $: totalResults = $results?.data?.products?.nodes?.length + $results.data.other.length;
</script>

{#if $searchQuery.length > 0}
    <div class="results-container show" id="results-container">
        {#if $results?.data?.productCategories?.length > 0 && $results?.data?.productCategories[0] != $searchQuery}
            <div class="search-results__section-title">
                <div class="result-title">Suggestions</div>
                {#each $results?.data?.productCategories as category, i}
                    {#if i < 3 && $searchQuery != category}
                        <div
                            class="suggestion"
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
            {#if $results?.data?.products?.nodes.length > 0}
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
                <div class="suggestion">No Products Found</div>
            {/if}
        </div>
        {#if $results?.data?.other != null && $results?.data?.other?.length > 0}
            <div class="search-results__section-title">
                <div class="result-title">Other</div>
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
        {/if}
        <div id="search-results__other" />
        <Submit {totalResults} />
    </div>
{/if}

<style lang="scss">
    @import "../../../sass/abstracts/variables/_colors.scss";

    .results-container {
        display: block;
        background-color: #ffffff;
        z-index: 10;
        position: absolute;
        top: calc(100% - 4px);
        width: 100%;
        max-width: 740px;
        box-shadow: 0px 20px 60px #00000014;
        min-height: 50vh;
        padding-top: 1.75em;
        padding-bottom: 4rem;
        border: 1px solid #f4f4f4;
        border-radius: 0px 0px 0.5rem 0.5rem;

        .search-results__section-title {
            padding-bottom: 1.375rem;
            display: flex;
            flex-direction: column;
            .suggestion {
                padding: 0.625rem 2rem;
                color: #5a5a5a;
                cursor: pointer;

                &:hover {
                    background: transparent
                        linear-gradient(270deg, #ffffff 0%, #7caef214 100%) 0%
                        0% no-repeat padding-box;
                }
            }
        }
        .search-product-result {
            display: flex;
            flex-direction: row;
            align-items: center;
            text-decoration: none;
            padding: 1rem 2rem;
            color: #222222;

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
                width: 3.5rem;
                height: 3.5rem;
                aspect-ratio: 1;
                object-fit: cover;
                margin-right: 1.625em;
            }

            .search-product-sku-count {
                margin-right: 1.5rem;
            }
        }

        .result-title {
            font-size: 1.25rem;
            font-weight: bold;
            line-height: 22px;
            color: #5a5a5a;
            margin-bottom: 1.5rem;
            padding-left: 2rem;
        }
    }
</style>
