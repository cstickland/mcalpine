<?php

$link = get_field('link');

if ($link) {
    $link_url = $link['url'];
    $link_title = $link['title'];
    $link_target = $link['target'] ? $link['target'] : '_self';
}
?>
<?php if ($link) { ?>
    <a href="<?php echo esc_url($link_url); ?>" <?php echo get_block_wrapper_attributes(['class' => 'help-card']); ?>>
    <?php } else { ?>
        <div <?php echo get_block_wrapper_attributes(['class' => 'help-card']); ?>>
        <?php } ?>
        <div class="help-card-content align-<?php the_field('content_alignment'); ?>">
            <?php
            $image = get_field('image');
            if (!empty($image)) :

                $image_url = $image['url'];
                $image_alt = $image['alt'];
            ?>
                <?php if (pathinfo($image_url)['extension'] == 'svg') {
                    echo '<div class="help-card-image">';
                    echo file_get_contents($image_url);
                    echo '</div>';
                } else { ?>
                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>" class="help-card-image" />
            <?php }
            endif; ?>

            <?php if (get_field('title')) : ?>
                <h4 class="help-card-title c-<?php the_field('title_colour'); ?>"><?php the_field('title'); ?></h4>
            <?php endif; ?>
            <?php if (get_field('text')) : ?>
                <div class="help-card-text"><?php the_field('text'); ?></div>
            <?php endif; ?>
            <?php if ($link) : ?>
                <div class="btn btn-red"><?php echo esc_html($link_title); ?></div>
            <?php endif; ?>
        </div>
        <?php if ($link) { ?>
    </a>
<?php } else { ?>
    </div>
<?php } ?>
