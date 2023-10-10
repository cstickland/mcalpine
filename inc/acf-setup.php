<?php


if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'    => 'Theme Settings',
        'menu_title'    => 'Theme Settings',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false,
        'show_in_graphql' => true
    ));
}
add_action('pre_get_posts', function ($query) {
    if (!is_admin() && is_archive() && $query->is_main_query()) {
        $query->set('posts_per_page', -1);
    }
});

// function my_acf_init()
// {
//     acf_update_setting('google_api_key', 'AIzaSyD5zYzn6gCx_zKuQWuVM7irstRvmG7-7bs');
// }
// add_action('acf/init', 'my_acf_init');

function my_acf_google_map_api($api)
{
    $api['key'] = 'AIzaSyD5zYzn6gCx_zKuQWuVM7irstRvmG7-7bs';
    return $api;
}
add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');
