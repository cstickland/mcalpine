<?php

add_filter('register_taxonomy_args', function ($args, $taxonomy) {

    if ('product_categories' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'productCategory';
        $args['graphql_plural_name'] = 'productCategories';
    }
    if ('download_categories' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'downloadCategory';
        $args['graphql_plural_name'] = 'downloadCategories';
    }
    if ('download_types' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'downloadType';
        $args['graphql_plural_name'] = 'downloadTypes';
    }
    if ('faq_categories' === $taxonomy) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'faqCategory';
        $args['graphql_plural_name'] = 'faqCategories';
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
    if ('download' === $post_type) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'download';
        $args['graphql_plural_name'] = 'downloads';
    }
    if ('faq' === $post_type) {
        $args['show_in_graphql'] = true;
        $args['graphql_single_name'] = 'faq';
        $args['graphql_plural_name'] = 'faqs';
    }

    return $args;
}, 10, 2);


// Add fields to filter download via their custom taxonomies in GraphQL

add_action('graphql_register_types', function () {

    $customposttype_graphql_single_name = "Download";
    register_graphql_field('RootQueryTo' . $customposttype_graphql_single_name . 'ConnectionWhereArgs', 'downloadCategories', [
        'type' => ['list_of' => 'String'], // To accept multiple strings
        'description' => __('Filter by post objects that have the specific category slug', 'your_text_domain'),
    ]);
    register_graphql_field('RootQueryTo' . $customposttype_graphql_single_name . 'ConnectionWhereArgs', 'downloadTypes', [
        'type' => ['list_of' => 'String'], // To accept multiple strings
        'description' => __('Filter by post objects that have the specific category slug', 'your_text_domain'),
    ]);
});

// Add a filter to modify the query arguments.
add_filter('graphql_post_object_connection_query_args', function ($query_args, $source, $args, $context, $info) {

    $categorySlug = $args['where']['downloadCategories'];
    $downloadTypeSlug = $args['where']['downloadTypes'];

    $categorySlugArray = [
        'taxonomy' => 'download_categories',
        'field' => 'slug',
        'terms' => $categorySlug
    ];
    $downloadTypeSlugArray = [
        'taxonomy' => 'download_types',
        'field' => 'slug',
        'terms' => $downloadTypeSlug
    ];

    if (isset($categorySlug) && isset($downloadTypeSlug)) {
        $query_args['tax_query'] = [
            'relation' => 'AND',
            $categorySlugArray,
            $downloadTypeSlugArray
        ];
    }

    if (isset($categorySlug) && !isset($downloadTypeSlug)) {
        $query_args['tax_query'] = [
            $categorySlugArray
        ];
    }

    if (isset($downloadTypeSlug) && !isset($categorySlug)) {
        $query_args['tax_query'] = [
            $downloadTypeSlugArray
        ];
    }

    return $query_args;
}, 10, 5);
