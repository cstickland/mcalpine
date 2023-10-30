<?php

$link = get_field('link');

if ($link) {
    $link_url = $link['url'];
    $link_title = $link['title'];
    $link_target = $link['target'] ? $link['target'] : '_self';
}
?>
<?php if ($link) { ?>
    <a href="<?php echo esc_url($link_url); ?>" class="help-card">
    <?php } else { ?>
        <div <?php echo get_block_wrapper_attributes(['class' => 'help-card']); ?>>
        <?php } ?>
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
            if ($link) :
                $link_url = $link['url'];
                $link_title = $link['title'];
                $link_target = $link['target'] ? $link['target'] : '_self';
            ?>
                <div class="btn btn-red"><?php echo esc_html($link_title); ?></div>
            <?php endif; ?>
        </div>
        <?php if ($link) { ?>
    </a>
<?php } else { ?>
    </div>
<?php } ?>
