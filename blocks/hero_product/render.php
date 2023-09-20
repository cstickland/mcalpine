<div <?php echo get_block_wrapper_attributes(['class' => 'product-hero']); ?>">

    <div class="product-hero-container">
        <div class="product-hero-image">
            <?php if (have_rows('skus', $post_id)) :
                while (have_rows('skus', $post_id)) : the_row();
                    if (get_row_index() == 1) {
                        if (have_rows('product_images')) :
                            while (have_rows('product_images')) : the_row(); ?>
                                <img class="product-image" src="<?php the_sub_field('product_image'); ?>" />
                        <?php endwhile;
                        endif; ?>
            <?php }
                endwhile;
            endif; ?>
        </div>
        <div class="product-hero-details">
            <div class="product-details-container">
                <h1><?php echo get_the_title($post_id); ?></h1>
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        if (get_row_index() == 1) { ?>
                            <p><?php the_sub_field('product_description'); ?></p>
                            <ul>
                                <?php while (have_rows('product_features')) : the_row(); ?>
                                    <li>
                                        <?php the_sub_field('feature'); ?>
                                    </li>
                                <?php endwhile; ?>
                            </ul>
                <?php
                        }
                    endwhile;
                endif; ?>
            </div>
            <div class="product-skus-container">
                <?php if (have_rows('skus', $post_id)) : ?>
                    <ul>
                        <?php while (have_rows('skus', $post_id)) : the_row(); ?>
                            <li>
                                <?php if (have_rows('product_images')) :
                                    while (have_rows('product_images')) : the_row(); ?>
                                        <img src="<?php the_sub_field('product_image'); ?>" />
                                <?php endwhile;
                                endif; ?>
                                <div><?php the_sub_field('sku'); ?></div>
                            </li>

                        <?php endwhile; ?>
                    </ul>
                <?php endif; ?>
            </div>
            <div class="product-instructions-container">
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        if (get_row_index() == 1) {
                            if (get_sub_field('product_installation_instructions')) { ?>
                                <div class="installation-instructions">
                                    <a href="<?php the_sub_field('product_installation_instructions'); ?>" download>Install Instructions</a>
                                </div>
                            <?php }
                            if (get_sub_field('product_technical_drawing')) { ?>
                                <div class="technical-drawing">
                                    <a href="<?php the_sub_field('product_technical_drawing'); ?>" download>Technical Drawing</a>
                                </div>
                <?php }
                        }
                    endwhile;
                endif; ?>
            </div>
        </div>

    </div>
</div>
