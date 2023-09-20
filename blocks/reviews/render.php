<div <?php echo get_block_wrapper_attributes(['class' => 'review-block']); ?>">
    <div class="review-block-container">
        <div class="reviews-title-section">
            <h3><?php the_field('title'); ?></h3>
            <p><?php the_field('text'); ?></p>
            <?php
            if (get_field('show_button') == true) :
                if (have_rows('button')) :
                    while (have_rows('button')) : the_row();
            ?>

                        <a href="<?php the_sub_field('button_url'); ?>" class="btn btn-red btn-outline">
                            <?php the_sub_field('button_text'); ?>
                        </a>
            <?php endwhile;
                endif;
            endif; ?>
        </div>
        <?php if (have_rows('reviews', 'option')) : ?>
            <ul class="reviews-cards">
                <?php while (have_rows('reviews', 'option')) : the_row(); ?>
                    <li class="reviews-card">
                        <div class="review-card-rating">
                            <?php
                            $rating = get_sub_field('rating');

                            for ($i = 1; $i <= 5; $i++) {
                                if ($rating < $i) {
                                    if (is_float($rating) && (round($rating) == $i)) {
                                        echo "<span>&star;</span>";
                                    } else {
                                        echo "<span>⯨</span>";
                                    }
                                } else {
                                    echo "<span>&starf;</span>";
                                }
                            }

                            ?>
                        </div>
                        <div class="review-card-comment"><?php the_sub_field('comment'); ?> </div>
                        <div class="review-card-author-container">
                            <?php
                            $image = get_sub_field('photo_image');
                            $imageurl = $image['url'];
                            $imagealt = $image['alt'];
                            $imagetitle = $image['title'];
                            ?>
                            <img src="<?php echo $imageurl; ?>" alt="<?php echo $imagealt; ?>" />
                            <div>
                                <div class="review-card-author-name"><?php the_sub_field('name'); ?></div>
                                <div class="review-card-author-company"><?php the_sub_field('company_name'); ?></div>
                            </div>
                        </div>
                    </li>
                <?php endwhile; ?>
            </ul>
        <?php endif; ?>
    </div>
</div>
