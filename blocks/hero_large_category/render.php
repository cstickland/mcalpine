<?php

$category = get_queried_object();
?>

<div <?php echo get_block_wrapper_attributes(['class' => 'large-hero-category-block']); ?>>

    <div class="large-hero-gradient"></div>
    <div class="large-hero-container">

        <div class="hero-title">
            <div class="large-hero-breadcrumbs">
                <a href="<?php echo get_site_url(); ?>">Home</a>
                <?php if (get_field('breadcrumb_middle_link')) : ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                    <?php
                    $link = get_field('breadcrumb_middle_link');
                    if ($link) : ?>
                        <a href="<?php echo esc_url($link['url']); ?>"><?php echo esc_html($link['title']); ?></a>
                    <?php endif; ?>
                <?php endif; ?>
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                </svg>
                <div class="breadcrumb-end">
                    <?php echo $category->name; ?>
                </div>
            </div>
        </div>
        <div class="large-hero-image-container">
            <?php $image = get_field('category_hero_image', $category);
            if (!empty($image)) :
                $image_alt = $image['alt'];
                $image_url = $image['url'];

            ?>

                <img class="background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>">
            <?php endif; ?>
            <?php if (get_field('show_overflow_image', $category)) { ?>
                <?php $image = get_field('overflow_image', $category);
                $image_alt = $image['alt'];
                $image_url = $image['url'];

                if (!empty($image)) : ?>
                    <img class="overflow-image" style="height: <?php the_field('overflow_image_height', $category); ?>%; left: <?php the_field('overflow_image_horizontal_position', $category); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                <?php endif; ?>

            <?php } ?>

        </div>
        <div class="large-hero-post-content">
            <h2><?php echo $category->name; ?></h2>
            <div><?php the_field('hero_message', $category); ?></div>
        </div>
        <div class="large-hatching">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
</div>
<div id="hero-skip"></div>
