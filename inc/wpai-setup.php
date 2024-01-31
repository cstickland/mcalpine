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
