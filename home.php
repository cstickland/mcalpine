<?php

// wordpress uses this as the archive page for "posts"
class Insight
{
    public $identifier;
    public $title;
    public $permalink;
    public $id;
    public $img;
    public $alt;
    public $columnWidth;
}

$insights = [];
get_header();
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/featured-insight-hero {"name":"mcalpine/featured-insight-hero","mode":"preview"} /-->'); ?>
    <ul id="insight-archive" class="insight-archive-container">
        <?php if (have_posts()) :
            /* Start the Loop */
            while (have_posts()) :
                the_post();

                $post_id = get_the_ID();
                $insight_image = get_the_post_thumbnail_url();
                $new_insight = new Insight();
                $new_insight->title = get_the_title();
                $new_insight->permalink = get_the_permalink();
                $category;
                foreach ((get_the_category()) as $cat) {
                    if ($cat->parent == 0) {
                        $category = $cat->cat_name;
                    }
                };
                $new_insight->identifier = $category;
                $new_insight->img = $insight_image;
                $new_insight->columnWidth = 1;
                $new_insight->id = $post_id;
                // $new_insight->columnWidth = get_field('column_width', get_the_ID()) ? (int)get_field('column_width', get_the_ID())  : 1;
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
