<div <?php echo get_block_wrapper_attributes(['class' => 'info-card animate']); ?> id="query-<?php the_title(); ?>">
    <?php if (get_field('icon_image')) { ?>
        <?php $image = get_field('icon_image');
        $image_alt = $image['alt'];
        $image_url = $image['url'];

        if (!empty($image)) : ?>
            <img class="icon-image" style="height: <?php the_field('overflow_image_height'); ?>%; left: <?php the_field('overflow_image_horizontal_position'); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
        <?php endif; ?>

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
            <img class="background-image" style="height: <?php the_field('overflow_image_height'); ?>%; left: <?php the_field('overflow_image_horizontal_position'); ?>%;" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
        <?php endif; ?>

    <?php } ?>
    <div class="hash">
        <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
    </div>
</div>
