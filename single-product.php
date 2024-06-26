<?php
get_header('product');
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
            <?php if (count($blocks) > 0) : ?>
                <div class="product-sticky-links bg-<?php the_field('sticky_links_background_color'); ?>">
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
                        <?php if ($block['blockName'] == 'mcalpine/product-highlights') { ?>
                            <a href="#product-highlights" class="sticky-link">Product Highlights</a>
                        <?php } ?>
                        <?php if ($block['blockName'] == 'mcalpine/product-faq') { ?>
                            <a href="#product-faq" class="sticky-link">Frequently Asked Questions</a>
                        <?php } ?>
                    <?php } ?>
                </div>
            <?php endif; ?>
    <?php the_content();
            echo do_blocks('<!-- wp:mcalpine/product-category-guide-download /-->');
        endwhile;
    endif;
    ?>
</main><!-- #main -->
<script>
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach((accordion) => {
        const questionContainer = accordion.querySelector('.accordion-question-container');
        questionContainer.addEventListener('click', () => {
            accordion.classList.toggle('open')
        })
    })
</script>
<?php

get_footer();
