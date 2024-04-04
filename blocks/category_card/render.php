<?php

$category_id = get_field('category_id');

?>

<li <?php echo get_block_wrapper_attributes(['class' => 'category-card-container']); ?>>
    <?php if (!is_admin()) { ?>
        <a class="category-card" href="<?php echo get_term_link($category_id); ?>">
        <?php } else { ?>
            <div class="category-card">
            <?php } ?>
            <?php
            $image = get_field('category_image', $category_id);
            if (!empty($image)) : ?>
                <img class="category-card-image" src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" />
            <?php endif; ?>
            <div class="category-link-container">
                <h5><?php echo get_term($category_id)->name; ?></h5>
            </div>
            <?php if (!is_admin()) { ?>
        </a>
        <a class="category-card-link-small" href="<?php echo get_term_link($category_id); ?>">
            <?php echo get_term($category_id)->name; ?>
        </a>
    <?php } else { ?>
        </div>
        <div class="category-card-link-small">
            <?php echo get_term($category_id)->name; ?>
        </div>
    <?php } ?>


</li>
