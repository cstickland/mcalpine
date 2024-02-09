<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <?php if (have_rows('top_of_head', 'option')) :
        while (have_rows('top_of_head', 'option')) : the_row();
            if (get_sub_field('enable_script')) {
                echo get_sub_field('script');
            }
        endwhile;
    endif; ?>
    <meta charset="<?php bloginfo('charset'); ?>">
    <link rel="canonical" href="<?php echo get_permalink(); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
    <?php if (have_rows('bottom_of_head', 'option')) :
        while (have_rows('bottom_of_head', 'option')) : the_row();
            if (get_sub_field('enable_script')) {
                echo get_sub_field('script');
            }
        endwhile;
    endif; ?>
</head>

<body <?php body_class(); ?>>
    <?php if (have_rows('top_of_body', 'option')) :
        while (have_rows('top_of_body', 'option')) : the_row();
            if (get_sub_field('enable_script')) {
                echo get_sub_field('script');
            }
        endwhile;
    endif; ?>
    <?php wp_body_open(); ?>
    <a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'mcalpine'); ?></a>
    <?php get_template_part("/template-parts/navbar"); ?>
