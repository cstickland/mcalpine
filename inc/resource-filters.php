<?php
// ----------------- post filters-------------------->
add_action('wp_ajax_myfilter', 'keystore_filter_function'); // wp_ajax_{ACTION HERE} 
add_action('wp_ajax_nopriv_myfilter', 'keystore_filter_function');

function keystore_filter_function(){
    $args = array(
        'post_type' => 'resource',
		'orderby' => 'date', // we will sort posts by date
        'posts_per_page' => 12,
	);
    if( isset( $_POST['file_filter'] ) ){
        $args['file_type'] = $_POST['file_filter'];
    }
    if( isset( $_POST['category'] ) ){
        $categories = $_POST['category'];
        $category_list = '';
        for ($i=0; $i < count($categories); $i++) { 
            $category_list .= $categories[$i];
            if($i != count($categories)-1)
            {
                $category_list .= ', '; 
            }
        }
        $args['category_name'] = $category_list;
    }
    if( isset( $_POST['tag'] ) ){
        $tags = $_POST['tag'];
        $tag_list = '';
        for ($i=0; $i < count($tags); $i++) { 
            $tag_list .= $tags[$i];
            if($i != count($tags)-1)
            {
                $tag_list .= ', '; 
            }
        }
        $args['tag'] = $tag_list;
    }
    if( isset( $_POST['category_url'] ) ){
        $args['category_name'] = $_POST['category_url'];
    }
    if( isset( $_POST['resource_filter'] ) ){
        $args['resource_type'] = $_POST['resource_filter'];
    }
    if( isset($_POST['page'])){
        $args['paged'] = $_POST['page'];
    }
    if( isset($_POST['sort'])){
        $args['order'] = $_POST['sort'];
    }
    if( isset($_POST['favourites'])){
        $args['meta_query'] = array (
            array (
                'key' => '_user_liked',
                'value' => get_current_user_id(),
                'compare' => 'LIKE'
            )
        );        
    }
    
	$query = new WP_Query( $args );

    $args['posts_per_page'] = -1;
    $queryResultNumber = new WP_Query($args);
    
	$results = array();
	if( $query->have_posts() ) :
		while( $query->have_posts() ): $query->the_post();
        $likes = get_post_meta(get_the_ID(), "_user_liked" );
        if(is_user_logged_in()){
            if ( in_array( get_current_user_id(), $likes[0] ) ) {
                $favourite_image = esc_url(get_template_directory_uri()) . '/resources/images/icons/favourite-filled-icon.svg';
            } else {
                $favourite_image = esc_url(get_template_directory_uri()) . '/resources/images/icons/favourite-icon.svg';
            }
        }
        $types = wp_get_post_terms($query->post->ID, $taxonomy = 'file_type', $args = array());
        $filter_nonce = wp_create_nonce( 'simple-likes-nonce' );
        if(has_post_thumbnail()){
            $thumbnail = get_the_post_thumbnail_url();
        } elseif ($types){
            switch($types[0]->slug){
                case 'doc':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/doc-placeholder.jpg';
                   break; 
                 case 'jpg':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/jpg-placeholder.jpg';
                    break;
                case 'mp4':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/mp4-placeholder.jpg';
                    break;
                case 'pdf':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/pdf-placeholder.jpg';
                    break;
                case 'ppt':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/ppt-placeholder.jpg';
                    break;
                case 'xls':
                    $thumbnail = esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/placeholders/xls-placeholder.jpg';
                    break;
            }
        }
        $result = array(
            'id' => get_the_ID(),
            'permalink' => get_the_permalink(),
            'title' => get_the_title(),
            'featured_image' => $thumbnail,
            'excerpt' => get_the_excerpt(),
            'resource_types' => wp_get_post_terms($query->post->ID, 'resource_type'),
            'favourites_image' => $favourite_image,
            'arrow' => esc_url(get_template_directory_uri()) . '/resources/images/icons/arrow.svg',
            'download_image' => esc_url(get_template_directory_uri()) . '/resources/images/icons/download-arrow.svg',
            'download_url' => get_post_meta(get_the_ID(), 'post_file_url', true),
            'nonce' => $filter_nonce,
            'categories' => $category_list,
            'number_posts_found' => $queryResultNumber->found_posts
        );
        
        $title = get_the_title();
        $thumbnail = get_the_post_thumbnail_url('large');
        $post = $query->post;
        array_push($results, $result);
		endwhile;
        // array_push($results, $array);
        echo json_encode($results);
		wp_reset_postdata();
	else :
		echo 'No posts found';
	endif;
	
	die;
}

// ----------------- post filters end-------------------->
?>