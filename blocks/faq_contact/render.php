<div <?php echo get_block_wrapper_attributes(['class' => 'faq-contact']); ?>">
    <div class="faq-contact-text-container">
        <div class="color-block"></div>
        <h2><?php the_field('title'); ?></h2>
        <div class="faq-contact-text"><?php the_field('text'); ?></div>
    </div>
    <div class="faq-contact-form-container">
        <?php echo do_shortcode('[gravityform id="3" title="true"]'); ?>
    </div>
    <div class="faq-contact-block-hash">
        <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
    </div>
    <div class="red-background"></div>
</div>
