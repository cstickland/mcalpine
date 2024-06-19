<div <?php echo get_block_wrapper_attributes(['class' => 'find-product-block bg-' . get_field('background_color')]); ?>>
    <div class="find-product-block-container">
        <h2><?php the_field('find_products_block_title', 'option'); ?></h2>
        <ul class="find-product-companies">
            <?php if (have_rows('find_product_companies', 'option')) :
                while (have_rows('find_product_companies', 'option')) : the_row(); ?>
                    <li>
                        <?php if (get_field('background-color') == 'red') {
                            $image = get_sub_field('company_image_white');
                        } else {
                            $image = get_sub_field('company_image_color');
                        } ?>
                        <a href="<?php get_sub_field('company_search_url'); ?>" class="company-image-container">
                            <?php if (pathinfo($image['url'])['extension'] == 'svg') {
                                echo '<div class="company-image">';
                                echo file_get_contents($image['url']);
                                echo '</div>';
                            } else { ?>
                                <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" class="company-image" />
                            <?php } ?>
                        </a>
                    </li>
            <?php endwhile;
            endif; ?>
        </ul>
        <div class="">
            <?php if (have_rows('links', 'option')) :
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

<div <?php echo get_block_wrapper_attributes(['class' => 'find-product-block accordion bg-' . get_field('background_color')]); ?>>
    <div class="accordion-question-container">
        <h2><?php the_field('find_products_block_title', 'option'); ?></h2>

        <div class="accordion-toggle-icon">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
        </div>

    </div>
    <div class="find-product-block-container accordion-answer">
        <ul class="find-product-companies answer">
            <?php if (have_rows('find_product_companies', 'option')) :
                while (have_rows('find_product_companies', 'option')) : the_row(); ?>
                    <li>
                        <?php if (get_field('background-color') == 'red') {
                            $image = get_sub_field('company_image_white');
                        } else {
                            $image = get_sub_field('company_image_color');
                        } ?>
                        <a href="<?php get_sub_field('company_search_url'); ?>" class="company-image-container">
                            <?php if (pathinfo($image['url'])['extension'] == 'svg') {
                                echo '<div class="company-image">';
                                echo file_get_contents($image['url']);
                                echo '</div>';
                            } else { ?>
                                <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" class="company-image" />
                            <?php } ?>
                        </a>
                    </li>
            <?php endwhile;
            endif; ?>
        </ul>
        <div class="">
            <?php if (have_rows('links', 'option')) :
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
