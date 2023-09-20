<script>
    let searchQuery = "";
    export let siteUrl = "";
    export let ajaxUrl = "";

    let selectedInterest = "";

    const action = "advancedSearch";

    import Results from "./Results.svelte";

    let results = {};

    async function getResults() {
        if (searchQuery == "") {
            results = {};
            return;
        }

        let formData = new FormData();
        formData.append("s", searchQuery);
        formData.append("action", action);

        const fetchPromise = await fetch(ajaxUrl, {
            method: "POST",
            body: formData,
        });

        const response = await fetchPromise.json();
        results = response;
    }
</script>

<form
    class="search-form"
    id="search-form"
    role="search"
    method="get"
    action={siteUrl}
>
    <select
        name="interest"
        class="select-interest"
        bind:value={selectedInterest}
    >
        <option value="" disabled selected hidden>Select Interest</option>
        <option value="specifier">Specifier</option>
        <option value="installer">Installer</option>
        <option value="merchant">Merchant</option>
        <option value="homeowner">Homeowner</option>
        <option value="international">International</option>
    </select>

    <div class="search-form__input">
        <span class="screen-reader-text">Search for:</span>
        <input
            type="search"
            bind:value={searchQuery}
            placeholder="Search a product name, SKU or term…"
            autocomplete="off"
            id="search-field"
            class="search-field"
            name="s"
            on:input={getResults}
        />
        {#if results?.products?.length > 0 || results?.other?.length > 0}
            <Results {results} searchTerm={searchQuery} />
        {/if}
    </div>
</form>

<style lang="scss">
    .search-form {
        height: 100%;
        width: 100%;
        display: flex;
        gap: 1.25rem;

        .select-interest {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background: #ffffff 0% 0% no-repeat padding-box;
            border: 1px solid #f4f4f4;
            border-radius: 8px;
            padding: 0 0.75rem;
            &:hover {
                box-shadow: inset 0px 0px 6px #0000000d, 0px 3px 6px #7caef24d;
                border: 1px solid #7caef2;
            }

            &:focus:active {
                box-shadow: 0px 3px 6px #7caef24d;
                border: 1px solid #7caef2;
            }
        }
        .search-form__input {
            height: 100%;
            width: 100%;
            position: relative;
            .search-field {
                background-color: #fff;
                border: 1px solid #f4f4f4;
                color: #222222;
                max-width: 740px;
                width: 100%;
                border-radius: 0.5rem;
                padding: 1rem 2rem;
                font-size: 1rem;
                line-height: 1;

                &:hover {
                    box-shadow: inset 0px 0px 6px #0000000d,
                        0px 3px 6px #7caef24d;
                    border: 1px solid #7caef2;
                    border-radius: 5px;
                }

                &:focus {
                    border-radius: 8px 8px 0px 0px;
                    outline: 0;
                }
            }
        }
    }
</style>
