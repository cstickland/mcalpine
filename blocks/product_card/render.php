<?php

$product_id = get_field('product_id');
$sku_count = count(get_field('skus', $product_id));

?>

<div <?php echo get_block_wrapper_attributes(['class' => 'product-card']); ?> id="query-<?php the_title(); ?>">
    <div class="product-block-image">
        <?php $count = 0; ?>
        <?php if (have_rows('skus', $product_id)) :
            while (have_rows('skus', $product_id)) : the_row();
                if (have_rows('product_images')) :
                    while (have_rows('product_images')) : the_row(); ?>
                        <?php if ($count == 0) { ?>
                            <img src="<?php the_sub_field('product_image'); ?>" />
                        <?php } ?>
        <?php $count++;
                    endwhile;
                endif;
            endwhile;
        endif; ?>
        <div class="product-title"><?php echo get_the_title($product_id); ?></div>
        <div class="sku-count"><?php echo $sku_count;
                                if ($sku_count < 1) {
                                    echo 'no ';
                                } elseif ($sku_count == 1) {
                                    echo ' sku';
                                } else {
                                    echo ' skus';
                                }  ?></div>
        <a class="product-card-link" href="<?php echo get_permalink($product_id); ?>">></a>
    </div>
    <div class="sku-list-container">
        <div class="sku-list">
            <?php
            $sku_count = count(get_field('skus', $product_id));
            $i = 1;
            if (have_rows('skus', $product_id)) :
                while (have_rows('skus', $product_id)) : the_row(); ?>
                    <span><?php the_sub_field('sku');
                            if ($i < $sku_count) {
                                echo ',';
                            } ?><span>
                    <?php $i++;
                endwhile;
            endif; ?>
        </div>
        <div class="product-title"><?php echo get_the_title($product_id); ?></div>
        <div class="sku-count"><?php echo $sku_count;
                                if ($sku_count == 1) {
                                    echo ' sku';
                                } else {
                                    echo ' skus';
                                }  ?></div>
        <a class="product-card-link" href="<?php echo get_permalink($product_id); ?>">></a>
    </div>
</div>
