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
    public $id;
}

$term = get_queried_object();
$child_term_ids = get_term_children($term->term_id, 'product_categories');
$child_terms = array();

foreach ($child_term_ids as $id) {
    $child_terms[] = get_term($id);
}
?>

<main id="primary" class="site-main">
    <?php echo do_blocks('<!-- wp:mcalpine/small-hero /-->'); ?>
    <div id="archive-items">
        <?php
        while (have_posts()) :
            the_post();
        ?> <li><?php the_title(); ?></li>
            <?php
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


            ?>
        <?php endwhile;

        the_posts_navigation(); ?>
    </div>


</main><!-- #main -->
<script src="<?php echo get_template_directory_uri() . '/components/product-archive/dist/bundle.js'; ?>"></script>

<script>
    const allProducts = <?php echo json_encode($products); ?>;
    const childCategories = <?php echo json_encode($child_terms); ?>;
    const archiveItems = document.getElementById('archive-items');
    archiveItems.innerHTML = ''
    new Archive({
        target: archiveItems,
        props: {
            allProducts: allProducts,
            childCategories: childCategories,
            showFilters: true,

        }
    })
</script>


<?php
get_footer();
