<script>
    import { slide } from "svelte/transition";
    import { sortBy } from "../filters";

    let open = false;
    const sortByOptions = [
        { title: "Date (New to Old)", id: 1 },
        { title: "Date (Old to New)", id: 2 },
        { title: "Alphabetical (A-Z)", id: 3 },
        { title: "Alphabetical (Z-A)", id: 4 },
    ];
</script>

<div class="insight-archive-filters">
    <div class="insight-archive-filter-categories">
        <div
            class="dropdown-toggle"
            on:click={() => {
                open = !open;
            }}
            on:keydown={() => {
                open = !open;
            }}
        >
            <span>Sort By</span>
            {#if open}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
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
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="chevron-down"
                            ><rect width="24" height="24" opacity="0" /><path
                                d="M12 15.5a1 1 0 0 1-.71-.29l-4-4a1 1 0 1 1 1.42-1.42L12 13.1l3.3-3.18a1 1 0 1 1 1.38 1.44l-4 3.86a1 1 0 0 1-.68.28z"
                            /></g
                        ></g
                    ></svg
                >
            {/if}
        </div>
        {#if open}
            <ul
                class="insight-archive-filter-dropdown"
                transition:slide={{ duration: 200 }}
            >
                {#each sortByOptions as option}
                    <li on:keydown on:click={() => {
                        sortBy.set(option.id)
                    }}>
                        {option.title}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../colors.scss";
    .insight-archive-filters {
        display: flex;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        width: max-content;
        justify-self: end;
        .insight-archive-filter-categories {
            position: relative;

            .dropdown-toggle {
                display: flex;
                align-items: center;
                font-size: 1.125rem;
                color: #222222;
                padding-bottom: 0.25rem;
                border-bottom: solid 2px $color__mcalpine-black;
                cursor: pointer;
                gap: 3rem;

                padding: 0.75rem;
                svg {
                    width: 1.5rem;
                    margin-left: 1rem;
                    rect,
                    path {
                        fill: #222222;
                    }
                }
            }

            .insight-archive-filter-dropdown {
                margin: 0;
                list-style: none;
                font-size: 1.125rem;
                width: 100%;
                position: absolute;
                padding: 0;
               gap: 0; 
                background-color: white;
                z-index: 2;
                width: 100%;
                min-width: max-content;
                border-top: 0;
                border-radius: 0 0 8px 8px;
                color: $color__mcalpine-black;
                cursor: pointer;
                box-shadow: 0px 3px 6px rgba(124, 174, 242, 0.3019607843);
                overflow: hidden;
                li {
                    padding: 0.5rem 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    transition: padding 150ms ease-in-out;
                    font-size: 1.125rem;

                    &:hover {
                        padding-left: 0.625rem;
                        color: $color__mcalpine-red;
                        background: transparent
                            linear-gradient(
                                75deg,
                                #ffffff 0%,
                                rgba(124, 174, 242, 0.2509803922) 100%
                            )
                            0% 0% no-repeat padding-box;
                    }
                }
            }
        }
    }
</style>
