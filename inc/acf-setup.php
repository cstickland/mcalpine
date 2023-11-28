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
    if (is_home() && $query->is_main_query()) {

        $query->set('posts_per_page', -1);
    }

    if (is_page_template('faq.php') && $query->is_main_query()) {
        $query->set('posts_per_page', -1);
    }

    if ((is_category() || is_tag()) && $query->is_archive() && empty($query->query_vars['suppress_filters'])) {
        $query->set('post_type', array(
            'post', 'product'
        ));
    }
});
