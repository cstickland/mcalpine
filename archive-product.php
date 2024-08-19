<?php

get_header();

class Product
{
    public $skus;
    public $title;
    public $link;
    public $image_url;
    public $taxonomies;
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
$finish_args = array(
    'taxonomy' => 'product_finishes'
);
$categories = get_categories($args);
$get_finishes = get_terms(array(
    'taxonomy' => 'product_finishes',
    'hide_empty' => true,
));
$parent_categories = [];
$child_categories = [];
$finishes = [];

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

foreach ($get_finishes as $finish) {
    $new_category = new Category();

    $new_category->name = $finish->name;
    $new_category->parent = $finish->parent;
    $new_category->term_id = $finish->term_id;
    $finishes[] = $new_category;
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
                    $product_categories = wp_get_object_terms($post_id, array('product_categories', 'product_finishes'));
                    $taxonomies = [];
                    foreach ($product_categories as $category) {
                        $taxonomies[] = $category->term_id;
                    }

                    $new_product = new Product();
                    $new_product->title = get_the_title();
                    $new_product->link = get_the_permalink();
                    $new_product->skus = $skus;
                    $new_product->image_url = $product_image;
                    $new_product->taxonomies = $taxonomies;
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
    const finishes = <?php echo json_encode($finishes); ?>;
    const archiveItems = document.getElementById('archive-items');
    archiveItems.innerHTML = ''
    new Archive({
        target: archiveItems,
        props: {
            allProducts: allProducts,
            parentCategories: parentCategories,
            childCategories: childCategories,
            finishes: finishes
        }
    })
</script>

<?php
get_footer();
