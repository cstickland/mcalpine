<script>
    export let fileUrl;
    export let imageUrl = "";
    export let imageAlt = "";
    export let title;
    export let message;
    export let date;
    export let fileType;
    export let categories;

    import Download from "./DownloadSvg.svelte";
</script>

<li class="download-card-container">
    <div class="download-card-desktop" href={fileUrl} download>
        <div class="download-card">
            {#if imageUrl != ""}
                <img
                    class="download-card-image"
                    src={imageUrl}
                    alt={imageAlt}
                />
            {:else}
                <div class="download-card-image" />
            {/if}
            <div class="download-card-text-container">
                <div class="download-card-text">
                    <h5>{title}</h5>
                    <div class="download-card-message">
                        {#if message}
                            {message}
                        {/if}
                    </div>
                    <div class="download-info-container">
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><g data-name="Layer 2"
                                    ><g data-name="calendar"
                                        ><rect
                                            width="24"
                                            height="24"
                                            opacity="0"
                                        /><path
                                            d="M18 4h-1V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM8 17a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm8 0h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm3-6H5V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h1a1 1 0 0 1 1 1z"
                                        /></g
                                    ></g
                                ></svg
                            >
                            {date.toLocaleDateString("en-GB")}
                        </div>
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><g data-name="Layer 2"
                                    ><g data-name="file-text"
                                        ><rect
                                            width="24"
                                            height="24"
                                            opacity="0"
                                        /><path
                                            d="M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM9 12h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm6 6H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm-.29-10a.79.79 0 0 1-.71-.85V4l3.74 4z"
                                        /></g
                                    ></g
                                ></svg
                            >
                            {fileType}
                        </div>
                    </div>
                </div>
                <div class="download-description" />
                <a class="download-link-container" href={fileUrl} download>
                    <p>Download</p>
                    <div class="download-icon">
                        <Download />
                    </div>
                </a>
            </div>
        </div>
    </div>
    <div class="download-card-mobile" href={fileUrl} download>
        <div class="download-card">
            <div class="download-image-text">
                {#if imageUrl != ""}
                    <img
                        class="download-card-image"
                        src={imageUrl}
                        alt={imageAlt}
                    />
                {:else}
                    <div class="download-card-image" />
                {/if}
                <div class="download-card-text">
                    <h5>{title}</h5>
                    <div class="download-card-message">
                        {#if message}
                            {message}
                        {/if}
                    </div>
                </div>
            </div>
            <div class="download-card-text-container">
                <div class="download-info-container">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><g data-name="Layer 2"
                                ><g data-name="calendar"
                                    ><rect
                                        width="24"
                                        height="24"
                                        opacity="0"
                                    /><path
                                        d="M18 4h-1V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zM8 17a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm8 0h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm3-6H5V7a1 1 0 0 1 1-1h1v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h1a1 1 0 0 1 1 1z"
                                    /></g
                                ></g
                            ></svg
                        >
                        {date.toLocaleDateString("en-GB")}
                    </div>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            ><g data-name="Layer 2"
                                ><g data-name="file-text"
                                    ><rect
                                        width="24"
                                        height="24"
                                        opacity="0"
                                    /><path
                                        d="M19.74 7.33l-4.44-5a1 1 0 0 0-.74-.33h-8A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V8a1 1 0 0 0-.26-.67zM9 12h3a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2zm6 6H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm-.29-10a.79.79 0 0 1-.71-.85V4l3.74 4z"
                                    /></g
                                ></g
                            ></svg
                        >
                        {fileType}
                    </div>
                </div>

                <a class="download-link-container" href={fileUrl} download>
                    <p>Download</p>
                    <div class="download-icon">
                        <Download />
                    </div>
                </a>
            </div>
        </div>
    </div>
</li>

<style lang="scss">
    .download-card-container {
        @import "./colors.scss";
        border: solid 1px #f4f4f4;

        .download-card-mobile {
            padding: 1rem;
            display: flex;
            flex-direction: column;

            .download-image-text {
                display: flex;
                gap: 1rem;
                img {
                    aspect-ratio: 219/310;
                    width: calc(50% - 0.5rem);
                }
                .download-card-text {
                    width: calc(50% - 0.5rem);

                    h5 {
                        color: $color__mcalpine-red;
                    }
                }
                padding-bottom: 1rem;
                border-bottom: solid 1px #f4f4f4;
                margin-bottom: 1rem;
            }

            .download-info-container {
                display: flex;
                gap: 1.25rem;
                div {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    svg {
                        width: 2rem;
                    }
                }
            }

            .download-link-container {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                width: 100%;
                background-color: $color__mcalpine-red;
                text-decoration: none;
                color: #fff;
                transition: all 0.2s ease-in-out;
                margin-top: 1rem;

                &:hover {
                    background-color: #eb5a53;
                }
                .download-icon {
                    width: 1.5rem;
                    height: min-content;
                    display: flex;
                    align-items: center;

                    svg {
                        width: 1.5rem !important;
                        * {
                            fill: #fff;
                        }
                    }
                }
            }
        }

        .download-card-desktop {
            padding: 1rem 0 0 1rem;

            cursor: pointer;
            display: none;

            &:hover {
                background: transparent
                    linear-gradient(231deg, #7caef214 0%, #7caef200 100%) 0% 0%
                    no-repeat padding-box;

                .download-link-container {
                    .download-icon {
                        transform: translateX(0);
                    }
                    p {
                        opacity: 1;
                    }
                }
            }
            .download-card {
                display: flex;
                gap: 2rem;
                .download-card-image {
                    width: 40%;
                    aspect-ratio: 219/310;
                    margin-bottom: 1rem;
                }

                .download-card-text-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: calc(60% - 2rem);
                    h5 {
                        color: $color__mcalpine-red;
                        margin: 0;
                        margin-top: 10px;
                        padding-bottom: 0.5rem;

                        padding-right: 1rem;
                    }
                    .download-card-message {
                        padding-right: 1rem;
                    }

                    .download-info-container {
                        display: flex;
                        padding-top: 1.5rem;
                        align-items: center;
                        gap: 1.75rem;

                        svg {
                            width: 2rem;
                            margin-right: 0.75rem;
                            * {
                                fill: $color__mcalpine-black;
                            }
                        }
                        div {
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            .download-link-container {
                display: flex;
                justify-content: end;
                align-items: center;
                color: $color__mcalpine-black;
                text-decoration: none;
                gap: 1rem;
                overflow: hidden;

                p {
                    margin: 0;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .download-icon {
                    transform: translateX(4rem);
                    width: 56px;
                    height: 56px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: $color__mcalpine-red;
                    transition: all 0.3s ease-in-out;
                }
            }
        }
    }

    @media only screen and (min-width: $desktop) {
        .download-card-container {
            border: 0;
            .download-card-desktop {
                display: block;
            }
            .download-card-mobile {
                display: none;
            }
        }
    }
</style>
