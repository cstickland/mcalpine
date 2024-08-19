<script>
    import { activeSku, product } from "./stores.js";
    import { slide } from "svelte/transition";
    import DownloadSvg from "./DownloadSvg.svelte";

    let open = false;
    let accordionContainer;
</script>

{#if $product?.skus && $product?.skus.length > 0}
    {#each $product.skus as productSku, i}
        {#if i === $activeSku}
            {#if productSku.product_installation_instructions || productSku.product_technical_drawing || productSku.downloads}
                <div class="accordion" bind:this={accordionContainer}>
                    <div
                        class="accordion-question-container"
                        on:click={() => {
                            open = !open;
                        }}
                        on:keydown
                    >
                        <h5 class="accordion-question">Downloads</h5>

                        <div class="accordion-toggle-icon">
                            <div class="vertical-line" />
                            <div class="horizontal-line" />
                        </div>
                    </div>
                    {#if open}
                        <div class="accordion-answer" transition:slide>
                            <div class="product-instructions-container">
                                {#if productSku.product_installation_instructions}
                                    <div class="download">
                                        <a
                                            href={productSku.product_installation_instructions}
                                            download
                                            >Instructions
                                            <div>
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        ><g data-name="Layer 2"
                                                            ><g
                                                                data-name="file-text"
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
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        ><g data-name="Layer 2"
                                                            ><g
                                                                data-name="file-text"
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
                                                    {productSku.product_installation_instructions

                                                        .split(".")
                                                        .pop()}</span
                                                >
                                                <DownloadSvg />
                                            </div>
                                        </a>
                                    </div>
                                {/if}
                                {#if productSku.product_technical_drawing}
                                    <div class="download">
                                        <a
                                            href={productSku.product_technical_drawing}
                                            download
                                            >Technical Drawing
                                            <div>
                                                <span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        ><g data-name="Layer 2"
                                                            ><g
                                                                data-name="file-text"
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
                                                    {productSku.product_technical_drawing
                                                        .split(".")
                                                        .pop()}</span
                                                >
                                                <DownloadSvg />
                                            </div>
                                        </a>
                                    </div>
                                {/if}
                                {#if productSku.downloads}
                                    {#each productSku.downloads as download}
                                        <div class="download">
                                            <a href={download.download_file}>
                                                {download.download_title}
                                                <div>
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            ><g
                                                                data-name="Layer 2"
                                                                ><g
                                                                    data-name="file-text"
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
                                                        {download.download_file
                                                            .split(".")
                                                            .pop()}</span
                                                    >
                                                    <DownloadSvg />
                                                </div>
                                            </a>
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        {/if}
    {/each}
{/if}
