<div id="search-container" class="search-container">
    <form class="search-form" id="search-form" role="search" method="get" action="<?php echo site_url() ?>">
        <div class="search-form__input">
            <span class="screen-reader-text">Search for:</span>
            <input type="search" placeholder="Search a product name, SKU or term…" autocomplete="off" id="search-field" class="search-field" name="s">
        </div>
        <input type="hidden" name="action" value="advancedSearch">
        <div class="results-container" id="results-container">
            <div class="search-results__section-title">
                Suggestions
            </div>
            <div id="search-results__suggestions"></div>
            <div class="search-results__section-title">
                Products
            </div>
            <div id="search-results__resources"></div>
            <div class="search-results__section-title">
                Other
            </div>
            <div id="search-results__other"></div>
            <input type="submit" id="search-submit" class="search-submit submit-btn" value="view all results">
        </div>
    </form>
</div>
