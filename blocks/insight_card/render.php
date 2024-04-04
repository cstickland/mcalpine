<?php

$insight_id = get_field('insight_id');

foreach ((get_the_category($insight_id)) as $cat) {
    if ($cat->parent == 0) {
        $category = $cat->cat_name;
    }
};
$identifier = $category;

if ($identifier == 'FAQ') {
    $link = get_site_url() . '/faq/?id=' . $insight_id;
} else {
    $link = get_the_permalink($insight_id);
}

?>

<a href="<?php echo get_the_permalink($insight_id); ?>" <?php echo get_block_wrapper_attributes(['class' => 'insight-card mobile-show ' . get_field('column_width')]); ?>>

    <div class="insight-card-text">
        <h6 class="insight-identifier"><?php echo $identifier; ?></h6>
        <h3 class="insight-card-title"><?php echo get_the_title($insight_id); ?></h3>
    </div>
    <div class="insight-card-image-container">
        <?php if (!empty(get_the_post_thumbnail_url($insight_id))) : ?>
            <img class="insight-card-background-image" src="<?php echo get_the_post_thumbnail_url($insight_id); ?>" alt="" />
        <?php endif; ?>
        <div class="insight-card-hover-gradient"></div>
    </div>
</a>
