<div <?php echo get_block_wrapper_attributes(['class' => 'content-block']); ?>">
    <div class="content-container 
            align-<?php the_field('vertical_alignment'); ?> 
            justify-<?php the_field('horizontal_alignment'); ?>
            <?php the_field('width'); ?>    ">
        <div class="content-text">
            <?php if (get_field('style') == 'regular') { ?>
                <h1><?php the_field('title'); ?></h1>
                <p><?php the_field('text'); ?></p>
                <?php if (get_field('show_button') == true) { ?>
                    <?php if (have_rows('button')) :
                        while (have_rows('button')) : the_row(); ?>
                            <a href="<?php the_sub_field('link'); ?>" class="btn btn-solid">
                                <?php the_sub_field('text'); ?>
                            </a>
                    <?php endwhile;
                    endif; ?>
            <?php }
            } ?>

            <?php if (get_field('style') == 'quote') { ?>
            <?php } ?>
        </div>
        <img class="content-block-image" src="<?php the_field('background_image'); ?>" />
    </div>
</div>
