<div <?php echo get_block_wrapper_attributes(['class' => 'timeline-slides-block']); ?> id="timeline">
    <?php if (have_rows('timeline_slides')) : ?>
        <?php $count = 0; ?>
        <ul class="timeline-slides">
            <?php while (have_rows('timeline_slides')) : the_row(); ?>
                <li class="timeline-slide <?php echo get_sub_field('slide_background_color');
                                            if ($count == 0) {
                                                echo ' active';
                                            } ?>" data-year="<?php the_sub_field('slide_year'); ?>">

                    <div class="slide-content">
                        <?php $image = get_sub_field('slide_image');
                        $image_alt = $image['alt'];
                        $image_url = $image['url'];
                        if (!empty($image)) : ?>
                            <img class="image-text-background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                        <?php endif; ?>
                        <div class="slide-text-container">
                            <div class="color-block"></div>

                            <h3 class="slide-title"><?php the_sub_field('slide_title'); ?></h3>
                            <div class="slide-message"><?php the_sub_field('slide_text'); ?></div>
                        </div>
                        <div class="slide-year"><?php the_sub_field('slide_year'); ?></div>

                    </div>
                    <div class="slide-hash slide-hash-left">
                        <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
                    </div>
                    <div class="slide-hash slide-hash-bottom-right">
                        <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
                    </div>
                    <div class="slide-red-box">
                    </div>
                </li>
                <?php $count++; ?>
            <?php endwhile; ?>
        </ul>
        <div class="timeline-dots-container">
            <ul class="timeline-dots">
                <?php $count = 0; ?>
                <?php while (have_rows('timeline_slides')) : the_row(); ?>
                    <li class="timeline-dot <?php if ($count == 0) {
                                                echo 'active';
                                            } ?>" data-year="<?php the_sub_field('slide_year'); ?>">
                        <div class="dot-year"><?php the_sub_field('slide_year'); ?></div>
                        <div class="dot"></div>
                    </li>
                    <?php $count++; ?>
                <?php endwhile; ?>
            </ul>
            <div class="dots-indicator-triangle"></div>
        </div>

    <?php endif; ?>
    <ul class="timeline-slides-controls"></ul>
</div>
