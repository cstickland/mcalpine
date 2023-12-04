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
}

$product = new Product();


$skus = [];

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
    <div class="product-hero-container">
        <div class="product-hero-image">
            <div class="hero-breadcrumbs">
                <a href="<?php echo get_site_url(); ?>">Home</a>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                </span>

                <a class="breadcrumb-middle-link" href="<?php echo site_url() . '/products'; ?>">Products</a>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                    </svg>
                </span>
                <div class="breadcrumbs-current"><?php the_title(); ?></div>
            </div>
            <?php $count = 0; ?>
            <?php if (have_rows('skus', $post_id)) :
                while (have_rows('skus', $post_id)) : the_row();
                    $sku = get_sub_field('sku');
                    if (have_rows('product_images')) :
                        while (have_rows('product_images')) : the_row(); ?>
                            <img data-sku='<?php echo $sku; ?>' class="product-image <?php if ($count == 0) {
                                                                                            echo ' active';
                                                                                        } ?>" src="<?php the_sub_field('product_image'); ?>" />
                    <?php endwhile;
                    endif;
                    $count++;
                endwhile;
            endif;
            $image = get_field('product_schematic_image', $post_id);

            if (!empty($image)) :
                $image_url = $image['url'];
                $image_alt = $image['alt'];

                if (pathinfo($image_url)['extension'] == 'svg') {
                    echo '<div class="product-hero-schematic-image">';
                    echo file_get_contents($image_url);
                    echo '</div>';
                } else { ?>
                    <img class="product-hero-schematic-image" src="<?php echo $image_url; ?>" alt="<?php echo $image_alt; ?>" />
            <?php }
            endif; ?>
            <div class="product-hero-control-images">
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        $sku = get_sub_field('sku');
                        if (have_rows('product_images')) :
                            while (have_rows('product_images')) : the_row(); ?>
                                <img data-sku='<?php echo $sku; ?>' class="product-image-thumbnail" src="<?php the_sub_field('product_image'); ?>" />
                <?php endwhile;
                        endif;
                        $count++;
                    endwhile;
                endif; ?>

            </div>

        </div>
        <div class="product-hero-details">
            <div class="product-details-container">
                <h1 class="h3 product-title"><?php echo get_the_title($post_id); ?></h1>
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        if (get_row_index() == 1) { ?>
                            <div><?php the_sub_field('product_description'); ?></div>
                            <ul>
                                <?php while (have_rows('product_features')) : the_row(); ?>
                                    <li>
                                        <?php the_sub_field('feature'); ?>
                                    </li>
                                <?php endwhile; ?>
                            </ul>
                <?php
                        }
                    endwhile;
                endif; ?>
                <a href="" class="btn btn-black">WHERE TO BUY</a>
                <a href='' class="btn btn-black btn-outline">LEAVE A REVIEW</a>
            </div>
            <div class="product-skus-container">
                <?php if (have_rows('skus', $post_id)) : ?>
                    <ul>
                        <?php while (have_rows('skus', $post_id)) : the_row(); ?>
                            <li>
                                <?php if (have_rows('product_images')) :
                                    while (have_rows('product_images')) : the_row(); ?>
                                        <div class="sku-image-container"> <img src="<?php the_sub_field('product_image'); ?>" /></div>
                                <?php endwhile;
                                endif; ?>
                                <div class="sku-text"><?php the_sub_field('sku'); ?></div>
                            </li>

                        <?php endwhile; ?>
                    </ul>
                <?php endif; ?>
            </div>
            <div class="product-instructions-container">
                <?php if (have_rows('skus', $post_id)) :
                    while (have_rows('skus', $post_id)) : the_row();
                        if (get_row_index() == 1) {
                            if (get_sub_field('product_installation_instructions')) { ?>
                                <div class="installation-instructions">
                                    <a href="<?php the_sub_field('product_installation_instructions'); ?>" download>Install Instructions
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g data-name="Layer 2">
                                                <g data-name="download">
                                                    <rect width="24" height="24" opacity="0" />
                                                    <rect x="4" y="18" width="16" height="2" rx="1" ry="1" />
                                                    <rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)" />
                                                    <rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)" />
                                                    <path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z" />
                                                    <path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </a>
                                </div>
                            <?php }
                            if (get_sub_field('product_technical_drawing')) { ?>
                                <div class="technical-drawing">
                                    <a href="<?php the_sub_field('product_technical_drawing'); ?>" download>Technical Drawing <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g data-name="Layer 2">
                                                <g data-name="download">
                                                    <rect width="24" height="24" opacity="0" />
                                                    <rect x="4" y="18" width="16" height="2" rx="1" ry="1" />
                                                    <rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)" />
                                                    <rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)" />
                                                    <path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39 1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z" />
                                                    <path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </a>

                                </div>
                <?php }
                        }
                    endwhile;
                endif; ?>
            </div>
        </div>

    </div>
</section>


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
