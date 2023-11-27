<script>
 export let gridStyle;

 let innerWidth;
</script>

<svelte:window bind:innerWidth={innerWidth} />
{#if innerWidth < 650}
<button class="layout-button grid-layout-button-mobile" on:click={() => (gridStyle = !gridStyle)}>

    <div class="square" />
    <div class="square" />
</button>
<!-- {:else} -->
<!-- <button class="layout-button grid-layout-button" on:click={() => (gridStyle = true)}> -->
<!---->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!-- </button> -->
<!-- <button class="layout-button row-layout-button" on:click={() => (gridStyle = false)}> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!--     <div class="square" /> -->
<!-- </button> -->
{/if}
