<?php



function advanced_search()
{
    $terms = $_POST['s'];
    // $data = json_decode($terms);
    $args = array(
        'post_type' => array(
            'post',
            'page',
            'product'
        ),
        'posts_per_page' => -1,
        's' => $terms
    );
    $list = array(
        'products' => array(),
        'other' => array(),
        'suggestions' => array()
    );

    // TODO: Swap over to wp_query is 's' in args
    //        include skus in term
    //
    //
    //
    $results = get_posts($args);
    foreach ($results as $result) {
        if ($result->post_type == 'product') {
            $skus = get_field('skus', $result->ID);
            $count = count($skus);

            $list['products'][] = array(
                'name' => $result->post_title,
                'permalink' => get_permalink($result),
                'post_type' => $result->post_type,
                'sku_count' => $count,
                'id' => $result->ID,
                'skus' => $skus
            );
        } else {
            $list['other'][] = array(
                'name' => $result->post_title,
                'permalink' => get_permalink($result),
                'thumbnail' => get_the_post_thumbnail_url($result),
                'post_type' => $result->post_type
            );
        }
        $list['suggestions'][] = $result->post_title;
    }
    header("Content-type: application/json");
    echo json_encode($list);
    die;
}
add_action('wp_ajax_advancedSearch', 'advanced_search'); // wp_ajax_{ACTION HERE} 
add_action('wp_ajax_nopriv_advancedSearch', 'advanced_search');
