<div <?php echo get_block_wrapper_attributes(['class' => 'newsletter-block animate']); ?> style="background-image: url('<?php echo get_template_directory_uri() . "/assets/hatching_bg.svg"; ?>')">
    <div class="white-cover"></div>
    <div class="newsletter-container">
        <div class="newsletter-content">
            <div class="newsletter-block-title"><?php the_field('title'); ?></div>
            <div class="newsletter-block-message"><?php the_field('text'); ?></div>
            <?php echo do_shortcode(get_field('form_shortcode')); ?>
        </div>
    </div>
    <div class="white-cover"></div>
</div>
