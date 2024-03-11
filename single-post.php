<?php

get_header();

function reading_time()
{
    global $post;
    $content = get_post_field('post_content', $post->ID);
    $word_count = str_word_count(strip_tags($content));
    $readingtime = ceil($word_count / 200);

    $timer = " Minute Read";
    $totalreadingtime = $readingtime . $timer;

    return $totalreadingtime;
}
?>

<main id="primary" class="post-main">
    <?php echo do_blocks('<!-- wp:mcalpine/post-hero {"name":"mcalpine/post-hero","mode":"preview"} /-->'); ?>
    <div class="post-content-container">
        <section class="post-content">
            <?php
            if (have_posts()) :
                while (have_posts()) :
                    the_post();
                    the_content();
            ?>
                    <div class="follow-text">Follow us on <a href="<?php the_field('facebook', 'option'); ?>">Facebook</a>, <a href="<?php the_field('twitter', 'option'); ?>">Twitter</a> or <a href="<?php the_field('linkedin', 'option'); ?>">LinkedIn</a>. If you have questions about this article please email: your@email.co.uk.</div>
                    <div class="related-articles">
                        <h5>Read Similar Articles</h5>
                        <div class="related-categories">
                            <?php echo the_category(); ?>
                        </div>
                    </div>
            <?php
                endwhile;
                the_posts_navigation();
            endif;
            ?>
        </section>
        <?php echo do_blocks('<!-- wp:mcalpine/top-articles {"name":"mcalpine/top-articles","data":{},"mode":"preview"} /-->'); ?>
    </div>
</main><!-- #main -->

<style>
    .post-content {
        max-width: 820px;
        margin: 0 auto;
    }

    .post-content ul {
        list-style-type: square;
        margin-left: 0;
        padding-left: 1rem;
    }

    .post-content ul li {
        padding-left: 1rem;

    }
</style>
<?php
get_footer();
