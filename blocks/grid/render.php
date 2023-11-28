<div <?php echo get_block_wrapper_attributes(['class' => 'grid-block animate ' . get_field('mobile_style')]); ?>>
    <div class="grid-title-container">
        <h2 class="grid-title <?php the_field('title_color'); ?> <?php the_field('title_alignment'); ?>">
            <?php the_field('title'); ?>
        </h2>

        <?php
        $link = get_field('link');
        if ($link) :
            $link_url = $link['url'];
            $link_title = $link['title'];
            $link_target = $link['target'] ? $link['target'] : '_self';
        ?>
            <a class="grid-link" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
        <?php endif; ?>
    </div>
    <ul class="grid-block-grid columns-<?php the_field('desktop_maximum_columns'); ?>">
        <?php $allowed_blocks = array('mcalpine/product-card', 'acf/content', 'mcalpine/info-card', 'mcalpine/insight-card', 'mcalpine/category-card'); ?>
        <InnerBlocks allowedBlocks="<?php echo esc_attr(wp_json_encode($allowed_blocks)); ?>" />
    </ul>
    <?php if ($link) :
        $link_url = $link['url'];
        $link_title = $link['title'];
        $link_target = $link['target'] ? $link['target'] : '_self';
    ?>
        <a class="grid-link-mobile" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
    <?php endif; ?>
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
