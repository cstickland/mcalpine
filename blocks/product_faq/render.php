<section id="product-faq" <?php echo get_block_wrapper_attributes(['class' => 'product-faq animate ' . get_field('background_color')]); ?>>
    <h2 class="product-faq-title"><?php the_field('title'); ?></h2>
    <?php if (have_rows('questions')) : ?>
        <ul class="faq-list">
            <?php while (have_rows('questions')) : the_row();
                if (get_sub_field('choose_existing') == true) {
                    $id = get_sub_field('existing_faq');
                    $question = get_the_title($id);
                    $answer = get_field('answer', $id);
                } else {
                    $question = get_sub_field('question_text');
                    $answer = get_sub_field('answer_text');
                }
            ?>
                <li class="accordion">
                    <div class="open-gradient"></div>
                    <div class="accordion-question-container">
                        <h5 class="accordion-question"><?php echo $question; ?></h5>

                        <div class="accordion-toggle-icon">
                            <div class="vertical-line"></div>
                            <div class="horizontal-line"></div>
                        </div>
                    </div>

                    <div class="accordion-answer" transition:slide>
                        <div itemprop="text"><?php echo $answer; ?></div>
                    </div>

                </li>
            <?php endwhile; ?>
        </ul>
    <?php endif; ?>
</section>
