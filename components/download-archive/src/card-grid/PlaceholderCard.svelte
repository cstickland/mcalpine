<script>
    import { fade } from "svelte/transition";
    import { cubicInOut, linear } from 'svelte/easing'

</script>

<li out:fade={{ duration: 500, easing: cubicInOut }} class="placeholder-download-card-container">
    <div class="download-card">
        <div class="download-card-image-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="image"
                        ><rect width="24" height="24" opacity="0" /><path
                            d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM6 5h12a1 1 0 0 1 1 1v8.36l-3.2-2.73a2.77 2.77 0 0 0-3.52 0L5 17.7V6a1 1 0 0 1 1-1z"
                        /><circle cx="8" cy="8.5" r="1.5" /></g
                    ></g
                ></svg
            >
        </div>
        <div class="placeholder-download-card-text-container">
            <div />
            <div />
        </div>
    </div>
    <div class="download-card-text-container text-container-small">
        <div />
        <div />
    </div>
    <div class="shine-container"></div>
</li>

<style lang="scss">
    .placeholder-download-card-container {
        aspect-ratio: 1;
        border: solid 1px #eaeaea;
        position:relative;
        transform-origin: top center;

        .shine-container {
            position: absolute;
            width:100%;
            height:100%;
            background: gray;
            top: 0;
            left: 0;
            background: linear-gradient(
            110deg,
            transparent 18%,
            #ffffff 38%,
            transparent 58%
        );
               background-size: 200% 100%;
        animation: 1.75s shine linear infinite;
        }

        .download-card {
            height:100%;
            display:flex;
            flex-direction: column;
            justify-content: space-between;
            .download-card-image-container {
                flex-grow: 1;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                svg {
                    height: 30%;
                    width: 30%;
                    * {
                        fill: #eaeaea;
                    }
                }
            }
        }
        .placeholder-download-card-text-container {
            height: 6.25rem;
            padding: 1.5rem;
            overflow: hidden;
            display:flex;
            flex-direction: column;
            justify-content: space-between;
            div {
                height: 1.125rem;
                width: 100%;
                background-color: #eaeaea;

                &:nth-of-type(2) {
                    width: 75%;
                }
            }
        }
    }
  @keyframes shine {
        to {
            background-position-x: -200%;
        }
    }
</style>
