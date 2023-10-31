<section <?php echo get_block_wrapper_attributes(['class' => 'top-articles']); ?>>
    <h4><?php the_field('featured_articles_title', 'option'); ?></h4>
    <?php if (have_rows('featured_articles', 'option')) :
        while (have_rows('featured_articles', 'option')) : the_row();
    ?>
            <a href="<?php the_permalink(get_sub_field('article')->ID); ?>" class="featured-article">
                <div class="featured-article-title"><?php echo get_the_title(get_sub_field('article')->ID); ?></div>
            </a>
    <?php endwhile;
    endif; ?>
</section>
