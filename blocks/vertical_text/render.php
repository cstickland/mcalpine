<div <?php echo get_block_wrapper_attributes(['class' => 'vertical-text animate']); ?>>
    <?php if (get_field('show_lines')) : ?>
        <div class="vertical-line"></div>
    <?php endif; ?>
    <?php if (get_field('subtitle')) : ?>
        <div class="border-subtitle"><?php the_field('subtitle'); ?></div>
    <?php endif; ?>
    <div class="h<?php the_field('title_font_size'); ?>"><?php the_field('title'); ?></div>
    <?php if (get_field('text')) : ?>
        <div class="vertical-text_message"><?php the_field('text'); ?></div>
    <?php endif; ?>
    <?php if (get_field('show_lines')) : ?>
        <div class="vertical-line"></div>
    <?php endif; ?>
</div>
