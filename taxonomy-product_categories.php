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
    public $id;
}

$term = get_queried_object();
$child_term_ids = get_term_children($term->term_id, 'product_categories');
$child_terms = array();

foreach ($child_term_ids as $id) {
    $child_terms[] = get_term($id);
}
$all_finishes = [];
$finishes = [];
?>

<main id="primary" class="site-main">
    <?php if (get_field('hero_style', $term) == 'small') { ?>
        <?php echo do_blocks('<!-- wp:mcalpine/small-hero /-->'); ?>
    <?php } ?>
    <?php if (get_field('hero_style', $term) == 'large') { ?>
        <?php echo do_blocks('<!-- wp:mcalpine/large-hero-category /-->'); ?>
    <?php } ?>
    <?php if (have_posts()) : ?>

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
                $product_categories = wp_get_object_terms($post_id, array('product_categories', 'product_finishes'));
                $product_finishes = wp_get_object_terms($post_id, 'product_finishes');
                foreach ($product_finishes as $product_finish) {
                    $all_finishes[] = $product_finish;
                }
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


                ?>
            <?php endwhile;

            the_posts_navigation(); ?>
        </div>
    <?php endif;
    $all_finishes = array_unique($all_finishes);

    foreach ($all_finishes as $finish) {
        $new_category = new Category();

        $new_category->name = $finish->name;
        $new_category->parent = $finish->parent;
        $new_category->term_id = $finish->term_id;
        $finishes[] = $new_category;
    }

    ?>

</main><!-- #main -->
<script src="<?php echo get_template_directory_uri() . '/components/product-archive/dist/bundle.js'; ?>"></script>

<script>
    const allProducts = <?php echo json_encode($products); ?>;
    const childCategories = <?php echo json_encode($child_terms); ?>;
    const finishes = <?php echo json_encode($finishes); ?>;
    const archiveItems = document.getElementById('archive-items');
    archiveItems.innerHTML = ''
    new Archive({
        target: archiveItems,
        props: {
            allProducts: allProducts,
            childCategories: childCategories,
            finishes: finishes,
            showFilters: true,

        }
    })
</script>


<?php
get_footer();
