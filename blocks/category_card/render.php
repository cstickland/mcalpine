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
                <div class="product-category-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                    </svg>
                </div>
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
