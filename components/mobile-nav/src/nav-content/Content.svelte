<script>
    import Results  from './Results.svelte';
    import Menu from './menu/Menu.svelte';
    import SubMenu from './menu/SubMenu.svelte';
    import { open, searchOpen, menuParentId } from "../stores.js";
    import { slide } from "svelte/transition";

    export let form
    export const menus = {}
</script>

{#if $open}
    <div
        class="nav-content-container"
        in:slide={{ axis: "y", duration: 300 }}
        out:slide={{ axis: "y", duration: 300 }}
    >
        {#if $searchOpen}
            <Results {form} />
        {:else}
            {#if $menuParentId == ''}
                <Menu />
           {:else}
                <SubMenu /> 
            {/if}
        {/if}
    </div>
{/if}

<style lang="scss">
    .nav-content-container {
        background-color: #ffffff;
        width: 100%;
        flex-grow: 1;
        max-height: 100%;
        overflow: hidden;
    

    }
</style>
