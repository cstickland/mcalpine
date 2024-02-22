<script>
    import { fade, slide } from "svelte/transition";
</script>

<div class="placeholder-card" out:fade={{ duration: 200 }}>
    <div class="placeholder-link" />
    <div class="placeholder-sku-count" />
    <div class="placeholder-card-link" />
    <svg
        class="placeholder-image"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        ><g data-name="Layer 2"
            ><g data-name="image"
                ><rect width="24" height="24" opacity="0" /><path
                    d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM6 5h12a1 1 0 0 1 1 1v8.36l-3.2-2.73a2.77 2.77 0 0 0-3.52 0L5 17.7V6a1 1 0 0 1 1-1z"
                /><circle cx="8" cy="8.5" r="1.5" /></g
            ></g
        ></svg
    >
</div>

<style lang="scss">
    .placeholder-card {
        width: 100%;
        aspect-ratio: 1;
        background: linear-gradient(
            100deg,
            #efefef 8%,
            #f4f4f4 28%,
            #efefef 53%
        );
        background-size: 200% 100%;
        animation: 1.25s shine linear infinite;
        border: solid 1px #f4f4f4;
        display: grid;
        grid-template-columns: 15% 60% 25%;
        grid-template-rows: 65% 10% 25%;
        grid-template-areas:
            "image image count"
            "image image ."
            "name name name";
        align-content: center;
        padding: 1.5rem;

        .placeholder-card-link {
            background-color: #ffffff;
            grid-area: name;
        }

        .placeholder-sku-count {
            border-radius: 50px;
            background-color: #ffffff;
            grid-area: count;
            height: 1.75rem;
            width: 3.5rem;
            margin-left: auto;
        }

        .placeholder-image {
            align-content: center;
            grid-area: 1 / 1 / span 2 / span 3;
            height: 90%;
            width: 100%;
            margin-top: 5%;
        }
        .placeholder-image * {
            fill: #ffffff;
        }
    }

    @keyframes shine {
        to {
            background-position-x: -200%;
        }
    }
</style>
