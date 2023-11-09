<?php $link = null; ?>
<div <?php echo get_block_wrapper_attributes(['class' => 'product-hero ' . get_field('product_hero_background_style', $post_id)]); ?>">
    <div class="product-hero-container">
        <div class="product-hero-image">
            <div class="hero-breadcrumbs">
                <a href="<?php echo get_site_url(); ?>">Home</a>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                </span>

                <a class="breadcrumb-middle-link" href="<?php echo site_url() . '/products'; ?>">Products</a>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                </span>
                <div class="breadcrumbs-current"><?php the_title(); ?></div>
            </div>
            <?php $count = 0; ?>
            <?php if (have_rows('skus', $post_id)) :
                while (have_rows('skus', $post_id)) : the_row();
                    $sku = get_sub_field('sku');
                    if (have_rows('product_images')) :
                        while (have_rows('product_images')) : the_row(); ?>
                            <img data-sku='<?php echo $sku; ?>' class="product-image <?php if ($count == 0) {
                                                                                            echo ' active';
                                                                                        } ?>" src="<?php the_sub_field('product_image'); ?>" />
                <?php endwhile;
                    endif;
                    $count++;
                endwhile;
            endif;
            $image = get_field('product_schematic_image', $post_id);
            if (!empty($image)) :
                $image_alt = $image['alt'];
                $image_url = $image['url'];
                ?>
                <img class="product-hero-schematic-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php endif; ?>
            <div class="product-hero-control-images">
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        $sku = get_sub_field('sku');
                        if (have_rows('product_images')) :
                            while (have_rows('product_images')) : the_row(); ?>
                                <img data-sku='<?php echo $sku; ?>' class="product-image-thumbnail" src="<?php the_sub_field('product_image'); ?>" />
                <?php endwhile;
                        endif;
                        $count++;
                    endwhile;
                endif; ?>

            </div>

        </div>
        <div class="product-hero-details">
            <div class="product-details-container">
                <h1 class="h3 product-title"><?php echo get_the_title($post_id); ?></h1>
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        if (get_row_index() == 1) { ?>
                            <div><?php the_sub_field('product_description'); ?></div>
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
                <a href="" class="btn btn-black">WHERE TO BUY</a>
                <a href='' class="btn btn-black btn-outline">LEAVE A REVIEW</a>
            </div>
            <div class="product-skus-container">
                <?php if (have_rows('skus', $post_id)) : ?>
                    <ul>
                        <?php while (have_rows('skus', $post_id)) : the_row(); ?>
                            <li>
                                <?php if (have_rows('product_images')) :
                                    while (have_rows('product_images')) : the_row(); ?>
                                        <div class="sku-image-container"> <img src="<?php the_sub_field('product_image'); ?>" /></div>
                                <?php endwhile;
                                endif; ?>
                                <div class="sku-text"><?php the_sub_field('sku'); ?></div>
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
