<div <?php echo get_block_wrapper_attributes(['class' => 'image-text-block ' . get_field('background_color')]); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-container  <?php
                                        echo get_field('color') . ' ';
                                        echo get_field('image_alignment_mobile') . ' ';
                                        echo get_field('image_alignment_desktop'); ?>">

        <div class="text-color-block <?php the_field('color'); ?>"></div>
        <div class="text-container 
                <?php the_field('color'); ?> 

<?php if (get_field('text_alignment_desktop')) :
    the_field('text_alignment_desktop');
endif; ?>">
            <div class="color-block"></div>
            <h2><?php the_field('title'); ?></h2>
            <?php if (get_field('text')) : ?>
                <div><?php the_field('text'); ?></div>
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
            <?php if (get_field('media_type') == 'image') { ?>
                <?php $image = get_field('image');
                $image_alt = $image['alt'];
                $image_url = $image['url'];

                if (!empty($image)) : ?>
                    <img class="image-text-background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                <?php endif; ?>
            <?php } else if (get_field('media_type') == 'video') { ?>
                <div class='video-block'>
                    <div class="video-muted" data-video="<?php the_field('video_url'); ?>"></div>
                    <div class="play-button">
                    </div>
                </div>
            <?php } ?>
        </div>
        <div class="text-block-hash <?php if (get_field('text_alignment_desktop')) :
                                        the_field('text_alignment_desktop');
                                    endif; ?> ">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
</div>
