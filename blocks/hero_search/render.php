<div <?php echo get_block_wrapper_attributes(['class' => 'search-hero-block animate']); ?>>
    <div class="search-hero-content">
        <div class="search-hero__subtitle">You searched for:</div>
        <h1><?php echo get_search_query(true); ?></h1>
        <div class="search-hero-text">
            <p>Your query returned
                <span class="search-hero__highlight">
                    (<?php global $wp_query;
                        echo $wp_query->found_posts;
                        ?>)
                    results
                </span>.
            </p>
            <p>To search again, edit you query above.</p>
        </div>
    </div>
    <div class="search-hero-image-container">
    </div>
</div>
