<?php



?>

<div <?php echo get_block_wrapper_attributes(['class' => 'info-card']); ?> id="query-<?php the_title(); ?>">
    <div class="info-card-text">
        <div class="info-card-title"><b>0<?php the_field('card_number'); ?></b> <?php the_field('title_text'); ?></div>
        <div class="info-card-message">
            <div><?php the_field('main_text'); ?></div>
        </div>
    </div>
</div>
