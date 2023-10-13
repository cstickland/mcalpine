<div <?php echo get_block_wrapper_attributes(['class' => 'help-card']); ?>>
    <div class="help-card-content align-<?php the_field('content_alignment'); ?>">
        <?php
        $image = get_field('image');
        if (!empty($image)) :
        ?>
            <img class="help-card-image" src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" />
        <?php endif; ?>
        <?php if (get_field('title')) : ?>
            <h4 class="help-card-title c-<?php the_field('title_colour'); ?>"><?php the_field('title'); ?></h4>
        <?php endif; ?>
        <?php if (get_field('text')) : ?>
            <div class="help-card-text"><?php the_field('text'); ?></div>
        <?php endif; ?>
        <?php
        $link = get_field('link');
        if ($link) :
            $link_url = $link['url'];
            $link_title = $link['title'];
            $link_target = $link['target'] ? $link['target'] : '_self';
        ?>
            <a class="btn btn-red" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
        <?php endif; ?>
    </div>
</div>
