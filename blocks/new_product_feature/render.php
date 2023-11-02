<?php
$link = get_field('link');
$subtitle = get_field('subtitle');
$title = get_field('title');
$message = get_field('message');
$image = get_field('image');
?>



<div <?php echo get_block_wrapper_attributes(['class' => 'featured-product']); ?>>
    <div class="featured-product-content">
        <div class="featured-product-image-container">

            <div class="featured-product-subtitle"><?php echo $subtitle; ?></div>
            <?php if ($image) :
            ?>
                <img class="featured-product-image" src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>">
            <?php endif; ?>
            <div class="featured-product-hash <?php if (get_field('text_alignment_desktop')) :
                                                    the_field('text_alignment_desktop');
                                                endif; ?> ">
                <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
            </div>
        </div>

        <div class="featured-product-text">
            <div class="featured-product-subtitle"><?php echo $subtitle; ?></div>
            <h2><?php echo $title; ?></h1>
                <div class="featured-product-link-container">
                    <p class="featured-product-message"><?php echo $message; ?></p>
                    <?php if ($link) {
                    ?>
                        <a class="btn btn-white btn-outline" href="<?php echo $link['url']; ?>"><?php echo $link['title']; ?></a>
                    <?php } ?>
                </div>

        </div>
    </div>
</div>
