<script>
    import { fade } from "svelte/transition";

    export let productCategories;
    export let activeMenu = 0;

    let categoryParentId = null;
    let categoryParentTitle = null;
    let categoryParentLink = null;

    function resetParentCategories() {
        categoryParentId = null;
        categoryParentTitle = null;
        categoryParentLink = null;
    }

    function setParentCategories(id, title, link) {
        categoryParentId = id;
        categoryParentTitle = title;
        categoryParentLink = link;
    }

    // let versionClass;
</script>

{#if categoryParentId == null}
    <div
        class="menu-container"
        in:fade={{ axis: "x", delay: 200, duration: 200 }}
        out:fade={{ axis: "x", duration: 200 }}
    >
        <div class="menu-title" on:click={() => activeMenu = 0} on:keydown>
            {#if categoryParentTitle == null}
                <div>Product Categories</div>
            {:else}
                <div>
                    Product Categories > <span>{categoryParentTitle}</span>
                </div>
            {/if}
            <div class="spacer" />
        </div>
        <div class="category-list">
            {#if [...productCategories] && [...productCategories].length > 0}
                {#each [...productCategories] as category}
                        <div
                            class="category-item"
                            on:click={() => {
                                setParentCategories(
                                    category?.id,
                                    category?.name,
                                    category?.link
                                );
                            }}
                            on:keydown
                        >
                            <div>{category.name}</div>
                            <div class="background-gradient-container"><div class="background-gradient" /></div>
                            <div class="category-image-container">
                                {#if category?.customFields?.categoryImage}
                                    <img
                                        src={category?.customFields
                                            ?.categoryImage?.sourceUrl}
                                        alt={category?.customFields
                                            ?.categoryImage?.sourceUrl}
                                        loading="lazy"

                                        style={`height: ${category?.customFields?.categoryImageHeight}%;`}
                                    />
                                {:else}
                                    <img
                                        src="http://mcalpine2.local/wp-content/uploads/2023/06/wdu-1asuk-73x150.png"
                                        alt=""
                                        loading="lazy"
                                        style={`height: ${category?.customFields?.categoryImageHeight}%`}
                                    />
                                {/if}
                            </div>
                        </div>
                {/each}
            {/if}
        </div>
    </div>
{:else}
    <div
        class="menu-container"
        in:fade={{ axis: "x", delay: 200, duration: 200 }}
        out:fade={{ axis: "x", duration: 200 }}
    >
        <div class="menu-title" on:click={resetParentCategories} on:keydown>
            {#if categoryParentTitle == null}
                <div>Product Categories</div>
            {:else}
                <div>
                    Product Categories >
                    <a href={categoryParentLink} class="category-parent-link">
                        {categoryParentTitle}
                    </a>
                </div>
            {/if}
            <div class="spacer" />
        </div>
        <div class="category-list">
            {#if [...productCategories] && [...productCategories].length > 0}
                {#each [...productCategories] as category}
                    {#if category?.id == categoryParentId}
                        {#each category?.children?.edges as child}
                        <a
                            href={child?.node?.link}
                            class="category-item"
                        >
                            <div>{child?.node?.name}</div>
                            <div class="background-gradient-container"><div class="background-gradient" /></div>
                            <div class="category-image-container">
                                {#if child?.node?.customFields?.categoryImage}
                                    <img
                                        src={child?.node?.customFields
                                            ?.categoryImage?.sourceUrl}
                                        alt={category?.node?.customFields
                                            ?.categoryImage?.sourceUrl}
                                        loading="lazy"

                                        style={`height: ${child?.customFields?.categoryImageHeight}%`}
                                    />
                                {:else}
                                    <img
                                        src="http://mcalpine2.local/wp-content/uploads/2023/06/wdu-1asuk-73x150.png"
                                        alt=""
                                        loading="lazy"
                                    />
                                {/if}
                            </div>
                        </a>
                        {/each}
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    @import "../../../../../sass/abstracts/variables/_colors.scss";

    .menu-container {
        height: 100%;
        padding: 0 2.5rem;
    }
    .menu-title {
        color: #222222;
        font-size: 1.125rem;
        display: flex;
        flex-direction: row;
        font-weight: 700;
        padding-bottom: 3.5rem;
        cursor: pointer;

        span {
            color: $color__mcalpine-red;
        }

        .spacer {
            width: 1.5rem;
        }
    }

    .category-parent-link {
        color: $color__mcalpine-red;
        text-decoration: none;

        &:hover {
            color: $color__mcalpine-black;
        }
    }
    .category-list {
        max-height: calc(100% - 60px);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(332px, 480px));
        gap: 2rem;
    }
    .category-item {
        font-size: 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        margin-bottom: 0;
        position: relative;
        flex-direction: row;
        max-width: 480px;
        justify-content: space-between;
        color: $color__mcalpine-black;
        padding: 0 1.25rem;
        font-weight: 700;
        border-radius: 8px;
        background-color: #fafafa;
        transition: background 0.5s linear;
        .background-gradient-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height:100%;
            overflow: hidden;
            border-radius: 0.5rem;
            z-index: 1;
        }
        .background-gradient {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 70%;
            background: transparent
                linear-gradient(309deg, #7caef232 0%, #7caef200 100%) 0% 0%
                no-repeat padding-box;
            z-index: 1;
            transition: all 0.2s ease-in-out;
        }
        &:hover {
            .background-gradient {
                left: 0;
                background: transparent
                    linear-gradient(309deg, #e6312812 0%, #7caef200 100%) 0% 0%
                    no-repeat padding-box;
                z-index: 1;
            }
        }
        .category-image-container {
            height:100%;
            display:flex;
            align-items: center;
            width: max-content;
            max-width: 40%;
            z-index:2;

            img {
                object-fit: contain;
                width:auto;
            }
        }
          }
</style>
