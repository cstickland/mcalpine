<!-- title -->
<!-- text -->
<!-- background_image -->
<!-- buttons > button_link -->
<!-- text_left -->

<?php
global $post_id;
$category = get_the_terms(get_the_ID(), "product_categories");

$category_parent_id = $category[0]->category_parent;
$title = get_field('product_guide_title', $category[0]);
$message = get_field('product_guide_message', $category[0]);
$download_url = get_field('product_guide_file', $category[0]);
$background_image_url = get_field('product_guide_download-background_image', $category[0]);
$button_text = "Download";
?>
<?php if ($title) { ?>
    <div <?php echo get_block_wrapper_attributes(['class' => 'product-guide-block animate']); ?>>
        <div class="product-guide-container">
            <?php if ($background_image_url) :
                $url = $background_image_url['url'];
                $title = $background_image_url['title'];
                $alt = $background_image_url['alt']; ?>
                <div class="background-image-container">
                    <img src="<?php echo $url; ?>" alt="<?php echo $alt; ?>" class="product-guide-background-image" />
                </div>
            <?php endif; ?>
            <div class="product-guide-gradients">
                <div class="product-guide-gradient-white"></div>
                <div class="product-guide-gradient-blue"></div>
            </div>
            <div class="product-guide-content">
                <div class="white-dash"></div>
                <h2><?php echo $title; ?></h2>
                <div class="product-guide-text"><?php echo $message; ?></div>
                <div class="buttons-container">
                    <a class="btn btn-black" href="<?php echo esc_url($download_url); ?>" download><?php echo esc_html($button_text); ?></a>
                </div>
            </div>
        </div>
    </div>
<?php } ?>
