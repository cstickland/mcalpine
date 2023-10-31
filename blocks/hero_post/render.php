<?php

$image = get_the_post_thumbnail_url();
$image_alt = '';

global $post;
$author_id = get_post_field('post_author', $post->ID);
$display_name = get_the_author_meta('display_name', $author_id);
?>

<div <?php echo get_block_wrapper_attributes(['class' => 'post-hero-block']); ?>>
    <div class="large-hero-gradient"></div>
    <div class="large-hero-container">

        <div class="hero-title">
            <h1 class="hero-title-mobile"><?php the_title(); ?></h1>
            <h1 class="hero-title-desktop"><?php the_title(); ?></h1>
        </div>
        <div class="large-hero-image-container">

            <img src="<?php echo $image; ?>" alt="<?php echo $image_alt; ?>">
        </div>
        <div class="large-hero-post-content">
            <div class="author-details">By <?php echo $display_name; ?></div>
            <div class="post-date"><?php echo human_time_diff(get_post_time('U', $post->ID)); ?> Ago</div>
            <div class="read-time"><?php echo reading_time(); ?></div>
        </div>
        <div class="large-hatching">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
</div>
