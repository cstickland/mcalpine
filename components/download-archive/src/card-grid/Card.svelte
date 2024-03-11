<script>
    export let fileUrl;
    export let imageUrl = "";
    export let imageAlt = "";
    export let title;
    export let date;
    export let fileType;

    import PlaceholderImage from "./PlaceholderImage.svelte";
    import DownloadIcon from "./DownloadSvg.svelte";
    import { fade } from "svelte/transition";
    let downloaded = false;

    let fileTypeString = fileType?.toUpperCase() || ''

    function downloadFile(e) {
        if (downloaded === false) {
            downloaded = true;
            return;
        }
        e.preventDefault();
    }
</script>

<li in:fade class="download-card-container-query">
    <div class="download-card-container {downloaded ? 'downloaded' : ''}">
        <a
            class="download-card-desktop"
            href={fileUrl}
            download
            on:click={downloadFile}
        >
            <div class="download-card">
                <div class="download-card-image-container">
                    {#if imageUrl != ""}
                        <img
                            class="download-card-image"
                            src={imageUrl}
                            alt={imageAlt}
                        />
                    {:else}
                        <div class="download-card-image">
                            <PlaceholderImage />
                        </div>
                    {/if}
                </div>
                <div class="download-card-text-container">
                    <div class="download-card-text">
                        <h5>{title}</h5>
                        <div class="download-info-container">
                            <div>
                                {date
                                    .toLocaleDateString("en-GB")
                                    .replaceAll("/", ".")}
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
                                {fileTypeString}
                            </div>
                        </div>
                    </div>
                    <DownloadIcon />
                </div>
            </div>
        </a>
        <div class="download-started">
            <div class="download-card-image-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><g data-name="Layer 2"
                        ><g data-name="checkmark"
                            ><rect width="24" height="24" opacity="0" /><path
                                d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"
                            /></g
                        ></g
                    ></svg
                >
                Download Started
            </div>
            <div class="download-card-text-container">
                <div class="download-card-text">
                    <h5>{title}</h5>
                    <div class="download-info-container">
                        <div>
                            {date
                                .toLocaleDateString("en-GB")
                                .replaceAll("/", ".")}
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
                            {fileTypeString}
                        </div>
                    </div>
                </div>
                <DownloadIcon />
            </div>
        </div>
    </div>
    <div class="download-card-text-container text-container-small">
        <div class="download-card-text">
            <h5>{title}</h5>
            <div class="download-info-container">
                <div>
                    {date ? date.toLocaleDateString("en-GB").replaceAll("/", ".") : ''}
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
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
                    {fileTypeString}
                </div>
            </div>
        </div>
    </div>
</li>

<style lang="scss">
    @import "../colors.scss";
    .download-card-container-query {
        container-type: inline-size;
        container-name: download-card;
    }
    .download-card-text-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: end;
        display: flex;
        h5 {
            margin: 0;
            padding-bottom: 0.5rem;
        }
        svg {
            height: 1.125rem;
            margin-right: 0.75rem;
            * {
                fill: $color__mcalpine-red;
            }
        }

        .download-info-container {
            display: flex;
            padding-top: 1.5rem;
            align-items: center;
            gap: 1.75rem;

            div {
                display: flex;
                align-items: center;
                font-size: 0.875rem;
            }
        }
    }

    .download-card-container {
        position: relative;

        border: solid 1px #f4f4f4;
        &.downloaded {
            .download-started {
                display: flex;
            }
        }
        .download-card-desktop {
            display: block;
            cursor: pointer;
            text-decoration: none;
        }
        .download-card,
        .download-started {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            aspect-ratio: 1;
            gap: 2rem;
            padding: 1.875rem;

            .download-card-text-container {
                display: none;
            }

            .download-card-image-container {
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                aspect-ratio: 1;
                .download-card-image {
                    width: 80%;
                    height: 80%;
                    object-fit: contain;
                    margin: 0 auto;
                    margin-bottom: 1rem;
                }

                svg {
                    height: 1.5rem;
                    padding-right: 0.5rem;
                    * {
                        fill: #fff;
                    }
                }
            }
        }

        .download-card {
            color: $color__mcalpine-black;
        }
        .download-started {
            background-color: #e63128e3;
            color: #fff;
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            font-size: 1rem;

            .download-card-text-container {
                .download-info-container {
                    svg {
                        * {
                            fill: #fff;
                        }
                    }
                }
            }
        }
    }
    .download-card-container-query {
        .text-container-small {
            padding-top: 1.25rem;
            color: $color__mcalpine-black;
            .download-info-container {
                padding-top: 0 !important;
            }
        }

        &:hover {
            .text-container-small {
                color: $color__mcalpine-red;
            }
        }
    }

    @supports (container-type: inline-size) {
        @container download-card (min-width: 275px) {
            .text-container-small {
                display: none;
            }

            .download-card-container {
                .download-card {
                    padding: clamp(
                        1.563rem,
                        calc(1.114rem + 2.874cqw),
                        1.875rem
                    ) !important;
                    .download-card-text-container {
                        display: flex;
                        h5 {
                            font-size: clamp(
                                0.875rem,
                                0.25rem + 4cqw,
                                1.125rem
                            ) !important;
                        }
                    }
                    .download-card-image-container {
                        aspect-ratio: unset;
                        .download-card-image {
                            height: auto;
                            width: 40%;
                        }
                    }
                }
                .download-started {
                    font-size: 22px;
                }
            }
        }
        @container download-card (min-width: 350px) {
            .download-card-container {
                &:not(.downloaded):hover {
                    background: transparent
                        linear-gradient(180deg, #ffffff 0%, #f4f4f480 100%) 0%
                        0% no-repeat padding-box;
                    .download-card-desktop {
                        .download-card {
                            .download-card-text-container {
                                display: flex !important;
                                h5 {
                                    color: $color__mcalpine-red;
                                }
                            }
                        }
                    }
                }

                border: solid 1px #f4f4f4;
                .download-card {
                    padding: clamp(
                        1.563rem,
                        calc(1.114rem + 2.874cqw),
                        1.875rem
                    ) !important;
                    .download-card-text-container {
                        display: flex;
                        .download-info-container {
                            div {
                                font-size: clamp(
                                    0.875rem,
                                    0.243rem + 2.857cqw,
                                    1rem
                                ) !important;
                            }
                        }
                    }
                }
            }
        }

        @container download-card (min-width: 1400px) {
            .download-archive-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    }
</style>
