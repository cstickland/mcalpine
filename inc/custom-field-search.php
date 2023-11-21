<?php

/**
 * Extend WordPress search to include custom fields
 *
 * https://adambalee.com
 */

/**
 * Join posts and postmeta tables
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 */
function cf_search_join($join)
{
    global $wpdb;

    if (is_search() || is_graphql_request()) {
        $join .= ' LEFT JOIN ' . $wpdb->postmeta . ' ON ' . $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
    }

    return $join;
}
add_filter('posts_join', 'cf_search_join');

/**
 * Modify the search query with posts_where
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_where
 */
function cf_search_where($where)
{
    global $pagenow, $wpdb;

    if (is_search() || is_graphql_request()) {
        $where = preg_replace(
            "/\(\s*" . $wpdb->posts . ".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "(" . $wpdb->posts . ".post_title LIKE $1) OR (" . $wpdb->postmeta . ".meta_value LIKE $1)",
            $where
        );
    }

    return $where;
}
add_filter('posts_where', 'cf_search_where');

/**
 * Prevent duplicates
 *
 * http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_distinct
 */
function cf_search_distinct($where)
{
    global $wpdb;

    if (is_search() || is_graphql_request()) {
        return "DISTINCT";
    }

    return $where;
}
add_filter('posts_distinct', 'cf_search_distinct');


function mytheme_pre_get_posts($query)
{
    if ($query->is_graphql_request()) {
        $term = get_term_by('name', get_query_var('s'), 'cars');
        if ($term) {
            $query->set('tax_query', array(
                array(
                    'taxonomy' => 'product_categories',
                    'field'    => 'slug',
                    'terms'    =>  $term->slug,
                    'operator' => 'AND'
                )
            ));
        }
    }
}
add_action('pre_get_posts', 'mytheme_pre_get_posts', 1);
