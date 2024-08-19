<div <?php echo get_block_wrapper_attributes(['class' => 'suitability-block animate ' . get_field('background_color')]); ?> id="suitability">
    <div class="suitability-content-container">
        <div class="grid-title-container">
            <h2 class="grid-title <?php the_field('title_color'); ?> <?php the_field('title_alignment'); ?>">
                Downloads
            </h2>
        </div>
        <ul class="grid-block-grid">
            <div><?php echo get_field('product_technical_drawing'); ?></div>
            <!-- <?php foreach (get_the_tags() as $tag) { ?> -->
            <!--     <li> -->
            <!--         <a href="<?php echo get_tag_link($tag); ?>"> -->
            <!--             <?php echo $tag->name; ?> -->
            <!---->
            <!--             <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245"> -->
            <!--                 <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" /> -->
            <!--             </svg> -->
            <!--         </a> -->
            <!--     </li> -->
            <!-- <?php } ?> -->
        </ul>
    </div>
</div>
<div <?php echo get_block_wrapper_attributes(['class' => 'suitability-block animate accordion ' . get_field('background_color')]); ?> id="suitability">
    <div class=" accordion-question-container">
        <h2 class="grid-title <?php the_field('title_color'); ?> <?php the_field('title_alignment'); ?>">
            <?php the_field('title'); ?>
        </h2>
        <div class="accordion-toggle-icon">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
        </div>

    </div>
    <div class="accordion-answer">
        <div class="suitability-content-container answer">
            <ul class="grid-block-grid">
                <?php foreach (get_the_tags() as $tag) { ?>
                    <li>
                        <a href="<?php echo get_tag_link($tag); ?>">
                            <?php echo $tag->name; ?>

                            <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                                <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                            </svg>
                        </a>
                    </li>
                <?php } ?>
            </ul>
        </div>
    </div>
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
