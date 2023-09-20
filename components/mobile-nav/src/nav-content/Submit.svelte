<script>
    import { version } from "../stores.js";
    export let form;
    function submitForm() {
        form.submit();
    }
    let versionClass = "";
    if ($version == 1) {
        versionClass = "submit-version-one";
    }

    if ($version == 2) {
        versionClass = "submit-version-two";
    }


    
</script>

<button
    type="button"
    id="search-submit"
    class="search-submit submit-btn {versionClass}"
    value="view all results"
    on:click={submitForm}
>
    {#if $version == 1}
        <div class="result-count" />
    {/if}
    <div class="view-all">View All Results</div>
    <div class="view-all">
        <div class="view-all-chevron">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                ><g data-name="Layer 2"
                    ><g data-name="chevron-right"
                        ><rect
                            width="24"
                            height="24"
                            transform="rotate(-90 12 12)"
                            opacity="0"
                        /><path
                            d="M10.5 17a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42L13.1 12 9.92 8.69a1 1 0 0 1 0-1.41 1 1 0 0 1 1.42 0l3.86 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-.7.32z"
                        /></g
                    ></g
                ></svg
            >
        </div>
    </div>
</button>

<style lang="scss">
    .search-submit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 3.25rem;
        text-align: start;
        outline: 0;
        color: #5a5a5a;
        padding: 0;
        padding-left: 35px;
        border: 0;

        border-top: solid 1px #f4f4f4;
        cursor: pointer;
        text-transform: capitalize;
        transition: background-position 0.3s ease-in-out;

        .result-count {
            font-size: 1rem;
            line-height: 1.125rem;
            letter-spacing: 0;
        }

        &.submit-version-one {
            background-color: #ffffff;
            background-size: 200% 100%;
            background-image: linear-gradient(90deg, white 50%, #222222 50%);
            .view-all {
                color: #222222;

                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1.75rem;

                .view-all-chevron {
                    background-color: #222222;
                    width: 3.25rem;
                    height: 3.25rem;
                    border-bottom: solid 1px #f4f4f4;
                    svg {
                        fill: #ffffff;
                    }
                }
            }
            &:hover {
                background-position: 100% 0;

                .result-count {
                    color: #ffffff;
                }

                .view-all {
                    color: #ffffff;
                }
            }
        }

        &.submit-version-two {
            padding-left: 1rem;
            background-color: #f4f4f4;

            .view-all {
                color: #e63128;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 1.75rem;

                .view-all-chevron {
                    width: 3.25rem;
                    height: 3.25rem;
                    border-bottom: solid 1px #f4f4f4;
                    svg {
                        fill: #e63128;
                    }
                }
            }

            &:active {
                background-color: #222222;

                .view-all {
                    color: #ffffff;

                    .view-all-chevron {
                        svg {
                            fill: #ffffff;
                        }
                    }
                }
            }
        }
    }
</style>
