<?php

get_header();

?>

<main id="primary" class="site-main">
    <section class="search-hero">
        <div class="search-hero__subtitle">You searched for:</div>
        <h1><?php echo get_search_query(true); ?></h1>
        <div>
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
    </section>
    <ul>
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                the_title();
            endwhile;
            the_posts_navigation();
        endif;
        ?>
    </ul>
</main><!-- #main -->

<?php
get_footer();
