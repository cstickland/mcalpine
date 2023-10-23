<div <?php echo get_block_wrapper_attributes(['class' => 'home-hero-block']); ?> id="home-hero-block">

    <div class="home-hero-content">
        <div class="home-hero-text">
            <h1><?php the_field('hero_title'); ?></h1>
            <p class="hero-text"><?php the_field('hero_text'); ?></p>
        </div>
        <ul class="background-animated-images">
            <?php if (have_rows('animation_images')) :
                $count = 0;
                while (have_rows('animation_images')) : the_row(); ?>
                    <li class="<?php if ($count == 0) : echo ' show';
                                endif; ?>">
                        <?php $image_schematic = get_sub_field('image_one_schematic');
                        $image_hover = get_sub_field('image_one_hover_image');
                        ?>
                        <div class="position-<?php the_sub_field('image_one_position'); ?> home-hero-image-container">
                            <img src="<?php echo esc_url($image_schematic['url']); ?>" alt="<?php echo esc_attr($image_schematic['alt']); ?>" class="home-hero-schematic-image" />
                            <img src="<?php echo esc_url($image_hover['url']); ?>" alt="<?php echo esc_attr($image_hover['alt']); ?>" class="home-hero-hover-image" />
                        </div>
                        <?php $image_schematic = get_sub_field('image_one_schematic');
                        $image_hover = get_sub_field('image_one_hover_image');
                        ?>
                        <div class="position-<?php the_sub_field('image_two_position'); ?> home-hero-image-container">
                            <img src="<?php echo esc_url($image_schematic['url']); ?>" alt="<?php echo esc_attr($image_schematic['alt']); ?>" class="home-hero-schematic-image" />
                            <img src="<?php echo esc_url($image_hover['url']); ?>" alt="<?php echo esc_attr($image_hover['alt']); ?>" class="home-hero-hover-image" />
                        </div>

                    </li>
                    <?php $count++; ?>
            <?php endwhile;
            endif; ?>
        </ul>
    </div>
</div>
