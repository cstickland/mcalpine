<?php

// wordpress uses this as the archive page for "posts"

get_header();
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/featured-insight-hero {"name":"mcalpine/featured-insight-hero","mode":"preview"} /-->'); ?>
    <?php if (have_posts()) :
        /* Start the Loop */
        while (have_posts()) :
            the_post();

            /*
                 * Include the Post-Type-specific template for the content.
                 * If you want to override this in a child theme, then include a file
                 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                 */
            the_title();
            the_permalink();

        endwhile;

        the_posts_navigation();

    endif;
    ?>

</main><!-- #main -->

<?php
get_footer();
