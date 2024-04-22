<section id="product-highlights" <?php echo get_block_wrapper_attributes(['class' => 'product-highlights animate ' . get_field('background_color')]); ?> id="query-<?php the_title(); ?>">
    <h2 class="product-highlights-title"><?php the_field('title'); ?></h2>
    <?php if (have_rows('highlights')) : ?>
        <ul class="highlights-icon-grid" id="product-highlights">
            <?php while (have_rows('highlights')) : the_row();
            ?>
                <li>
                    <div class="highlight-image">
                        <?php if (get_sub_field('highlight_image')) { ?>
                            <?php $image = get_sub_field('highlight_image');
                            $image_alt = $image['alt'];
                            $image_url = $image['url'];
                            ?>

                            <?php if (pathinfo($image_url)['extension'] == 'svg') {
                                echo file_get_contents($image_url);
                            } else { ?>
                                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($image_alt); ?>" class="background-image-schematic" />
                            <?php } ?>
                        <?php } ?>
                    </div>
                    <h5><?php the_sub_field('highlight_text'); ?></h5>
                </li>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
</section>
