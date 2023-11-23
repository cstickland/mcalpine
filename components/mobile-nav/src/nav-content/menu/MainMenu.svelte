<script>
    import { fade } from "svelte/transition";
    import { activeMenu, version, menuParentId, menuParentTitle } from "../../stores.js";
    import SocialLinks from "./SocialLinks.svelte";
    import MenuImageLinks from "./MenuImageLinks.svelte";
    import { onMount } from 'svelte'
    export let interests;
    export let navbar;
    let loading = true

     let parentIds = new Set();
    onMount(() =>{
        navbar.menuItems.nodes.forEach((item) => {
            if(item.parentId != null) {
                parentIds.add(item.parentId);
            }         
        })
        navbar.menuItems.nodes.forEach((item) => {
            if(parentIds.has(item.id)) {
               item.hasChildren = true;
            } else {
                item.hasChildren = false;
            }
        })
        loading = false;
    })
</script>

<div
    class="menu-container"
    in:fade={{ delay: 200, duration: 200 }}
    out:fade={{ duration: 200 }}
>
    <div>
        <div class="menu-item" on:click={() => activeMenu.set(1)} on:keydown>
            {interests.name}

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
        </div>
        <div class="menu-item" on:click={() => activeMenu.set(2)} on:keydown>
            Products

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
        </div>
        {#if !loading}
        {#each navbar.menuItems.nodes as link}
            {#if link.parentId == null && link.hasChildren == false}
                <a href={link.url} class="menu-item">{link.title}</a>
            {/if}
            {#if link.parentId == null && link.hasChildren == true}
                <div class="menu-item" on:click={() => {
                    menuParentId.set(link.id)
                    menuParentTitle.set(link.title)
                }} on:keydown>
                    <span>{link.title} </span>
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
                </div>
            {/if}
        {/each}
        {/if}
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
        align-items: center;
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
            height: 0.75rem;

            path {
                fill: $color__mcalpine-red;
            }
        }
    }
</style>
