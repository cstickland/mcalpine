<script>
    import { fade } from "svelte/transition";
    import { activeMenu, productCategories } from "../../stores.js";

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

    let versionClass;
</script>

{#if categoryParentId == null}
    <div
        class="menu-container"
        in:fade={{ axis: "x", delay: 200, duration: 200 }}
        out:fade={{ axis: "x", duration: 200 }}
    >
        <div class="menu-title" on:click={() => activeMenu.set(0)} on:keydown>
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
            {#each $productCategories as category}
                {#if category.node.parentId == categoryParentId}
                    <div
                        class="category-item {versionClass}"
                        on:click={() => {
                            setParentCategories(
                                category.node.id,
                                category.node.name,
                                category.node.link
                            );
                        }}
                        on:keydown
                    >
                        <div>{category.node.name}</div>
                        <div class="background-gradient" />
                        <div class="category-image-container">
                            {#if category.node.customFields.categoryImage}
                                <img
                                    src={category.node.customFields
                                        .categoryImage.sourceUrl}
                                    alt={category.node.customFields
                                        .categoryImage.sourceUrl}
                                    loading="lazy"
                                />
                            {:else}
                                <img
                                    src="http://mcalpine2.local/wp-content/uploads/2023/06/wdu-1asuk-73x150.png"
                                    alt=""
                                    loading="lazy"
                                />
                            {/if}
                        </div>
                    </div>
                {/if}
            {/each}
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
            {#each $productCategories as category}
                {#if category.node.parentId == categoryParentId}
                    <a
                        href={category.node.link}
                        class="category-item {versionClass}"
                    >
                        <div>{category.node.name}</div>
                        <div class="background-gradient" />
                        <div class="category-image-container">
                            {#if category.node.customFields.categoryImage}
                                <img
                                    src={category.node.customFields
                                        .categoryImage.sourceUrl}
                                    alt={category.node.customFields
                                        .categoryImage.sourceUrl}
                                    loading="lazy"
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
                {/if}
            {/each}
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
        overflow: scroll;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(332px, 1fr));
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
        justify-content: space-between;
        color: $color__mcalpine-black;
        padding: 0 1.25rem;
        font-weight: 700;
        border-radius: 8px;
        background-color: #fafafa;
        transition: background 0.5s linear;
        overflow: hidden;

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

        img {
            height: 146px;
        }
    }
</style>
