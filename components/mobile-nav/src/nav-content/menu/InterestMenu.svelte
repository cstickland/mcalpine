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
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13.922"
            height="16.245"
            viewBox="0 0 13.922 16.245"
            ><path
                d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z"
                fill="#fff"
            /></svg
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
        align-items: center;
        border-bottom: solid 1px #f4f4f4;
        font-weight: 700;
        padding: 1.125rem 1rem;
        cursor: pointer;
        svg {
        transform: rotate(180deg);
            height: 0.75rem;

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
