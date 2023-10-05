<script>
    import { postsPerPage } from './stores.js';
</script>

<input type="number" bind:value={$postsPerPage} min=1 max=144/>

