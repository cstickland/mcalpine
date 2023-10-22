<script>

    let container;
    let center = { lat: 55.861, lng: -4.258 };

    export let map;

    import { query, getData, initMap, initMarker, markers } from "./stores.js";

    import { onMount } from "svelte";

    let innerHeight;

    onMount(async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                center = { lat: latitude, lng: longitude };
            });
        }
        const response = await getData(query);
        markers.set(response.data.themeGeneralSettings.themeSettings.mapLocations);
        console.log($markers)
        map = initMap(container, center, $markers);
    });
</script>

<svelte:window bind:innerHeight />

<div
    class="full-screen"
    bind:this={container}
    style="height: {innerHeight - 60 + 'px'}; max-height: 1080px;"
/>

<style>
    .full-screen {
        width: 100vw;
        height: 100vh;
    }
</style>
