<?php
get_header();
?>

<main id="primary" class="site-main">

    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            echo do_blocks('<!-- wp:acf/hero-product {"name":"acf/hero-product","data":{},"mode":"preview"} /-->');
            the_content();
            $tags =  get_the_tags();
            foreach ($tags as $tag) {
                echo get_tag_link($tag);
            }
        endwhile;
        the_posts_navigation();
    endif;
    ?>

</main><!-- #main -->
<style>

</style>
<?php
get_footer();
