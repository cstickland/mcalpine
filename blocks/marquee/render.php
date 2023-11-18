<div <?php echo get_block_wrapper_attributes(['class' => 'marquee-block']); ?>>
    <?php if (have_rows('marquee')) : ?>
        <?php while (have_rows('marquee')) : the_row(); ?>
            <div class="wrap marquee-container" id="containerElem">
                <ul class="marquee-text-container">

                    <li class="marquee-text">
                        <?php the_sub_field('marquee_text'); ?>
                    </li>
                    <li class="marquee-text">
                        <?php the_sub_field('marquee_text'); ?>
                    </li>
                    <li class="marquee-text">
                        <?php the_sub_field('marquee_text'); ?>
                    </li>
                </ul>
            </div>
        <?php endwhile; ?>

    <?php endif; ?>
</div>
