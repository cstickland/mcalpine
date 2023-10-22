<script>
    import { markers } from "./stores.js";
    import { fade } from "svelte/transition";
    
    export let map;

    let currentMarkers = [];
    let searchTerm = "";

    $: if (searchTerm != "") {
        currentMarkers = [];
        [...$markers].forEach((marker) => {
            if (marker.title) {
                if (marker.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                    currentMarkers.push(marker);
                }
            }
        });
    } else {
        currentMarkers = [...$markers];
    }
</script>

<div class="locations-container">
    <h2>Find Your Local Stockist</h2>
    <input type="text" bind:value={searchTerm} />
    <ul class="locations" transition:fade>
        {#each currentMarkers as marker}
            <li class="location" on:click={() => {
                map.panTo({lat: marker.location.latitude, lng: marker.location.longitude })
                map.setZoom(16)
            }} on:keydown>
                <h5>{marker.title}</h5>
                <p>
                {#if marker.location.streetNumber}
                    <span>{marker.location.streetNumber}</span>
                {/if}
                {#if marker.location.streetName}
                    <span>{marker.location.streetName}</span>
                {/if}
                </p>
                <p>
                    {#if marker.location.postCode}
                        <span>{marker.location.postCode}, </span>{/if}
                    {marker.location.state}
                </p>
                {#if marker.phoneNumber}
                    <p>{marker.phoneNumber}</p>
                {/if}
            </li>
        {/each}
    </ul>
</div>
