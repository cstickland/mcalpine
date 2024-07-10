<?php

$is_product_page = "page";
if (get_post_type() == 'product') {
    $is_product_page = 'product';
}

?>

<div <?php echo get_block_wrapper_attributes(['class' => 'review-block reviews-desktop ' . get_field('colour_style') . ' ' . $is_product_page]);  ?> id="reviews">
    <div class="review-block-container">
        <div class="reviews-title-section">
            <h3><?php the_field('title'); ?></h3>
            <p><?php the_field('text'); ?></p>
            <?php
            if (get_field('show_button') == true) :
                if (have_rows('button')) :
                    while (have_rows('button')) : the_row();
            ?>
                        <a href="<?php the_sub_field('button_url'); ?>" class="btn <?php if (get_field('colour_style') == 'red') {
                                                                                        echo 'btn-red btn-outline';
                                                                                    } else {
                                                                                        echo 'btn-black';
                                                                                    } ?>">
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

                            for ($i = 0; $i < 5; $i++) {
                                if ($i < $rating) { ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M394 480a16 16 0 0 1-9.39-3L256 383.76L127.39 477a16 16 0 0 1-24.55-18.08L153 310.35L23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480" />
                                    </svg>

                                <?php } else { ?>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16zm-127.2 92.5c-10 7.2-14.2 20.2-10.2 31.8l30.1 87.7c1.3 3.7-2.9 6.8-6.1 4.6l-77.4-55.2c-4.9-3.5-10.6-5.2-16.3-5.2-5.7 0-11.4 1.7-16.2 5.2l-77.4 55.1c-3.2 2.3-7.4-.9-6.1-4.6l30.1-87.7c4-11.8-.2-24.8-10.3-32l-81-57.1c-3.2-2.2-1.6-7.3 2.3-7.3H196c12 0 22.7-7.7 26.5-19.1l29.6-88.2c1.2-3.6 6.4-3.6 7.6 0l29.6 88.2c3.8 11.4 14.5 19.1 26.5 19.1h97.3c3.9 0 5.5 5 2.3 7.2l-79.6 57.5z" fill="currentColor" />
                                    </svg>
                            <?php }
                            }

                            ?>
                        </div>
                        <div class="review-card-comment"><?php the_sub_field('comment'); ?> </div>
                        <div class="review-card-author-container">
                            <?php
                            $image = get_sub_field('photo_image');
                            if ($image) :
                                $imageurl = $image['url'];
                                $imagealt = $image['alt'];
                                $imagetitle = $image['title'];
                            ?>
                                <img src="<?php echo $imageurl; ?>" alt="<?php echo $imagealt; ?>" />
                            <?php endif; ?>
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

<div <?php echo get_block_wrapper_attributes(['class' => 'review-block ' . get_field('colour_style') . ' accordion ' . $is_product_page]);  ?> id="reviews-product">
    <?php if ($is_product_page == "product") : ?>
        <div class="accordion-question-container">
            <h2>Reviews</h2>

            <div class="accordion-toggle-icon">
                <div class="vertical-line"></div>
                <div class="horizontal-line"></div>
            </div>
        </div>
    <?php endif; ?>
    <div class="review-block-container accordion-answer">
        <div class="<?php if ($is_product_page == 'product') {
                        echo 'answer';
                    } ?>">
            <div class="reviews-title-section ">
                <h3><?php the_field('title'); ?></h3>
            </div>

            <?php if (have_rows('reviews', 'option')) : ?>
                <div class="slider-controls">
                    <button class="arrow-prev">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                            <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                        </svg>
                    </button>
                    <button class="arrow-next">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                            <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                        </svg>
                    </button>
                </div>
                <ul class="reviews-cards mobile">
                    <?php
                    $index = 0;
                    while (have_rows('reviews', 'option')) : the_row(); ?>
                        <li class="reviews-card <?php if ($index == 0) {
                                                    echo "active";
                                                } ?>">
                            <div class="review-card-rating">
                                <?php
                                $rating = get_sub_field('rating');

                                for ($i = 0; $i < 5; $i++) {
                                    if ($i < $rating) { ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M394 480a16 16 0 0 1-9.39-3L256 383.76L127.39 477a16 16 0 0 1-24.55-18.08L153 310.35L23 221.2a16 16 0 0 1 9-29.2h160.38l48.4-148.95a16 16 0 0 1 30.44 0l48.4 149H480a16 16 0 0 1 9.05 29.2L359 310.35l50.13 148.53A16 16 0 0 1 394 480" />
                                        </svg>

                                    <?php } else { ?>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16zm-127.2 92.5c-10 7.2-14.2 20.2-10.2 31.8l30.1 87.7c1.3 3.7-2.9 6.8-6.1 4.6l-77.4-55.2c-4.9-3.5-10.6-5.2-16.3-5.2-5.7 0-11.4 1.7-16.2 5.2l-77.4 55.1c-3.2 2.3-7.4-.9-6.1-4.6l30.1-87.7c4-11.8-.2-24.8-10.3-32l-81-57.1c-3.2-2.2-1.6-7.3 2.3-7.3H196c12 0 22.7-7.7 26.5-19.1l29.6-88.2c1.2-3.6 6.4-3.6 7.6 0l29.6 88.2c3.8 11.4 14.5 19.1 26.5 19.1h97.3c3.9 0 5.5 5 2.3 7.2l-79.6 57.5z" fill="currentColor" />
                                        </svg>
                                <?php }
                                }

                                ?>
                            </div>
                            <div class="review-card-comment"><?php the_sub_field('comment'); ?> </div>
                            <div class="review-card-author-container">
                                <?php
                                $image = get_sub_field('photo_image');
                                if ($image) :
                                    $imageurl = $image['url'];
                                    $imagealt = $image['alt'];
                                    $imagetitle = $image['title'];
                                ?>
                                    <img src="<?php echo $imageurl; ?>" alt="<?php echo $imagealt; ?>" />
                                <?php endif; ?>
                                <div>
                                    <div class="review-card-author-name"><?php the_sub_field('name'); ?></div>
                                    <div class="review-card-author-company"><?php the_sub_field('company_name'); ?></div>
                                </div>
                            </div>
                        </li>
                    <?php $index++;
                    endwhile; ?>
                </ul>
            <?php endif; ?>
        </div>
    </div>
</div>


<script>
    const container = document.getElementById('reviews-product');

    const arrowPrevious = container.querySelector('.arrow-prev');
    const arrowNext = container.querySelector('.arrow-next');

    const reviews = container.querySelectorAll('.reviews-card');
    let active = 0;

    arrowPrevious.addEventListener('mousedown', () => {
        reviews[active].classList.add('fade');

        setTimeout(() => {
            reviews[active].classList.remove('active');
            reviews[active].classList.remove('fade');
            if (active == 0) {
                active = reviews.length - 1;
                reviews[active].classList.add('active')
                return;
            }
            active--;
            reviews[active].classList.add('active')

        }, 350)
    })

    arrowNext.addEventListener('mousedown', () => {
        reviews[active].classList.add('fade');

        setTimeout(() => {
            reviews[active].classList.remove('active');
            reviews[active].classList.remove('fade');

            if (active == reviews.length - 1) {
                active = 0
                reviews[active].classList.add('active')
                return
            }
            active++;
            reviews[active].classList.add('active')

        }, 350)
    })
</script>
