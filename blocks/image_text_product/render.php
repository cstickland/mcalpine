<div <?php echo get_block_wrapper_attributes(['class' => 'image-text-product-block animate ' . get_field('color')]); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-container  <?php echo get_field('image_alignment_mobile') . ' ';
                                        echo get_field('image_alignment_desktop'); ?>">
        <div class="text-container 
                <?php the_field('color');

                if (get_field('text_alignment_desktop')) :
                    the_field('text_alignment_desktop');
                endif; ?>">
            <div class="color-block"></div>
            <h2><?php the_field('title'); ?></h2>
            <?php if (get_field('text')) : ?>
                <div class="image-text-product-text"><?php the_field('text'); ?></div>
            <?php endif; ?>
            <?php $link = get_field('link');
            if ($link) :
                $link_url = $link['url'];
                $link_title = $link['title'];
                $link_target = $link['target'] ? $link['target'] : '_self';
            ?>
                <a class="btn <?php if (get_field('color') == 'color-white') {
                                    echo 'btn-red';
                                } else {
                                    echo 'btn-white';
                                } ?>" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>">
                    <?php echo esc_html($link_title); ?>
                </a>
            <?php endif; ?>
        </div>
        <div class="image-container">
            <?php $image = get_field('image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) : ?>
                <img class="image-text-background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php endif; ?>
            <div class="image-text-product-hash">
                <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
            </div>

            <div class="image-text-product-sku"><?php the_field('sku'); ?></div>
        </div>
    </div>
</div>
