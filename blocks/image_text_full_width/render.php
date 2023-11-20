<div <?php echo get_block_wrapper_attributes(['class' => 'image-text-full-width-block']); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-container  <?php
                                        if (get_field('show_overflow_image')) : echo 'overflow ';
                                        endif;
                                        echo get_field('color') . ' ';
                                        echo get_field('image_alignment_mobile'); ?>">
        <div class="image-container <?php the_field('background_image_height'); ?>">
            <?php $image = get_field('image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) : ?>
                <img class="image-text-background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php endif; ?>

            <?php if (get_field('show_overflow_image')) { ?>
                <?php $image = get_field('overflow_image');
                $image_alt = $image['alt'];
                $image_url = $image['url'];

                if (!empty($image)) : ?>
                    <img class="overflow-image" style="height: <?php the_field('overflow_image_height'); ?>%; left: <?php the_field('overflow_image_horizontal_position'); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                <?php endif; ?>

            <?php } ?>
        </div>

        <div class="text-container 
<?php
if (get_field('text_alignment_desktop')) :
    the_field('text_alignment_desktop');
endif; ?>">
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

                <a class="btn btn-white" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>">
                    <?php echo esc_html($link_title); ?>
                </a>
            <?php endif; ?>
        </div>

    </div>

</div>
