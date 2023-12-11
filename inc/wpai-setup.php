<?php

function create_only_if_unique_title($continue_import, $data, $import_id)
{
    $title = $data['name'];


    $query = get_posts([
        'post_type' => array('product', 'post'),
        'title' => $title,
    ]);

    if (count($query) > 0) {
        return false;
    }


    return true;
}

add_filter('wp_all_import_is_post_to_create', 'create_only_if_unique_title', 10, 3);


// function soflyy_add_data($id, $xml, $update)
// {
//
//     // Parent field name.
//     $selector = 'skus';
//
//     // The fields to be appended.
//     $sku = get_post_meta($id, 'my_repeater_sku', true);
//     $description = get_post_meta($id, 'my_repeater_description', true);
//     $config_label = get_post_meta($id, 'my_repeater_config_label', true);
//     $config_attribute = get_post_meta($id, 'my_repeater_config_attribute', true);
//     $installation_instructions = get_post_meta($id, 'my_repeater_installation_instructions', true);
//     $technical_drawing = get_post_meta($id, 'my_repeater_technical_drawing', true);
//     $image = get_post_meta($id, 'my_repeater_image', true);
//     $features = get_post_meta($id, 'my_repeater_features', true);
//
//
//     $row = array(
//         'sku' => $sku,
//         'product_config_label' => $config_label,
//         'product_config_attribute' => $config_attribute,
//         'product_description' => $description,
//         'product_installation_instructions' => $installation_instructions,
//         'product_technical_drawing' => $technical_drawing
//     );
//
//
//     delete_post_meta($id, 'my_repeater_sku');
//     delete_post_meta($id, 'my_repeater_image');
//     delete_post_meta($id, 'my_repeater_config_label');
//     delete_post_meta($id, 'my_repeater_config_attribute');
//     delete_post_meta($id, 'my_repeater_features');
//     delete_post_meta($id, 'my_repeater_description');
//     delete_post_meta($id, 'my_repeater_technical_drawing');
//     delete_post_meta($id, 'my_repeater_installation_instructions');
// }
//
// add_action('pmxi_saved_post', 'soflyy_add_data', 10, 3);
