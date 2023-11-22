<div <?php echo get_block_wrapper_attributes(['class' => 'product-details']) ?> id='product-details'>


    <?php $allowed_blocks = array(
        'mcalpine/image-text-product',
        'mcalpine/image-text-details'
    ); ?>
    <InnerBlocks allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>" />

</div>
