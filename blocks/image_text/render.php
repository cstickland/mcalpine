<div <?php echo get_block_wrapper_attributes(['class' => 'image-text-block']); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-container  <?php if (get_field('image_full_width')) :
                                            echo 'image-full-width ';
                                        endif; ?><?php the_field('color'); ?> <?php the_field('image_alignment_mobile'); ?> <?php the_field('image_alignment_desktop'); ?>">
        <div class="text-container 
                <?php the_field('color');

                if (get_field('text_alignment_desktop')) :
                    the_field('text_alignment_desktop');
                endif; ?>">
            <div class="color-block"></div>
            <h2><?php the_field('title'); ?></h2>
            <?php if (get_field('text')) : ?>
                <p><? the_field('text'); ?></p>
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
        <div class="image-container <?php if (get_field('image_full_width')) : echo 'image-full-width';
                                    endif; ?>">
            <?php $image = get_field('image');
            $image_alt = $image['alt'];
            $image_url = $image['url'];

            if (!empty($image)) : ?>
                <img src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php endif; ?>
        </div>
        <div class="text-block-hash <?php if (get_field('text_alignment_desktop')) :
                                        the_field('text_alignment_desktop');
                                    endif; ?> ">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>

</div>
