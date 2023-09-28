<?php

// wordpress uses this as the archive page for "posts"
class Insight
{
    public $identifier;
    public $title;
    public $permalink;
    public $img;
    public $alt;
    public $columnWidth;
}

$insights = [];
get_header();
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/featured-insight-hero {"name":"mcalpine/featured-insight-hero","mode":"preview"} /-->'); ?>
    <ul id="insight-archive">
        <?php if (have_posts()) :
            /* Start the Loop */
            while (have_posts()) :
                the_post();

                $post_id = get_the_ID();
                $insight_image = get_the_post_thumbnail_url();
                $product_categories = wp_get_object_terms($post_id, 'product_categories');

                foreach ($product_categories as $category) {
                    if ($category->parent == 0) {
                        $parent_category = $category->term_id;
                    } else {
                        $child_category = $category->term_id;
                    }
                }

                $new_insight = new Insight();
                $new_insight->title = get_the_title();
                $new_insight->permalink = get_the_permalink();
                $new_insight->alt = $alt;
                $new_insight->img = $insight_image;
                $new_insight->columnWidth = 1;
                $insights[] = $new_insight;
        ?>

                <li> <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>

        <?php
            endwhile;

            the_posts_navigation();

        endif;
        ?>
    </ul>
</main><!-- #main -->
<script>
    const insightArchiveContainer = document.getElementById('insight-archive');
    const allInsights = <?php echo json_encode($insights); ?>;
    insightArchiveContainer.innerHTML = '';

    new InsightArchive({
        target: insightArchiveContainer,
        props: {
            allInsights: allInsights,
        },
    })
</script>
<?php
get_footer();
