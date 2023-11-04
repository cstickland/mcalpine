<?php

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
    if ('product' === $post_type) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'product';
        $args['graphql_plural_name'] = 'products'; # Don't set, and it will default to `all${graphql_single_name}`, i.e. `allDocument`.
    }
    if ('warranty' === $post_type) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'warranty';
        $args['graphql_plural_name'] = 'warranties'; # Don't set, and it will default to `all${graphql_single_name}`, i.e. `allDocument`.
    }

    return $args;
}, 10, 2);
