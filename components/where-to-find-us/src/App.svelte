<script>
    import Map from "./Map.svelte";
    import Locations from "./Locations.svelte";
    export let ready;
    export let apiKey;
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
</script>

<svelte:head>
    <script defer async {src}>
    </script>
</svelte:head>

{#if ready}
    <Locations />
    <Map />
{/if}
