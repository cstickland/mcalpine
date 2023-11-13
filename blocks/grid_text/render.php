<div <?php echo get_block_wrapper_attributes(['class' => 'grid-text-block animate']); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-container">
        <div class="text-container">
            <div class="color-block"></div>
            <h2><?php the_field('title'); ?></h2>
            <?php if (get_field('text')) : ?>
                <p><?php the_field('text'); ?></p>
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
        <div class="grid-container">
            <?php $allowed_blocks = array('mcalpine/info-card'); ?>
            <InnerBlocks allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>" />
        </div>
        <div class="background-image-schematic">
            <?php if (get_field('background_image')) { ?>
                <?php $image = get_field('background_image');
                $image_alt = $image['alt'];
                $image_url = $image['url'];

                if (!empty($image)) : ?>
                    <img class="background-image" style="height: <?php the_field('overflow_image_height'); ?>%; left: <?php the_field('overflow_image_horizontal_position'); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                <?php endif; ?>

            <?php } ?>
        </div>
    </div>
</div>
