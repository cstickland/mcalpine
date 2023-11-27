<div <?php echo get_block_wrapper_attributes(['class' => 'find-product-block ' . get_field('colour_style')]); ?>>
    <div class="find-product-block-container">
        <h2><?php the_field('title'); ?></h2>
        <ul class="find-product-companies">
            <?php if (have_rows('companies')) :
                while (have_rows('companies')) : the_row(); ?>
                    <li><?php $image = get_sub_field('image');
                        ?>
                        <div class="position-<?php the_sub_field('image_two_position'); ?> home-hero-image-container">
                            <?php if (pathinfo($image_schematic['url'])['extension'] == 'svg') {
                                echo '<div class="company-image">';
                                echo file_get_contents($image_schematic['url']);
                                echo '</div>';
                            } else { ?>
                                <img src="<?php echo esc_url($image_schematic['url']); ?>" alt="<?php echo esc_attr($image_schematic['alt']); ?>" class="company-image" />
                            <?php } ?>
                        </div>
                    </li>
            <?php endwhile;
            endif; ?>
        </ul>
        <div class="">
            <?php if (have_rows('links')) :
                while (have_rows('links')) : the_row(); ?>
                    <?php $link = get_sub_field('link');
                    if ($link) :
                        $link_url = $link['url'];
                        $link_title = $link['title'];
                        $link_target = $link['target'] ? $link['target'] : '_self';
                    ?>
                        <a class="btn <?php if (get_field('color') == 'color-white') {
                                            echo 'btn-red';
                                        } else {
                                            echo 'btn-white';
                                        } ?>" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>">
                            <?php echo esc_html($link_title); ?>
                        </a>
                    <?php endif; ?>
            <?php endwhile;
            endif; ?>
        </div>
    </div>
</div>
