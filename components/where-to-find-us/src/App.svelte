<script>
	import Map from './Map.svelte';
	export let ready;
    export let apiKey;
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`

</script>

<svelte:head>
	<script defer async
	src={src}>
	</script>
</svelte:head>


{ #if ready }
<Map/>
{ /if }
