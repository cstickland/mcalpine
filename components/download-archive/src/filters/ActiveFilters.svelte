<script>
    import { allActiveFilters } from "../filters.js";
</script>

<ul class="active-filters">
    {#each [...$allActiveFilters] as filter}
        <li
            on:keydown
            on:click={() => {
                if ($allActiveFilters.delete(filter)) {
                    allActiveFilters.set($allActiveFilters);
                }
            }}
        >
            {filter.name}
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="close"
                            ><rect
                                width="24"
                                height="24"
                                transform="rotate(180 12 12)"
                                opacity="0"
                            /><path
                                d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"
                            /></g
                        ></g
                    ></svg
                >
            </span>
        </li>
    {/each}
</ul>

<style lang="scss">
    @import "../colors.scss";

    ul {
        grid-area: active;
        li {
        height: min-content;
        border-radius: 50px;
        border-color: $color__mcalpine-grey;
        padding: 0.375rem 1.5rem;
        }
    }
</style>
