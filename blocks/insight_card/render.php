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

<div <?php echo get_block_wrapper_attributes(['class' => 'insight-card mobile-show ' . get_field('column_width')]); ?>>

    <div class="insight-card-text">
        <h6 class="insight-identifier"><?php echo $identifier; ?></h6>
        <h3 class="insight-card-title"><?php echo get_the_title($insight_id); ?></h3>
    </div>
    <div class="insight-card-image-container">
        <img class="insight-card-background-image" src="<?php echo get_the_post_thumbnail_url($insight_id); ?>" alt="" />
        <div class="insight-card-hover-gradient"></div>
    </div>
    <div class="insight-card-link">
        <a href="<?php echo $link; ?>">
            <span>View Resource</span>
            <div class="insight-link-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                </svg>
            </div>
        </a>
    </div>
</div>
