<div <?php echo get_block_wrapper_attributes(['class' => 'timeline-slides-block']); ?> id="timeline">
    <?php if (have_rows('timeline_slides')) : ?>
        <?php $count = 0; ?>
        <ul class="timeline-slides">
            <?php while (have_rows('timeline_slides')) : the_row(); ?>
                <li class="timeline-slide <?php if ($count == 0) {
                                                echo 'active';
                                            } ?>">

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
                </li>
                <?php $count++; ?>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
    <ul class="timeline-slides-controls"></ul>
</div>
