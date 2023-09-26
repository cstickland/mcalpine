<?php $featured_insight = get_field('featured_insight', 'option');

$image = get_the_post_thumbnail_url($featured_insight);
$thumbnail_id = get_post_thumbnail_id($featured_insight);
$alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
?>


<div <?php echo get_block_wrapper_attributes(['class' => 'featured-insight-hero-block']); ?>>
    <div class="insight-hero-gradient"></div>
    <div class="hero-title">
        <h1 class="hero-title-mobile"><?php the_field('featured_insight_block_title_mobile', 'option'); ?></h1>
        <h1 class="hero-title-desktop"><?php the_field('featured_insight_block_title_desktop', 'option'); ?></h1>
    </div>

    <div class="insight-hero-container">

        <div class="insight-hero-image-container">
            <img src="<?php echo $image; ?>" alt="<?php echo $alt; ?>">
        </div>
        <div class="insight-hero-post-content">
            <div class="read-time"><?php the_field('read_time', $featured_insight); ?> Minute Read</div>
            <h2><?php echo get_the_title($featured_insight); ?></h2>
            <p><?php echo get_the_excerpt($featured_insight); ?></p>
            <a class="featured-insight-link" href="<?php the_permalink($featured_insight); ?>"> Link </a>
        </div>
    </div>
</div>
