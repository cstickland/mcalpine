<?php

$product_id = get_field('product_id');
if (!is_null(get_post($product_id))) :
    $sku_count = count(get_field('skus', $product_id));
endif;

?>

<?php if (!is_null(get_post($product_id))) { ?>
    <div class="product-card-container">
        <div <?php echo get_block_wrapper_attributes(['class' => 'product-card']); ?> id="query-<?php the_title(); ?>">
            <div class="product-block-image">
                <?php $count = 0; ?>
                <?php if (have_rows('skus', $product_id)) :
                    while (have_rows('skus', $product_id)) : the_row();
                        if (have_rows('product_images')) :
                            while (have_rows('product_images')) : the_row(); ?>
                                <?php if ($count == 0) { ?>
                                    <a class="product-image-link" href="<?php echo get_permalink($product_id); ?>">
                                        <img src="<?php the_sub_field('product_image'); ?>" />
                                    </a>
                                <?php } ?>
                <?php $count++;
                            endwhile;
                        endif;
                    endwhile;
                endif; ?>
                <div class="product-title"><?php echo get_the_title($product_id); ?></div>
                <div class="sku-count">
                    <div class="sku-count-default">
                        <?php echo $sku_count;
                        if ($sku_count < 1) {
                            echo 'no ';
                        } elseif ($sku_count == 1) {
                            echo ' sku';
                        } else {
                            echo ' skus';
                        }  ?>
                    </div>
                    <span class="sku-count-small">SKUs</span>
                </div>
                <a class="product-card-link" href="<?php echo get_permalink($product_id); ?>">></a>
            </div>
            <div class="sku-list-container">
                <div class="product-title"><?php echo get_the_title($product_id); ?></div>
                <div class="sku-list">
                    <?php
                    $sku_count = count(get_field('skus', $product_id));
                    $i = 1;
                    if (have_rows('skus', $product_id)) :
                        while (have_rows('skus', $product_id)) : the_row(); ?>
                            <span>
                                <a href="<?php echo get_permalink($product_id) . '/?sku=' . get_sub_field('sku'); ?>">
                                    <?php the_sub_field('sku'); ?>
                                </a>
                            </span>
                    <?php $i++;
                        endwhile;
                    endif; ?>
                </div>
                <div class="sku-close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g data-name="Layer 2">
                            <g data-name="close">
                                <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
                                <path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
                            </g>
                        </g>
                    </svg>
                </div>
                <a class="product-card-link" href="<?php echo get_permalink($product_id); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                    </svg>
                </a>
            </div>
        </div>
        <a class="product-title-small" href="<?php echo get_permalink($product_id); ?>">
            <?php echo get_the_title($product_id); ?>
        </a>
    </div>
<?php } ?>
