<div class="resources-form__toggle">
    <span id="side-filter_open">Filter by <img src="<?php echo esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' ?>" alt="filter arrow image"></span>
    <div class="filter-columns">
        <div class="two-column blue" id="set-columns__two">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="one-column" id="set-columns__one"></div>
    </div>    
</div>
<div class="resources-form__container">
    <h3 class="filter-header">Filter by:</h3>
    <form action="<?php echo site_url() ?>/wp-admin/admin-ajax.php" method="POST" name="filter" id="filter">
        <?php
            if(!isset($_GET['category'])){
                if( $terms = get_terms( array( 'taxonomy' => 'category', 'orderby' => 'name' ) ) ) : 

                    echo '<div class="resource-dropdown__container" id="category__dropdown-container"><div class="resource-dropdown" id="category__dropdown">Category <img src="' . esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                    echo '<div class="resource-dropdown__input-container">';
                    foreach ( $terms as $term ) :
                        echo '<div class="input-container"><input class="checkbox" type="checkbox" name="category[]" value="' . $term->name . '"><span>' . $term->name . '</span></div>'; // ID of the category as the value of an option
                    endforeach;
                    echo '</div></div>';
                endif;
            } else {
                $categoryUrl = $_GET['category'];
                echo '<input class="checkbox" type="hidden" name="category_url" value="' . $categoryUrl . '">';
            }
            if( $terms = get_terms( array( 'taxonomy' => 'file_type', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container" id="file__dropdown-container"><div class="resource-dropdown" id="file-type__dropdown">File Types <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox" type="checkbox" name="file_filter[]" value="' . $term->name . '"><span>' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
            if( $terms = get_terms( array( 'taxonomy' => 'resource_type', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container" id="resource__dropdown-container"><div class="resource-dropdown" id="resource-type__dropdown">Resource Type <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox" type="checkbox" name="resource_filter[]" value="' . $term->name . '"><span>' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
            if( $terms = get_terms( array( 'taxonomy' => 'post_tag', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container" id="tags__dropdown-container"><div class="resource-dropdown" id="tags__dropdown">Tags <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox" type="checkbox" name="tag[]" value="' . $term->name . '"><span>' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
        ?>
        <div class="resource-dropdown__container" id="sort__dropdown-container">
            <div class="resource-dropdown" id="sort-type__dropdown">Sort By <img src="<?php echo esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' ?>" alt=""></div>
                <div class="resource-dropdown__input-container">
                <div class="input-container">   
                    <input name="sort" type="checkbox" class="checkbox checkbox-sort" value="ASC">
                    ASC
                </div>  
                <div class="input-container">   
                    <input name="sort" type="checkbox" class="checkbox checkbox-sort" value="DEC">
                    DEC
                </div>
            </div>
        </div>
        <input type="number" name="page" id="page" hidden value="1">
        <input type="hidden" name="action" value="myfilter">
        <?php global $wp_query;
            if($wp_query->query['pagename']=='favourites'){
                echo '<input type="hidden" name="favourites" value="1">';
            } 
        ?>
    </form>
</div>