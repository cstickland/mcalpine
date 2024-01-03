<script>
    import { imageLinks } from '../../stores.js';

</script>


<div class="menu-image-container">
    {#if $imageLinks && $imageLinks.length > 0}
    {#each $imageLinks as link}
    <a
        href={link.Url}
        class="image-link {link.textColor} {link.textAlignement}"
        style={`background-image: url('${link.backgroundImage.sourceUrl}');`}
    >
        <p>{link.text}</p>
    </a>
    {/each}
    {/if}
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
