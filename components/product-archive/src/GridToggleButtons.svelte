<script>
 export let gridStyle;
</script>


<button class="layout-button grid-layout-button" on:click={() => (gridStyle = true)}>

    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
</button>
<button class="layout-button row-layout-button" on:click={() => (gridStyle = false)}>
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
    <div class="square" />
</button>
