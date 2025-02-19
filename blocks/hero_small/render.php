<?php
$term = get_queried_object();


$link =  null;
$title = !empty(get_field('title')) ? get_field('title') : $term->name;
$message =  !empty(get_field('message')) ? get_field('message') : get_field('hero_message', $term);

if (isset($term)) {
    if ($term->taxonomy == 'post_tag') {
        if ($term->description != "") {
            $message = $term->description;
        }
    }
}
$image = !empty(get_field('image')) ? get_field('image') : get_field('category_hero_image', $term);
$breadcrumb_end = 'hello';

if (isset($term) && $term->parent != 0 && isset($term->parent)) {
    $parent = get_term($term->parent);

    $link['url'] = site_url() . '/product_categories/' . $parent->slug;
    $link['title'] = $parent->name;
}
if (is_archive()) {
    $breadcrumb_end = $term->name;
} else {
    $breadcrumb_end = get_the_title();
};

if (get_post_type() == 'page' && has_post_parent()) {
    $parent = get_post_parent();
    $link['url'] = get_permalink($parent);
    $link['title'] = $parent->post_title;
}

?>



<div <?php echo get_block_wrapper_attributes(['class' => 'small-hero-block animate']); ?>>
    <div class="small-hero-content">
        <div class="hero-breadcrumbs">
            <a href="<?php echo get_site_url(); ?>">Home</a>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                </svg>
            </span>
            <?php
            if ($link) :
                $link_url = $link['url'];
                $link_title = $link['title'];
            ?>
                <a class="breadcrumb-middle-link" href="<?php echo esc_url($link_url); ?>"><?php echo esc_html($link_title); ?></a>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                </span>
            <?php endif; ?>
            <div class="breadcrumbs-current"><?php echo $breadcrumb_end; ?></div>
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
