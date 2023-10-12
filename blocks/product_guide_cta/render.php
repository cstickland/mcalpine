<!-- title -->
<!-- text -->
<!-- background_image -->
<!-- buttons > button_link -->
<!-- text_left -->

<div <?php echo get_block_wrapper_attributes(['class' => 'product-guide-block']); ?>>
    <div class="product-guide-container">
        <h2><?php the_field('title'); ?></h2>
        <div class="product-guide-text"><?php the_field('text'); ?></div>
        <?php if (have_rows('buttons')) :
            $count = 0;
            while (have_rows('buttons')) : the_row();
                $button = get_sub_field('button_link');
                if ($button) :
                    $button_url = $button['url'];
                    $button_title = $button['title'];
        ?>
                    <a class="btn btn-black" href="<?php echo esc_url($button_url); ?>"><?php echo esc_html($button_title); ?></a>
        <?php endif;
                $count++;
            endwhile;
        endif; ?>
    </div>
</div>
