<script>
    import { slide, fade } from "svelte/transition";

    import { filters } from "./stores.js";

    export let categories;
    let open = false;
    const categoriesArray = [...categories];
</script>


