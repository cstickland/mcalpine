<section <?php echo get_block_wrapper_attributes(['class' => 'member-institutions animate']); ?> id="query-<?php the_title(); ?>">
    <div class="red-band"></div>
    <div class="member-institutions-text"><?php the_field('text'); ?></div>

    <?php if (have_rows('institutions')) : ?>
        <ul class="institution-icon-grid">
            <?php while (have_rows('institutions')) : the_row();
            ?>
                <li>
                    <?php
                    $link = get_sub_field('insitution_link');
                    if ($link) :
                        $link_url = $link['url'];
                        $link_title = $link['title'];
                        $link_target = $link['target'] ? $link['target'] : '_self';
                    ?>
                        <a class="member-insitution-link" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>">
                            <?php
                            $image = get_sub_field('full_color_image');
                            if (!empty($image)) : ?>
                                <img class="full-color-image" src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" />
                            <?php endif; ?>
                        </a>
                    <?php endif; ?>
                </li>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
</section>
