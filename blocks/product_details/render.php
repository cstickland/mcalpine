<div <?php echo get_block_wrapper_attributes(['class' => 'product-details desktop']) ?> id='product-details'>
    <?php $allowed_blocks = array(
        'mcalpine/image-text-product',
        'mcalpine/image-text-details'
    ); ?>
    <div id="innerblock_container">
        <InnerBlocks allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>" />
    </div>
</div>
<div <?php echo get_block_wrapper_attributes(['class' => 'product-details accordion']) ?> id='product-details'>
    <div class="accordion-question-container">
        <h2>Details</h2>

        <div class="accordion-toggle-icon">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
        </div>

    </div>
    <?php $allowed_blocks = array(
        'mcalpine/image-text-product',
        'mcalpine/image-text-details'
    ); ?>
    <div class="accordion-answer" id="innerblocks_container_accordion">
    </div>
</div>

<script>
    const innerblocks = document.getElementById('innerblock_container').innerHTML
    const innerBlocksAccordionContainer = document.getElementById('innerblocks_container_accordion');
    innerBlocksAccordionContainer.innerHTML = innerblocks
</script>
