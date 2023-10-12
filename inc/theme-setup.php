<?php

function mcalpine_setup()
{
    load_theme_textdomain('mcalpine', get_template_directory() . '/languages');

    add_editor_style('style.css');
    add_theme_support('title-tag');
    add_theme_support('editor-styles');
    add_theme_support('wp_block_styles');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    add_theme_support(
        'html5',
        array(
            'search-form',
            'caption',
            'style',
            'script',
        )
    );

    add_theme_support(
        'custom-logo',
        array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );

    register_nav_menus(
        array(
            'navbar' => esc_html__('Navbar', 'mcalpine'),
            'interests' => esc_html__('Interest', 'mcalpine'),
            'footer' => esc_html__('Footer', 'mcalpine'),
        )
    );
}

add_action('after_setup_theme', 'mcalpine_setup');

add_editor_style('editor-style.css');

function mcalpine_register_scripts()
{
    wp_enqueue_style('mcalpine-style', get_stylesheet_uri(), array(),);
    wp_style_add_data('mcalpine-style', 'rtl', 'replace');

    wp_enqueue_style('search-form', get_template_directory_uri() . "/components/search/dist/search-form.css", array(),);
    wp_enqueue_style('mobile-nav', get_template_directory_uri() . "/components/mobile-nav/dist/mobile-nav.css", array(),);
    wp_enqueue_style('product-menu', get_template_directory_uri() . "/components/desktop-product-menu/dist/product-menu.css", array(),);

    wp_enqueue_script('search-form-js', get_template_directory_uri() . "/components/search/dist/search.js", array(), array());
    wp_enqueue_script('mobile-nav-js', get_template_directory_uri() . "/components/mobile-nav/dist/mobile-nav.js", array(), array());
    wp_enqueue_script('product-menu-js', get_template_directory_uri() . "/components/desktop-product-menu/dist/product-menu.js", array(), array());

    if (is_home()) {
        wp_enqueue_script('insight-archive-js', get_template_directory_uri() . "/components/insight-archive/dist/insight-archive.js", array(), array());
    }

    if (is_page_template('where-to-buy.php')) {
        wp_enqueue_script('where-to-find-us-js', get_template_directory_uri() . "/components/where-to-find-us/dist/map-component.js", array(), array());
    }
}


add_action('wp_enqueue_scripts', 'mcalpine_register_scripts');
