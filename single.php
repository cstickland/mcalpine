<?php

get_header();

?>

<main id="primary" class="site-main">

    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_title();
            the_content();
    ?>
            <?php if (have_rows('product_images')) :
                while (have_rows('product_images')) : the_row(); ?>
                    <img class="product-image" src="<?php the_sub_field('product_image'); ?>" />

    <?php
                endwhile;
            endif;
        endwhile;
        the_posts_navigation();
    endif;
    ?>

</main><!-- #main -->
<style>

</style>
<?php
get_footer();
