<?php
/* Template Name: Faq Template */

get_header();
global $post;
$blocks = parse_blocks($post->post_content);
?>

<main id="primary" class="site-main">
    <section class="faq-links">
        <h4 class="scroll-to">Scroll To Queries:</h4>
        <?php
        foreach ($blocks as $block) {
            if ($block['blockName'] === 'create-block/faq') {
                echo "<a href='#query-" . str_replace(' ', '_', $block['attrs']['data']['title']) . "'>" . $block['attrs']['data']['title'] . "</a>";
            }
        }
        ?>
    </section>
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
