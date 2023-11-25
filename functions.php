<?php

require_once('blocks/acf-blocks.php');
require_once('inc/custom-field-search.php');
require_once('inc/graphql-setup.php');
require_once('inc/acf-setup.php');
require_once('inc/theme-setup.php');
require_once('inc/wpai-setup.php');
require_once('inc/ajax-search.php');


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
