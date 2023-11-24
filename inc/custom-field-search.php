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


function atom_search_where($where)
{
    global $wpdb;
    if (is_search())
        $where .= "OR (t.name LIKE '%" . get_search_query() . "%' AND {$wpdb->posts}.post_status = 'publish')";
    return $where;
}

function atom_search_join($join)
{
    global $wpdb;
    if (is_search())
        $join .= "LEFT JOIN {$wpdb->term_relationships} tr ON {$wpdb->posts}.ID = tr.object_id INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id=tr.term_taxonomy_id INNER JOIN {$wpdb->terms} t ON t.term_id = tt.term_id";
    return $join;
}

function atom_search_groupby($groupby)
{
    global $wpdb;

    // we need to group on post ID
    $groupby_id = "{$wpdb->posts}.ID";
    if (!is_search() || strpos($groupby, $groupby_id) !== false) return $groupby;

    // groupby was empty, use ours
    if (!strlen(trim($groupby))) return $groupby_id;

    // wasn't empty, append ours
    return $groupby . ", " . $groupby_id;
}

add_filter('posts_where', 'atom_search_where');
add_filter('posts_join', 'atom_search_join');
// add_filter('posts_groupby', 'atom_search_groupby');
