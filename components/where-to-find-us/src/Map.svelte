<script>
    let container;
    let map;
    let zoom = 13;
    let center = { lat: 55.861, lng: -4.258 };

    import { query, getData } from "./stores.js";

    import { onMount } from "svelte";

    let innerHeight;
    let markers = [];

    onMount(async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                center = { lat: latitude, lng: longitude };
            });
        }
        map = new google.maps.Map(container, {
            zoom,
            center,
        });
        markers = await getData(query);
        console.log(markers);
    });
</script>

<svelte:window bind:innerHeight />

<div
    class="full-screen"
    bind:this={container}
    style="height: {innerHeight - 60 + 'px'}"
/>

<style>
    .full-screen {
        width: 100vw;
        height: 100vh;
    }
</style>
