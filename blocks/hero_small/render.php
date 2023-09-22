<?php
$term = get_queried_object();
$link = !empty(get_field('breadcrumb_middle_link')) ? get_field('breadcrumb_middle_link') : array('title' => 'Products', 'url' => get_site_url() . '/products');
$title = !empty(get_field('title')) ? get_field('title') : $term->name;
$message =  !empty(get_field('message')) ? get_field('message') : get_field('hero_message', $term);
$image = !empty(get_field('image')) ? get_field('image') : get_field('category_image', $term);
?>



<div <?php echo get_block_wrapper_attributes(['class' => 'small-hero-block']); ?>>
    <div class="small-hero-content">
        <div class="hero-breadcrumbs">
            <a href="<?php echo get_site_url(); ?>">Home</a>
            <span>></span>
            <?php
            if ($link) :
                $link_url = $link['url'];
                $link_title = $link['title'];
            ?>
                <a class="breadcrumb-middle-link" href="<?php echo esc_url($link_url); ?>"><?php echo esc_html($link_title); ?></a>
                <span>></span>
            <?php endif; ?>
            <div class="breadcrumbs-current"><?php the_title(); ?></div>
        </div>
        <h1><?php echo $title; ?></h1>
        <p class="small-hero-text"><?php echo $message; ?></p>
    </div>
    <div class="small-hero-image-container">
        <?php if ($image) :
        ?>
            <img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>">
        <?php endif; ?>
    </div>
</div>
