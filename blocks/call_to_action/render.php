<div <?php echo get_block_wrapper_attributes(['class' => 'cta-block']); ?>">
    <h2 class="call-to-action-text"><?php the_field('footer_call_to_action_text', 'option'); ?></h2>
    <?php $link = get_field('cta_block_link', 'option');
    if ($link) :
        $link_url = $link['url'];
        $link_title = $link['title'];
        $link_target = $link['target'] ? $link['target'] : '_self';
    ?>
        <a class="btn btn-black" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
    <?php endif; ?>
</div>
