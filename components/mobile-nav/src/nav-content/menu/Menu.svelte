<script>
    import { menus, activeMenu, navBarMenu } from "../../stores.js";
    import MainMenu from "./MainMenu.svelte";
    import InterestsMenu from "./InterestMenu.svelte";
    import ProductMenu from "./ProductMenu.svelte";
    import { fade } from "svelte/transition";
    // import ProductMenuTwo from "./ProductMenuTwo.svelte";

    let interests;

    $menus.forEach((menu) => {
        if (menu.name == "Interest") {
            interests = menu;
        }

        if (menu.name == "Navbar") {
            navBarMenu.set(menu);
        }
    });
</script>

<div
    class="menu-container"
    in:fade={{ duration: 200, delay: 200 }}
    out:fade={{ duration: 200 }}
>
    {#if $activeMenu == 0}
        <MainMenu {interests} navbar={$navBarMenu} />
    {:else if $activeMenu == 1}
        <InterestsMenu {interests} />
    {:else if $activeMenu == 2}
        <ProductMenu />
    {/if}
</div>

<style lang="scss">
    .menu-container {
        height: 100%;
    }
</style>
