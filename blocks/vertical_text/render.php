<?php



?>

<div <?php echo get_block_wrapper_attributes(['class' => 'vertical-text']); ?>>
    <div class="vertical-line"></div>
    <div class="h1"><?php the_field('title'); ?></div>
    <div class="vertical-text_message"><?php the_field('text'); ?></div>

    <div class="vertical-line"></div>
</div>
