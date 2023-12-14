<div class="info-card-container">
    <div <?php echo get_block_wrapper_attributes(['class' => 'info-card animate']); ?> id="query-<?php the_title(); ?>">
        <?php if (get_field('icon_image')) { ?>
            <?php $image = get_field('icon_image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) :  if (pathinfo($image_url)['extension'] == 'svg') {
                    echo '<div class="icon-image">';
                    echo file_get_contents($image_url);
                    echo '</div>';
                } else { ?>
                    <img class="icon-image" style="height: <?php the_field('overflow_image_height'); ?>%; left: <?php the_field('overflow_image_horizontal_position'); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php }
            endif; ?>

        <?php } ?>
        <div class="info-card-text">
            <h4 class="info-card-title"><?php the_field('title_text'); ?></h4>
            <div class="info-card-message">
                <div><?php the_field('main_text'); ?></div>
            </div>
        </div>
        <?php if (get_field('background_image')) { ?>
            <?php $image = get_field('background_image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) : ?>
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>" class="background-image" />
            <?php endif; ?>

        <?php } ?>
        <div class="hash">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
</div>
