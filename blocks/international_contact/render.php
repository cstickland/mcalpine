<div <?php echo get_block_wrapper_attributes(['class' => 'international-contact']); ?>>
    <h2><?php the_field('title'); ?></h2>
    <div class="international-contact-grid">
        <?php if (have_rows('international_contacts')) :
            while (have_rows('international_contacts')) : the_row();
        ?>
                <div class="international-contact-container">
                    <div class="flag-images">
                        <?php if (have_rows('flag_images')) :
                            while (have_rows('flag_images')) : the_row();
                                $image = get_sub_field('flag_image');
                                if (!empty($image)) :
                        ?>
                                    <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" />
                                <?php endif; ?>
                        <?php endwhile;
                        endif; ?>
                    </div>
                    <div class="contact-information">
                        <h5><?php the_sub_field('country'); ?></h5>
                        <div><?php the_sub_field('company_name'); ?></div>
                        <?php
                        $link = get_sub_field('link');
                        if ($link) :
                            $link_url = $link['url'];
                            $link_title = $link['title'];
                            $link_target = $link['target'] ? $link['target'] : '_self';
                        ?>
                            <a class="company-link" href="<?php echo esc_url($link_url); ?>" target="<?php echo esc_attr($link_target); ?>"><?php echo esc_html($link_title); ?></a>
                        <?php endif; ?>
                    </div>
                </div>
        <?php endwhile;
        endif; ?>
    </div>
</div>
