<?php

require_once('inc/ajax-search.php');
require_once('blocks/acf-blocks.php');
require_once('inc/custom-field-search.php');

add_action('after_setup_theme', 'theme_setup');
function theme_setup()
{
    add_editor_style('style.css');
}
function mcalpine_setup()
{
    load_theme_textdomain('mcalpine', get_template_directory() . '/languages');

    add_theme_support('title-tag');
    add_theme_support('editor-styles');
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
}


add_action('wp_enqueue_scripts', 'mcalpine_register_scripts');


function theme_get_custom_logo()
{
    if (has_custom_logo()) {
        $logo = wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full');
        echo '<img class="site-icon" src="' . esc_url($logo[0]) . '" alt="' . get_bloginfo('name') . '">';
    }
}


add_action('send_headers', 'send_frame_options_header', 10, 0);


if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => 'Theme Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false
    ));
}
add_action('pre_get_posts', function ($query) {
    if (!is_admin() && is_archive() && $query->is_main_query()) {
        $query->set('posts_per_page', -1);
    }
});

function create_only_if_unique_title($continue_import, $data, $import_id)
{
    $title = $data['name'];


    $query = get_posts([
        'post_type' => 'product',
        'title' => $title,
    ]);

    if (count($query) > 0) {
        return false;
    }


    return true;
}

add_filter('wp_all_import_is_post_to_create', 'create_only_if_unique_title', 10, 3);



function soflyy_add_data($id, $xml, $update)
{

    // Parent field name.
    $selector = 'skus';

    // The fields to be appended.
    $sku = get_post_meta($id, 'my_repeater_sku', true);
    $description = get_post_meta($id, 'my_repeater_description', true);
    $config_label = get_post_meta($id, 'my_repeater_config_label', true);
    $config_attribute = get_post_meta($id, 'my_repeater_config_attribute', true);
    $installation_instructions = get_post_meta($id, 'my_repeater_installation_instructions', true);
    $technical_drawing = get_post_meta($id, 'my_repeater_technical_drawing', true);
    $image = get_post_meta($id, 'my_repeater_image', true);
    $features = get_post_meta($id, 'my_repeater_features', true);


    $row = array(
        'sku' => $sku,
        'product_config_label' => $config_label,
        'product_config_attribute' => $config_attribute,
        'product_description' => $description,
        'product_installation_instructions' => $installation_instructions,
        'product_technical_drawing' => $technical_drawing
    );
    //
    // $rows_to_delete = [];
    // if (have_rows('skus', $id)) :
    //     while (have_rows('skus', $id)) : the_row();
    //         if (get_sub_field('sku') == $sku) {
    //             $rows_to_delete[] = get_row_index();
    //         }
    //     endwhile;
    // endif;
    //
    // for ($i = 1; $i < count($rows_to_delete); $i++) {
    //     delete_row($selector, $i, $id);
    // }
    //
    // add_row($selector, $row, $id);
    // //
    // if (have_rows($selector, $id)) :
    //     while (have_rows($selector, $id)) : the_row();
    //         if (get_sub_field('sku') == $sku) {
    //             add_sub_row('product_image', $image);
    //         }
    //     endwhile;
    // endif;

    delete_post_meta($id, 'my_repeater_sku');
    delete_post_meta($id, 'my_repeater_image');
    delete_post_meta($id, 'my_repeater_config_label');
    delete_post_meta($id, 'my_repeater_config_attribute');
    delete_post_meta($id, 'my_repeater_features');
    delete_post_meta($id, 'my_repeater_description');
    delete_post_meta($id, 'my_repeater_technical_drawing');
    delete_post_meta($id, 'my_repeater_installation_instructions');
    //
    // delete_field('sku', $id);
    // delete_field('product_images', $id);
    // delete_field('product_description', $id);
    // delete_field('product_installation_instructions', $id);
    // delete_field('product_technical_drawing', $id);
    // delete_field('product_features', $id);
    // delete_field('product_config_label', $id);
    // delete_field('product_config_attribute', $id);
}

add_action('pmxi_saved_post', 'soflyy_add_data', 10, 3);

add_filter('register_taxonomy_args', function ($args, $taxonomy) {

    if ('product_categories' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'productCategory';
        $args['graphql_plural_name'] = 'productCategories';
    }

    return $args;
}, 10, 2);

add_filter('register_post_type_args', function ($args, $post_type) {

    // Change this to the post type you are adding support for
    if ('products' === $post_type) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'product';
        $args['graphql_plural_name'] = 'products'; # Don't set, and it will default to `all${graphql_single_name}`, i.e. `allDocument`.
    }

    return $args;
}, 10, 2);
