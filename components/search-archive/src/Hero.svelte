<script>
    export let searchTerm = "";
    export let totalResults = "";
</script>

<div class="search-hero-block animate">
    <div class="search-hero-content">
        <div class="search-hero__subtitle">You searched for:</div>
        <h1>{searchTerm}</h1>
        <div class="search-hero-text">
            <p>
                Your query returned
                <span class="search-hero__highlight">
                    {#if totalResults != ""}
                        <span>{@html totalResults}</span> results
                    {:else}
                        <div class="loading-total">
                            <div class="col-3">
                                <div class="snippet" data-title="dot-flashing">
                                    <div class="stage">
                                        <div class="dot-flashing" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        results
                    {/if}
                </span>.
            </p>
            <p>To search again, edit your query above.</p>
        </div>
    </div>
    <div class="search-hero-image-container" />
</div>

<style lang="scss">
    .loading-total {
        display: inline-flex;
        justify-content: space-between;
        width: 0.5rem;
        margin-left: 0.5rem;
        font-size: 20px;
    }
   

    @keyframes pulse {
        to {
            transform: translateY(-0.25rem);
        }
    }

    .dot-flashing {
        position: relative;
        width: 2px;
        height: 2px;
        border-radius: 50px;
        background-color: #e63128;
        color: #e63128;
        animation: dot-flashing 1s infinite linear alternate;
        animation-delay: 0.5s;
    }
    .dot-flashing::before,
    .dot-flashing::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
    }
    .dot-flashing::before {
        left: -4px;
        width: 2px;
        height: 2px;
        border-radius: 50px;
        background-color: #e63128;
        color: #e63128;
        animation: dot-flashing 1s infinite alternate;
        animation-delay: 0s;
    }
    .dot-flashing::after {
        left: 4px;
        width: 2px;
        height: 2px;
        border-radius: 50px;
        background-color: #e63128;
        color: #e63128;
        animation: dot-flashing 1s infinite alternate;
        animation-delay: 1s;
    }

    @keyframes dot-flashing {
        0% {
            background-color: #e63128;
        }
        50%,
        100% {
            background-color: #e6312833;
        }
    }
</style>
