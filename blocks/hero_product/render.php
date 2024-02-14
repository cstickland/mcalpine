<?php

$link = null;

class Product
{
    public $skus;
    public $title;
    public $link;
    public $image_url;
    public $categoryId;
    public $subcategoryId;
    public $schematic_image;
    public $backgroundColor;
    public $parentCategory;
    public $childCategory;
    public $childLink;
    public $parentLink;
}

$product = new Product();

$skus = [];

$terms = get_the_terms($post_id, 'product_categories');
foreach ($terms as $term) {
    if ($term->parent == 0) {
        $product->parentCategory = $term->name;
        $product->parentLink = get_term_link($term->term_id);
    } else {
        $product->childCategory = $term->name;
        $product->childLink = get_term_link($term->term_id);
    }
}

if (have_rows('skus', $post_id)) :
    $skus = get_field('skus', $post_id);
endif;

$product->skus = $skus;
$product->title = get_the_title($post_id);
$image = get_field('product_schematic_image', $post_id);
if ($image) :
    $image_url = $image['url'];
    if (pathinfo($image_url)['extension'] == 'svg') {
        $product->schematic_image = file_get_contents($image_url);
    } else {
        $product->schematic_image = $image_url;
    }
endif;

?>
<section <?php echo get_block_wrapper_attributes(['class' => 'product-hero ' . get_field('product_hero_background_style', $post_id)]); ?>" id="product-hero">

</section>

<!-- Initiate ProductHero svelte component -->
<script>
    const productHero = document.getElementById('product-hero');
    productHero.innerHTML = ''
    new ProductHero({
        target: productHero,
        props: {
            productDetails: <?php echo json_encode($product); ?>
        }
    })
</script>
