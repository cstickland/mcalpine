<?php
get_header();
?>

<main id="primary" class="site-main">

    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            echo do_blocks('<!-- wp:acf/hero-product {"name":"acf/hero-product","data":{},"mode":"preview"} /-->');
            global $post;
            $blocks = parse_blocks($post->post_content);
    ?>
            <div class="product-sticky-links">
                <a class="home-link" href="#primary">

                    <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                        <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff" />
                    </svg>

                </a>
                <?php foreach ($blocks as $block) { ?>
                    <?php if ($block['blockName'] == 'acf/reviews') { ?>
                        <a href="#reviews" class="sticky-link">Reviews</a>
                    <?php } ?>
                    <?php if ($block['blockName'] == 'mcalpine/product-details') { ?>
                        <a href="#product-details" class="sticky-link">Details</a>
                    <?php } ?>
                    <?php if ($block['blockName'] == 'mcalpine/product-suitability') { ?>
                        <a href="#suitability" class="sticky-link">Use Case</a>
                    <?php } ?>
                <?php } ?>
            </div>
    <?php the_content();
        endwhile;
        the_posts_navigation();
    endif;
    ?>
</main><!-- #main -->

<?php
get_footer();
