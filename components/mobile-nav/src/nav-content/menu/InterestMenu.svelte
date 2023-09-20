<script>
    import { fade } from "svelte/transition";
    import { activeMenu } from "../../stores.js";
    export let interests;
</script>

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

        <div>{interests.name}</div>
        <div class="spacer" />
    </div>
    {#each interests.menuItems.nodes as interest}
        <a class="menu-item" href={interest.url}>{interest.title}</a>
    {/each}
</div>

<style lang="scss">
    @import "../../../../../sass/abstracts/variables/_colors.scss";

    .menu-container {
        display: flex;
        flex-direction: column;
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
    }
</style>
