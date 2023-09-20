<script>
    import { fade } from "svelte/transition";
    import { activeMenu, version } from "../../stores.js";
    import SocialLinks from "./SocialLinks.svelte";
    import MenuImageLinks from "./MenuImageLinks.svelte";
    export let interests;
    export let navbar;
</script>

<div
    class="menu-container"
    in:fade={{ delay: 200, duration: 200 }}
    out:fade={{ duration: 200 }}
>
    <div>
        <div class="menu-item" on:click={() => activeMenu.set(1)} on:keydown>
            {interests.name}

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-right"
                        ><rect
                            width="24"
                            height="24"
                            transform="rotate(-90 12 12)"
                            opacity="0"
                        /><path
                            d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"
                        /></g
                    ></g
                ></svg
            >
        </div>
        <div class="menu-item" on:click={() => activeMenu.set(2)} on:keydown>
            Products

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-right"
                        ><rect
                            width="24"
                            height="24"
                            transform="rotate(-90 12 12)"
                            opacity="0"
                        /><path
                            d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"
                        /></g
                    ></g
                ></svg
            >
        </div>
        {#each navbar.menuItems.nodes as link}
            <a href={link.url} class="menu-item">{link.title}</a>
        {/each}
    </div>
    <div class="version-container">
        {#if $version == 1}
            <SocialLinks />
        {:else if $version == 2}
            <MenuImageLinks />
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../../../../../sass/abstracts/variables/_colors.scss";

    .menu-container {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: auto 1fr;
        overflow-y: scroll;
    }

    .version-container {
        flex-grow: 1;
        display: flex;
        width: 100%;
        grid-row-start: 2;
    }
    .menu-item {
        font-size: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: $color__mcalpine-red;
        padding: 1.125rem 1rem;
        cursor: pointer;
        text-decoration: none;
        border-bottom: solid 1px #f4f4f4;
        font-weight: 700;
        &:hover {
            background: transparent
                linear-gradient(270deg, #ffffff 0%, #7caef214 100%) 0% 0%
                no-repeat padding-box;
        }
        svg {
            height: 1.5rem;

            path {
                fill: $color__mcalpine-red;
            }
        }
    }
</style>
