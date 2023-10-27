<div <?php echo get_block_wrapper_attributes(['class' => 'large-hero-block']); ?>>
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
                    <?php the_title(); ?>
                </div>
            </div>
            <h1 class="hero-title-mobile"><?php the_field('title'); ?></h1>
            <h1 class="hero-title-desktop"><?php the_field('title'); ?></h1>
        </div>
        <div class="large-hero-image-container">
            <?php $image = get_field('background_image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) : ?>

                <img src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>">
            <?php endif; ?>
        </div>
        <div class="large-hero-post-content">
            <p><?php the_field('text'); ?></p>
            <a class="large-link" href="#hero-skip">
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                </svg>
            </a>
        </div>
        <div class="large-hatching">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
</div>
<div id="hero-skip"></div>
