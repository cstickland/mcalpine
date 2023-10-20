<?php
/* Template Name: Faq */

get_header();
global $post;
$blocks = parse_blocks($post->post_content);
?>

<main id="primary" class="site-main">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
        the_posts_navigation();
    endif;
    ?>

</main><!-- #main -->

<?php
get_footer();
