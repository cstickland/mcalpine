<div <?php echo get_block_wrapper_attributes(['class' => 'grid-block']); ?> id="query-<?php the_title(); ?>">
    <h1 class="grid-title <?php the_field('title_color'); ?> <?php the_field('title_alignment'); ?>">
        <?php the_field('title'); ?>
        <div class="hatch"></div>
    </h1>

    <ul class="grid-block-grid">
        <?php $allowed_blocks = array('mcalpine/product-card', 'acf/content', 'mcalpine/info-card'); ?>
        <InnerBlocks allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>" />
    </ul>
</div>

<style>
    .grid-block {
        padding-bottom: 5rem;
    }

    .grid-block .acf-innerblocks-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
</style>
