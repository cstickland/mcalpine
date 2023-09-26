<?php
get_header();
?>

<main id="primary" class="site-main">
    <? $example1 = get_post_type_archive_link('post');
?>
    <a href="<? echo $example1 ?>">Archive
    </a>
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile; // End of the loop.
    ?>
</main>


<?php
get_footer();
