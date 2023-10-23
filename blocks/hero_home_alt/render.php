<div <?php echo get_block_wrapper_attributes(['class' => 'home-hero-block']); ?>>
    <div class="home-hero-background-red"></div>
    <div class="home-hero-background-gradient">
        <div class="gradient-hatching">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
        <div class="gradient-hatching-bottom">
            <img src="<?php echo get_template_directory_uri() . '/assets/hatching_bg.svg'; ?>" alt="hatching">
        </div>
    </div>
    <?php $image = get_field('hero_background_image');
    $image_url = $image['url'];
    ?>
    <div class="home-hero-content" style="background-image: linear-gradient(to bottom, #0b113e66, #0b113e66),url('<?php echo $image_url; ?>')">
        <div class="home-hero-text">
            <h1><?php the_field('hero_title'); ?></h1>
            <p><?php the_field('hero_text'); ?></p>
        </div>

    </div>
</div>
