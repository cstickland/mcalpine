<?php

require_once('blocks/acf-blocks.php');
require_once('inc/custom-field-search.php');
require_once('inc/graphql-setup.php');
require_once('inc/acf-setup.php');
require_once('inc/theme-setup.php');
require_once('inc/wpai-setup.php');
require_once('inc/login-style.php');


// help prevent cross site scripting by setting X-frame-options to SAMEORIGIN
add_action('send_headers', 'send_frame_options_header', 10, 0);


add_filter('gform_submit_button', 'add_custom_css_classes', 10, 2);
function add_custom_css_classes($button, $form)
{
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $button);
    $input = $dom->getElementsByTagName('input')->item(0);
    $classes = $input->getAttribute('class');
    $classes .= " btn btn-black btn-arrow";
    $input->setAttribute('class', $classes);
    return $dom->saveHtml($input);
}



function add_acf_columns($columns)
{
    return array_merge($columns, array(
        'skus' => __('Skus'),
    ));
}
add_filter('manage_product_posts_columns', 'add_acf_columns');


/*
 * Add columns to Product post list in admin panel
 */
function address_custom_column($column, $post_id)
{
    $skus = '';
    if (have_rows('skus', $post_id)) :
        while (have_rows('skus')) : the_row();
            $skus .= get_sub_field('sku') . ', ';
        endwhile;
    endif;
    if ($column === 'skus') {
        echo $skus;
    }
}
add_action('manage_product_posts_custom_column', 'address_custom_column', 10, 2);

add_filter('run_wptexturize', '__return_false');


// function livchem_search_filter($s)
// {
//     return urldecode($s);
// }
//
// add_filter('get_search_query', 'livchem_search_filter');
// add_filter('the_search_query', 'livchem_search_filter');
//
// function livchem_query_vars_search_filter($query)
// {
//     if ($query->is_search && !!is_admin()) {
//         $query->query_vars['s'] = urldecode($query->query_vars['s']);
//         $query->query_vars['s'] = str_replace('″', '"', $query->query_vars['s']);
//     }
//
//     return $query;
// }
// add_action('parse_query', 'livchem_query_vars_search_filter');
//
//
/**
 * Disabling Gutenberg
 *
 * @param $use_block_editor
 * @param $post_type
 *
 * @return false|mixed
 */
if (!function_exists('pac_ft_disable_gutenberg')) :
    function pac_ft_disable_gutenberg($use_block_editor, $post_type)
    {
        $post_types = ['post', 'faq'];
        if (in_array($post_type, $post_types)) {
            $use_block_editor = false;
        }
        return $use_block_editor;
    }
    add_filter('use_block_editor_for_post_type', 'pac_ft_disable_gutenberg', 999, 2);
endif;
