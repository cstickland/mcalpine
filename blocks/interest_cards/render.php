<div <?php echo get_block_wrapper_attributes(['class' => 'interest-cards-block']); ?>>
    <?php if (get_field('subtitle')) : ?>
        <div class="border-subtitle"><?php the_field('subtitle'); ?></div>
    <?php endif; ?>
    <?php if (get_field('title')) : ?>
        <h2 class="interest-cards-title">
            <?php the_field('title'); ?>
        </h2>
    <?php endif; ?>
    <?php if (have_rows('cards')) : ?>
        <ul class="interest-card-grid">
            <?php while (have_rows('cards')) : the_row(); ?>
                <li class="interest-card">
                    <?php $image = get_sub_field('card_image');
                    $image_alt = $image['alt'];
                    $image_url = $image['url'];

                    if (!empty($image)) : ?>
                        <img class="interest-card-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
                    <?php endif; ?>
                    <h3><?php the_sub_field('card_title'); ?></h3>
                    <p><?php the_sub_field('card_text'); ?></p>
                </li>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
</div>
