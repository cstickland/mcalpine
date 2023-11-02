<div <?php echo get_block_wrapper_attributes(['class' => 'image-text-slider-block']); ?> id="query-<?php the_title(); ?>">
    <div class="image-text-slider-title-container">
        <div class="image-text-slider-subtitle"><?php the_field('subtitle'); ?></div>
        <h2 class="image-text-slider-title"><?php the_field('title'); ?></h2>
    </div>
    <ul class="slide-container">
        <?php if (have_rows('slides')) :
            $count = 0;
            while (have_rows('slides')) : the_row();
        ?>
                <li class="slide <?php if ($count == 0) {
                                        echo 'active';
                                    } ?>">
                    <div class="image-text-container">

                        <div class="text-container">
                            <div class="color-block"></div>
                            <h2><?php the_sub_field('slide_title'); ?></h2>
                            <?php if (get_sub_field('slide_text')) : ?>
                                <p><?php the_sub_field('slide_text'); ?></p>
                            <?php endif; ?>
                            <?php $link = get_sub_field('slide_link');
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
                        <div class="red-block"></div>
                        <div class="image-container">
                            <?php $image = get_sub_field('slide_image');
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
                    </div>
                </li>
        <?php $count++;
            endwhile;
        endif; ?>
        <div class="slider-buttons">
            <button class="prev-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                </svg>
            </button>
            <button class="next-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                </svg>
            </button>
        </div>
    </ul>
</div>
