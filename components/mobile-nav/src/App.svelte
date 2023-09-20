<script>
    import Controls from "./nav-controls/Controls.svelte";
    import Content from "./nav-content/Content.svelte";
    import { onMount } from "svelte";
    import {
        open,
        ajaxUrl,
        menus,
        getData,
        query,
        version,
        productCategories,
        facebook,
        twitter,
        instagram,
        linkedin,
        youtube,
        email
    } from "./stores.js";

    const graphQlUrl = "/graphql";

    onMount(async () => {
        await getData(graphQlUrl, menus, query, productCategories);
    });

    let form;
    export let siteUrl = "";
    export let ajaxUrlProp = "";
    export let versionProp = 1;

    export let facebookLink;
    facebook.set(facebookLink)
    export let twitterLink;
    twitter.set(twitterLink)
    export let instagramLink;
    instagram.set(instagramLink);
    export let linkedinLink;
    linkedin.set(linkedinLink);
    export let youtubeLink;
    youtube.set(youtubeLink);
    export let emailLink;
    email.set(emailLink);

    version.set(versionProp);
    ajaxUrl.set(ajaxUrlProp);
    let innerHeight;
</script>

<svelte:window bind:innerHeight />

<form
    method="get"
    action={siteUrl}
    role="search"
    style="height: {$open ? innerHeight + 'px' : '60px'}"
    on:submit|preventDefault
    bind:this={form}
>
    <Content {form} />
    <Controls />
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;

        transition: height 200ms ease-in-out;
    }
</style>
