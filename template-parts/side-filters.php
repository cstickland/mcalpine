<div class="side-filters_container" id="side-filters">
    <div class="side-filters_form" id="side-filters_form">
    <form action="<?php echo site_url() ?>/wp-admin/admin-ajax.php" method="POST" name="filter" id="side-filter">
        <?php
            if(!isset($_GET['category'])){
                if( $terms = get_terms( array( 'taxonomy' => 'category', 'orderby' => 'name' ) ) ) : 

                    echo '<div class="resource-dropdown__container-side" ><div class="resource-dropdown__side" id="file-type__dropdown-side"><span>Category</span> <img src="' . esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                    echo '<div class="resource-dropdown__input-container-side">';
                    foreach ( $terms as $term ) :
                        echo '<div class="input-container"><input class="checkbox-side" type="checkbox" name="category[]" value="' . $term->name . '"><span class="term-name">' . $term->name . '</span></div>'; // ID of the category as the value of an option
                    endforeach;
                    echo '</div></div>';
                endif;
            } else {
                $categoryUrl = $_GET['category'];
                echo '<input class="checkbox" type="hidden" name="category_url" value="' . $categoryUrl . '">';
            }
            if( $terms = get_terms( array( 'taxonomy' => 'file_type', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container-side" ><div class="resource-dropdown__side" id="file-type__dropdown-side"><span>File Types</span> <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container-side">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox-side" type="checkbox" name="file_filter[]" value="' . $term->name . '"><span class="term-name">' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
            if( $terms = get_terms( array( 'taxonomy' => 'resource_type', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container-side" ><div class="resource-dropdown__side" id="resource-type__dropdown-side"><span>Resource Type</span> <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container-side">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox-side" type="checkbox" name="resource_filter[]" value="' . $term->name . '"><span class="term-name">' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
            if( $terms = get_terms( array( 'taxonomy' => 'post_tag', 'orderby' => 'name' ) ) ) : 

                echo '<div class="resource-dropdown__container-side" ><div class="resource-dropdown__side" id="resource-type__dropdown-side"><span>Tags</span> <img src="' . esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' .'" alt=""></div>';
                echo '<div class="resource-dropdown__input-container-side">';
                foreach ( $terms as $term ) :
                    echo '<div class="input-container"><input class="checkbox-side" type="checkbox" name="tag[]" value="' . $term->name . '"><span class="term-name">' . $term->name . '</span></div>'; // ID of the category as the value of an option
                endforeach;
                echo '</div></div>';
            endif;
        ?>
        <div class="resource-dropdown__container-side" >
            <div class="resource-dropdown__side" id="sort-type__dropdown-side"><span>Sort By</span> <img src="<?php echo esc_url(get_template_directory_uri()) 
                . '/resources/images/icons/filter-arrow.svg' ?>" alt=""></div>
                <div class="resource-dropdown__input-container-side">
                <div class="input-container">   
                    <input name="sort" type="checkbox" class="checkbox-side checkbox-side-sort" value="ASC">
                    <span class="term-name">ASC</span>
                </div>  
                <div class="input-container">   
                    <input name="sort" type="checkbox" class="checkbox-side checkbox-side-sort" value="DEC">
                    <span class="term-name">DEC</span>
                </div>
            </div>
        </div>
        <input type="number" name="page" id="page-side"  hidden value="1">
        <input type="hidden" name="action" value="myfilter">
        <?php global $wp_query;
            if($wp_query->query['pagename']=='favourites'){
                echo '<input type="hidden" name="favourites" value="1">';
            } 
        ?>
        <button class="submit-btn">APPLY FILTERS</button>
    </form>
    </div>
    <img id="side-filter_close" class="filter-close-icon" src="<?php echo esc_url(get_template_directory_uri()) 
                    . '/resources/images/icons/close-white-icon.svg' ?>" alt="close icon">
</div>