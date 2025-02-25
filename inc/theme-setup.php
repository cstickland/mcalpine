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
            'mobilenav' => esc_html__('Mobilev1', 'mcalpine'),
            'productcategories' => esc_html__('Product Category Order', 'mcalpine')
        )
    );
}

add_action('after_setup_theme', 'mcalpine_setup');

add_editor_style();

function mcalpine_register_scripts()
{
    wp_enqueue_style('mcalpine-style', get_stylesheet_uri(), array(),);
    wp_style_add_data('mcalpine-style', 'rtl', 'replace');

    wp_enqueue_style('search-form', get_template_directory_uri() . "/components/search/dist/search-form.css", array(),);
    wp_enqueue_style('mobile-nav', get_template_directory_uri() . "/components/mobile-nav/dist/mobile-nav.css", array(),);
    wp_enqueue_style('product-menu', get_template_directory_uri() . "/components/desktop-product-menu/dist/product-menu.css", array(),);
    wp_enqueue_script('vimeo', "https://player.vimeo.com/api/player.js", array(), array());
    wp_enqueue_script('search-form-js', get_template_directory_uri() . "/components/search/dist/search.js", array(), array());
    wp_enqueue_script('mobile-nav-js', get_template_directory_uri() . "/components/mobile-nav/dist/mobile-nav.js", array(), array());
    wp_enqueue_script('product-menu-js', get_template_directory_uri() . "/components/desktop-product-menu/dist/product-menu.js", array(), array());

    wp_enqueue_script('insight-archive-js', get_template_directory_uri() . "/components/insight-archive/dist/insight-archive.js", array(), array());


    if (is_page_template('faq.php')) {

        wp_enqueue_script('faq-js', get_template_directory_uri() . "/components/faq/dist/faq-archive.js", array(), array());
    }

    wp_enqueue_script('search-archive-js', get_template_directory_uri() . "/components/search-archive/dist/search-archive.js", array(), array());

    wp_enqueue_script('category-archive-js', get_template_directory_uri() . "/components/category-archive/dist/category-archive.js", array(), array());

    wp_enqueue_script('animate-on-scroll', get_template_directory_uri() . "/js/animate-on-scroll.js", array(), array());


    wp_enqueue_script('product-hero', get_template_directory_uri() . "/components/product-hero/dist/product-hero.js", array(), array());
    wp_enqueue_script('product-downloads', get_template_directory_uri() . "/components/product-downloads/dist/product-downloads.js", array(), array());
    if (is_archive()) {

        wp_enqueue_script('download-archive-js', get_template_directory_uri() . "/components/download-archive/dist/download-archive.js", array(), array());
        wp_enqueue_style('download-archive', get_template_directory_uri() . "/components/download-archive/dist/download-archive.css", array(), array());
    }

    wp_enqueue_style('search-archive', get_template_directory_uri() . "/components/search-archive/dist/bundle.css", array(),);
}


add_action('wp_enqueue_scripts', 'mcalpine_register_scripts');


add_filter('allowed_block_types_all', 'rt_allowed_block_types', 25, 2);

function rt_allowed_block_types($allowed_blocks, $editor_context)
{
    if (get_current_screen()->is_block_editor()) {
        if ('warranty' === $editor_context->post->post_type) {
            $allowed_blocks = array(
                'mcalpine/hero-contact'
            );
            return $allowed_blocks;
        }
        if ('product' === $editor_context->post->post_type) {
            $allowed_blocks = array(
                'acf/reviews',
                "mcalpine/product-suitability",
                'mcalpine/product-details',
                'mcalpine/image-text-product',
                'mcalpine/image-text-details',
                'acf/find-product',
                'mcalpine/product-highlights',
                'mcalpine/product-faq',
                'mcalpine/product-specifications',
                'mcalpine/product-downloads'
            );
            return $allowed_blocks;
        }
        if ('post' === $editor_context->post->post_type) {
            $allowed_blocks = array(
                'core/freeform'
            );
            return $allowed_blocks;
        }


        $allowed_blocks = array(
            'mcalpine/interactive-map',
            'mcalpine/hero-contact',
            'mcalpine/image-text',
            'create-block/grid',
            'mcalpine/grid-text',
            'acf/cta',
            "mcalpine/category-card",
            "acf/faq-archive",
            "acf/faq-contact",
            "mcalpine/help-card",
            "mcalpine/hero-contact",
            "mcalpine/featured-insight-hero",
            "mcalpine/home-hero",
            "mcalpine/large-hero",
            "mcalpine/small-hero",
            "mcalpine/image-text-slider",
            "mcalpine/info-card",
            "mcalpine/insight-card",
            "mcalpine/interest-cards",
            "mcalpine/international-contact",
            "mcalpine/member-institutions",
            "mcalpine/new-product-feature",
            "mcalpine/newsletter",
            "mcalpine/product-card",
            "mcalpine/prodcut-guide-cta",
            "acf/reviews",
            "mcalpine/info-card",
            "mcalpine/vertical-text",
            "mcalpine/timeline",
            "mcalpine/search-hero",
            "mcalpine/marquee",
            "core/freeform",
            "mcalpine/image-text-full",
            "mcalpine/video"
        );
        return $allowed_blocks;
    }
}

function custom_admin_head()
{
    $css = '';

    $css = 'td.media-icon img[src$=".svg"] { width: 100% !important; height: auto !important; }';

    echo '<style type="text/css">' . $css . '</style>';
}
add_action('admin_head', 'custom_admin_head');

function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');
