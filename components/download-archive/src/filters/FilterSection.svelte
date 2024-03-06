<script>
    import { slide } from "svelte/transition";
    export let title = "title";
    export let items = [];
    export let filters = new Set();
    let openCategory = false;

    function toggleFilter(id) {
        if ($filters.has(id)) {
            if ($filters.delete(id)) {
                filters.set($filters);
            }
            return;
        }
        filters.set($filters.add(id));
    }
</script>

<ul class="product-archive-filters-section">
    <button
        class="filter-category-title"
        on:click={() => {
            openCategory = !openCategory;
        }}
    >
        <h5>{title}</h5>
        {#if openCategory}
            <span
                ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-up"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M16 14.5a1 1 0 0 1-.71-.29L12 10.9l-3.3 3.18a1 1 0 0 1-1.41 0 1 1 0 0 1 0-1.42l4-3.86a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.42 1 1 0 0 1-.69.28z"
                            /></g
                        ></g
                    ></svg
                >
            </span>
        {:else}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g data-name="Layer 2">
                        <g data-name="chevron-down">
                            <rect width="24" height="24" opacity="0" />
                            <path
                                d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                            />
                        </g>
                    </g>
                </svg>
            </span>
        {/if}
    </button>
    {#if openCategory}
        <div
            class="product-archive-category-list"
            transition:slide={{ axis: "y", duration: 300 }}
        >
            {#each [...items] as item}
                <li
                    on:click={() => {
                        toggleFilter(item.id);
                    }}
                    on:keydown
                >
                    <div
                        class="category-toggle {$filters.has(item.id)
                            ? 'checked'
                            : 'unchecked'}"
                    >
                        <div class="toggle-circle" />
                    </div>
                    {@html item.name}
                </li>
            {/each}
        </div>
    {/if}
</ul>

<style lang="scss">
    @import "../colors.scss";

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        .product-archive-category-list {
            max-height: 465px;
            overflow-y: scroll;
            scrollbar-color: #e63128 #ffffff;
            scrollbar-width: auto;
        }
        li {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.25rem;
            background-color: #c4cad114;
            color: $color__mcalpine-black;
            padding: 0.875rem 1.5rem;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 100ms ease-in-out;
            &:hover,
            &:active {
                background-color: #c4cad133;
            }
        }
    }
    .product-archive-filters-section {
        .filter-category-title {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            background-color: transparent;
            color: $color__mcalpine-black;
            border: 0;
            outline: 0;
            justify-content: space-between;
            padding-bottom: 1rem;
            cursor: pointer;
            padding: 1.25rem;

            h5 {
                margin: 0;
            }

            span {
                display: inline-flex;
                align-items: center;
            }
            svg {
                width: 2rem;

                path,
                rect {
                    fill: $color__mcalpine-red;
                }
            }
        }
    }
</style>
