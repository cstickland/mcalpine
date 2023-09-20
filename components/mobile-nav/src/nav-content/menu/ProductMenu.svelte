<script>
    import { fade } from "svelte/transition";
    import { activeMenu, productCategories, version } from "../../stores.js";

    let categoryParentId = null;
    let categoryParentTitle = null;

    function resetParentCategories() {
        categoryParentId = null;
        categoryParentTitle = null;
    }

    function setParentCategories(id, title) {
        categoryParentId = id;
        categoryParentTitle = title;
    }

    let versionClass;

    if ($version == 1) {
        versionClass = "version-one";
    }
    if ($version == 2) {
        versionClass = "version-two";
    }
</script>

{#if categoryParentId == null}
    <div
        class="menu-container"
        in:fade={{ axis: "x", delay: 200, duration: 200 }}
        out:fade={{ axis: "x", duration: 200 }}
    >
        <div class="menu-title" on:click={() => activeMenu.set(0)} on:keydown>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-left"
                        ><rect
                            width="24"
                            height="24"
                            transform="rotate(90 12 12)"
                            opacity="0"
                        /><path
                            d="M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z"
                        /></g
                    ></g
                ></svg
            >
            {#if categoryParentTitle == null}
                <div>Products</div>
            {:else}
                <div>{categoryParentTitle}</div>
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
                                category.node.name
                            );
                        }}
                        on:keydown
                    >
                        <div>{category.node.name}</div>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-left"
                        ><rect
                            width="24"
                            height="24"
                            transform="rotate(90 12 12)"
                            opacity="0"
                        /><path
                            d="M13.36 17a1 1 0 0 1-.72-.31l-3.86-4a1 1 0 0 1 0-1.4l4-4a1 1 0 1 1 1.42 1.42L10.9 12l3.18 3.3a1 1 0 0 1 0 1.41 1 1 0 0 1-.72.29z"
                        /></g
                    ></g
                ></svg
            >
            {#if categoryParentTitle == null}
                <div>Products</div>
            {:else}
                <div>{categoryParentTitle}</div>
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
    }
    .menu-title {
        color: #5a5a5a;
        font-size: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: solid 1px #f4f4f4;
        font-weight: 700;
        padding: 1.125rem 1rem;
        cursor: pointer;
        svg {
            height: 1.5rem;

            path {
                fill: #5a5a5a;
            }
        }

        .spacer {
            width: 1.5rem;
        }
    }

    .category-list {
        max-height: calc(100% - 60px);
        overflow: scroll;
    }
    .category-item {
        font-size: 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        margin-bottom: 0;

        &.version-one {
            flex-direction: row;
            justify-content: space-between;
            color: $color__mcalpine-black;
            padding: 0 1.5rem;
            margin: 1rem;
            font-weight: 700;
            border-radius: 8px;
            background-color: #fafafa;
            background: transparent
                linear-gradient(112deg, #fafafa 0%, #7caef21f 100%) 0% 0%
                no-repeat padding-box;

            div {
                padding-left: 1.5rem;
            }

            img {
                height: 95px;
            }
        }

        &.version-two {
            flex-direction: row-reverse;
            justify-content: start;
            padding: 0.5rem 1rem;
            color: #878787;
            border-bottom: solid 1px #f4f4f4;

            .category-image-container {
                width: 45px;
                height: 47px;
                border-radius: 0.5rem;
                background-color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1.5rem;
                background: transparent
                    linear-gradient(336deg, #7caef255 0%, #7caef200 100%) 0% 0%
                    no-repeat padding-box;
            }

            img {
                height: 90%;
            }

            &:hover {
                background: transparent
                    linear-gradient(
                        270deg,
                        #ffffff 0%,
                        rgba(124, 174, 242, 0.0784313725) 100%
                    )
                    0% 0% no-repeat padding-box;
            }
        }
    }
</style>
