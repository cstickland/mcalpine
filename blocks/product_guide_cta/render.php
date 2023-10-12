<!-- title -->
<!-- text -->
<!-- background_image -->
<!-- buttons > button_link -->
<!-- text_left -->

<div <?php echo get_block_wrapper_attributes(['class' => 'product-guide-block']); ?>>
    <div class="product-guide-container">
        <?php $image = get_field('background_image');
        if ($image) :

            // Image variables.
            $url = $image['url'];
            $title = $image['title'];
            $alt = $image['alt']; ?>
            <img src="<?php echo $url; ?>" alt="<?php echo $alt; ?>" class="product-guide-background-image" />
        <?php endif; ?>
        <div class="product-guide-gradients">
            <div class="product-guide-gradient-white"></div>
            <div class="product-guide-gradient-blue"></div>
        </div>
        <div class="product-guide-content">
            <div class="white-dash"></div>
            <h2><?php the_field('title'); ?></h2>
            <div class="product-guide-text"><?php the_field('text'); ?></div>
            <?php if (have_rows('buttons')) : ?>
                <div class="buttons-container">
                    <?php $count = 0;
                    while (have_rows('buttons')) : the_row();
                        $button = get_sub_field('button_link');
                        if ($button) :
                            $button_url = $button['url'];
                            $button_title = $button['title'];
                    ?>
                            <a class="btn btn-black <?php if ($count > 0) {
                                                        echo 'btn-outline';
                                                    } ?>" href="<?php echo esc_url($button_url); ?>"><?php echo esc_html($button_title); ?></a>
                    <?php endif;
                        $count++;
                    endwhile; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
