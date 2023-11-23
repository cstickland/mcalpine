<div <?php echo get_block_wrapper_attributes(['class' => 'video-block hide-controls']); ?>>
    <div class="video-muted" data-video="<?php the_field('video_url'); ?>"></div>
    <div class="play-button">
    </div>

    <div class="video-block-hash">
        <div class="red-block"></div>
        <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
    </div>
</div>
