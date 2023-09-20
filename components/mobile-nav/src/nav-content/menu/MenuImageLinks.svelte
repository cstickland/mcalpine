<script>
    import App from "../../App.svelte";

</script>

<div class="menu-image-container">
    <a
        href="/"
        class="image-link white text-bottom"
        style="background-image: url('http://mcalpine2.local/wp-content/uploads/2023/09/coatbridge_manual_assembly.jpg');"
    >
        <p>UK’s First Chrome 3+ Brassware!</p>
    </a>
    <a
        href="/"
        class="image-link black"
        style="background-image: url('http://mcalpine2.local/wp-content/uploads/2023/09/McAlpine-Mactun-Tundish-Website-Carousel.jpg');"
    >
        <p>20,000 Tradespeople Can’t Be Wrong!</p>
    </a>
    <a
        href="/"
        class="image-link black"
        style="background-image: url('http://mcalpine2.local/wp-content/uploads/2023/09/McAlpine-Mactun-Tundish-Website-Carousel.jpg');"
    >
        <p>20,000 Tradespeople Can’t Be Wrong!</p>
    </a>
</div>

<style lang="scss">
    .menu-image-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: scroll;
        width: 100%;
        padding: 2rem 1.125rem;
        overflow-y: scroll;

        .image-link {
            text-decoration: none;
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 1.5rem 1rem;
            height: 10rem;
            background-size: cover;
            border-radius: 0.5rem;
            background-color: #f8f8f8;

            box-shadow: 0.5rem 1rem 2rem #7caef214;
            cursor: pointer;

            p {
                font-size: 1.125rem;
                line-height: 1.5rem;
                font-weight: 700;
                max-width: 10.5rem;
                margin: 0;
            }
            &.white {
                color: #ffffff;
                background: transparent
                    linear-gradient(178deg, #f4f4f400 0%, #22222222 100%) 0% 0%
                    no-repeat padding-box;
            }

            &.black {
                color: #222222;
                background-color: white;
            }

            &.text-bottom {
                justify-content: flex-end;
            }
        }
    }
</style>
