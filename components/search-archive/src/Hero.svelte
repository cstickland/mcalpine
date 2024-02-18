<script>
 export let searchTerm = "";
 export let totalResults = '';
</script>

<div class='search-hero-block animate'>
    <div class="search-hero-content">
        <div class="search-hero__subtitle">You searched for:</div>
        <h1>{searchTerm}</h1>
        <div class="search-hero-text">
            <p>Your query returned
                <span class="search-hero__highlight">
                    { totalResults } results
                </span>.
            </p>
            <p>To search again, edit you query above.</p>
        </div>
    </div>
    <div class="search-hero-image-container">
    </div>
</div>
