<div <?php echo get_block_wrapper_attributes(['class' => 'contact']); ?>">

    <div class="contact-text">
        <h2><?php the_field('contact_block_title', 'option'); ?></h2>
        <p><?php the_field('contact_text_paragraph', 'option'); ?></p>
    </div>
    <?php echo do_shortcode('[gravityform id="1" title="true"]'); ?>
    <div class="contact-link">
        <p><?php the_field('contact_block_link_text', 'option'); ?></p>
        <?php $link = get_field('contact_block_link', 'option');
        if ($link) :
            $link_url = $link['url'];
            $link_title = $link['title'];
            $link_target = $link['target'] ? $link['target'] : '_self';
        ?>
            <a class="btn btn-red btn-outline" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
        <?php endif; ?>
    </div>
</div>
