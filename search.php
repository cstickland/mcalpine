<?php

get_header();

?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/search-hero -->'); ?>
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
