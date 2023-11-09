<div <?php echo get_block_wrapper_attributes(['class' => 'timeline-slides-block']); ?>>
    <?php if (have_rows('timeline_slides')) : ?>
        <?php $count = 0; ?>
        <ul class="timeline-slides">
            <?php while (have_rows('timeline_slides')) : the_row(); ?>
                <li class="timeline-slide <?php if ($count == 0) {
                                                echo 'active';
                                            } ?>">
                    <?php $image = get_sub_field('slide_image');
                    $image_alt = $image['alt'];
                    $image_url = $image['url'];

                    if (!empty($image)) : ?>
                        <img class="image-text-background-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                    <?php endif; ?>
                    <h1><?php the_sub_field('slide_title'); ?></h1>
                </li>
                <?php $count++; ?>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
    <ul class="timeline-slides-controls"></ul>
</div>
