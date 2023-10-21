<script>
    import { markers } from "./stores.js";
</script>

<div class="locations-container">
    {#each $markers as marker}
        <h5>{marker.title}</h5>
        {#if marker.location.streetNumber}
            <p>{marker.location.streetNumber}</p>
        {/if}
        {#if marker.location.streetName}
            <p>{marker.location.streetName}</p>
        {/if}
        <p>
            {#if marker.location.postCode}
                <span>{marker.location.postCode}, </span>{/if}
             {marker.location.state}
        </p>
        {#if marker.phoneNumber}
            <p>{marker.phoneNumber}</p>
        {/if}
    {/each}
</div>
