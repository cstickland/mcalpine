<?php

get_header();

?>

<main id="primary" class="site-main">
    <h1>Hello</h1>
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_title();
            the_content();
        endwhile;
        the_posts_navigation();
    endif;
    ?>
</main><!-- #main -->
<style>

</style>
<?php
get_footer();
