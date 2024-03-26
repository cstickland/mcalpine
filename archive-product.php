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
}

class Category
{
    public $name;
    public $parent;
    public $term_id;
}

$products = [];
$args = array(
    'taxonomy' => 'product_categories'
);
$categories = get_categories($args);
$parent_categories = [];
$child_categories = [];

foreach ($categories as $category) {

    $new_category = new Category();

    $new_category->name = $category->name;
    $new_category->parent = $category->parent;
    $new_category->term_id = $category->term_id;

    if ($new_category->parent > 0) {

        $child_categories[] = $new_category;
    } else {
        $parent_categories[] = $new_category;
    }
}

?>

<main id="primary" class="site-main">
    <div id="archive-items">
        <ul>
            <?php
            if (have_posts()) :
                while (have_posts()) :
                    the_post();
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
                        } else {
                            $child_category[] = $category->term_id;
                        }
                    }

                    $new_product = new Product();
                    $new_product->title = get_the_title();
                    $new_product->link = get_the_permalink();
                    $new_product->skus = $skus;
                    $new_product->image_url = $product_image;
                    $new_product->categoryId = $parent_category;
                    $new_product->subcategoryId = $child_category;
                    $products[] = $new_product;
                endwhile;
            endif;
            foreach ($products as $product) {
                echo '<li>' . $product->title . '</li>';
            }
            ?>
        </ul>
    </div>
</main><!-- #main -->


<script src="<?php echo get_template_directory_uri() . '/components/product-archive/dist/bundle.js'; ?>"></script>

<script>
    const allProducts = <?php echo json_encode($products); ?>;
    const parentCategories = <?php echo json_encode($parent_categories); ?>;
    const childCategories = <?php echo json_encode($child_categories); ?>;
    const archiveItems = document.getElementById('archive-items');
    archiveItems.innerHTML = ''
    new Archive({
        target: archiveItems,
        props: {
            allProducts: allProducts,
            parentCategories: parentCategories,
            childCategories: childCategories

        }
    })
</script>

<?php
get_footer();
