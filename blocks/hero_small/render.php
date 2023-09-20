<div <?php echo get_block_wrapper_attributes(['class' => 'small-hero-block']); ?>>
    <div class="small-hero-content">
        <div class="hero-breadcrumbs">
            <a href="<?php echo get_site_url(); ?>">Home</a>
            <span>></span>
            <?php
            $link = get_field('breadcrumb_middle_link');
            if ($link) :
                $link_url = $link['url'];
                $link_title = $link['title'];
            ?>
                <a class="breadcrumb-middle-link" href="<?php echo esc_url($link_url); ?>"><?php echo esc_html($link_title); ?></a>
                <span>></span>
            <?php endif; ?>
            <div class="breadcrumbs-current"><?php the_title(); ?></div>
        </div>
        <h1><?php the_field('title'); ?></h1>
        <p class="small-hero-text"><?php the_field('message'); ?></p>
    </div>
    <div class="small-hero-image-container">
        <?php $image = get_field('image');
        if ($image) :
        ?>
            <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>">
        <?php endif; ?>
    </div>
</div>
