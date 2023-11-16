<?php

get_header();

class Product
{
    public $skus;
    public $title;
    public $link;
    public $image_url;
    public $categoryId;
    public $subcategoryId;
    public $postType;
    public $categoryName;
    public $subcategoryName;
}

class Insight
{
    public $identifier;
    public $title;
    public $permalink;
    public $id;
    public $img;
    public $alt;
    public $columnWidth;
    public $postType;
}

class Category
{
    public $name;
    public $parent;
    public $id;
}

$results = [];
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/search-hero -->'); ?>
    <div id="search-archive"></div>
    <ul>
        <?php
        if (have_posts()) :
            while (have_posts()) :
                the_post();
                $post_type = get_post_type();
                if ($post_type === 'post') {
                    $post_id = get_the_ID();
                    $insight_image = get_the_post_thumbnail_url();
                    $new_insight = new Insight();
                    $new_insight->title = get_the_title();
                    $new_insight->permalink = get_the_permalink();
                    $category;
                    foreach ((get_the_category()) as $cat) {
                        if ($cat->parent == 0) {
                            $category = $cat->cat_name;
                        }
                    };
                    $new_insight->identifier = $category;
                    $new_insight->img = $insight_image;
                    $new_insight->columnWidth = 1;
                    $new_insight->id = $post_id;
                    $new_insight->postType = $post_type;
                    $results[] = $new_insight;
                }
                if ($post_type == 'product') {
                    $post_id = get_the_ID();
                    $skus = [];
                    if (have_rows('skus', $post_id)) :
                        while (have_rows('skus', $post_id)) : the_row();
                            $skus[] = get_sub_field('sku');

                            if (get_row_index() == 1) {
                                if (have_rows('product_images')) :
                                    while (have_rows('product_images')) : the_row();
                                        if (get_row_index() == 1) {
                                            $product_image = get_sub_field('product_image');
                                        }
                                    endwhile;
                                endif;
                            }
                        endwhile;
                    endif;
                    $product_categories = wp_get_object_terms($post_id, 'product_categories');
                    $child_category = [];
                    foreach ($product_categories as $category) {
                        if ($category->parent == 0) {
                            $parent_category = $category->term_id;
                            $parent_category_name = $category->name;
                        } else {
                            $child_category[] = $category->term_id;
                            $child_category_name[] = $category->name;
                        }
                    }

                    $new_product = new Product();
                    $new_product->title = get_the_title();
                    $new_product->link = get_the_permalink();
                    $new_product->skus = $skus;
                    $new_product->image_url = $product_image;
                    $new_product->categoryId = $parent_category;
                    $new_product->subcategoryId = $child_category;
                    $new_product->categoryName = $parent_category_name;
                    $new_product->subcategoryName = $child_category_name;
                    $new_product->postType = $post_type;
                    $results[] = $new_product;
                }
            endwhile;
        endif;
        ?>
    </ul>
</main><!-- #main -->

<script>
    const allProducts = <?php echo json_encode($results); ?>;
    const archiveItems = document.getElementById('search-archive');
    archiveItems.innerHTML = ''
    new SearchArchive({
        target: archiveItems,
        props: {
            allInsights: allProducts
        }
    })
</script>
<?php
get_footer();
