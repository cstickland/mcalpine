<div <?php echo get_block_wrapper_attributes(['class' => 'grid-block animate ' . get_field('mobile_style')]); ?>>
    <div class="grid-title-container">
        <h2 class="grid-title <?php the_field('title_color'); ?> <?php the_field('title_alignment'); ?>">
            <?php the_field('title'); ?>
        </h2>
    </div>
    <ul class="grid-block-grid">
        <?php foreach (get_the_tags() as $tag) { ?>
            <li>
                <a href="<?php echo get_tag_link($tag); ?>">
                    <?php echo $tag->name; ?>
                </a>
            </li>
        <?php } ?>
    </ul>

</div>

<style>
    .grid-block {
        padding-bottom: 5rem;
    }

    .grid-block .acf-innerblocks-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
</style>
