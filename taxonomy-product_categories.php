<?php

/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package McAlpine
 */

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
?>

<main id="primary" class="site-main">
    <?php if (have_posts()) : ?>

        <?php
        /* Start the Loop */
        $term = get_queried_object();
        var_dump($term);
        var_dump(get_field('category_image', $term));


        if ($term->parent == 0) {
            echo $term->term_id;
            echo $term->name;
            echo '<h2>Parent</h2>';
            var_dump(get_term_children($term->term_id, 'product_categories'));
        } else {
            echo '<h2>Child</h2>';
        } ?><div id="archive-items">
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

                foreach ($product_categories as $category) {
                    if ($category->parent == 0) {
                        $parent_category = $category->term_id;
                    } else {
                        $child_category = $category->term_id;
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
    <?php endif;
    ?>

</main><!-- #main -->
<script src="<?php echo get_template_directory_uri() . '/components/product-archive/dist/bundle.js'; ?>"></script>

<script>
    const allProducts = <?php echo json_encode($products); ?>;
    const archiveItems = document.getElementById('archive-items');
    archiveItems.innerHTML = ''
    new Archive({
        target: archiveItems,
        props: {
            allProducts: allProducts,
            showFilters: false,

        }
    })
</script>


<?php
get_footer();
