<?php
get_header();
?>


<!-- Start Stockist.co widget -->
<!-- <div data-stockist-widget-tag="u7092">Loading store locator -->
<!--     from <a href="https://stockist.co">Stockist store locator</a>...</div> -->
<!-- <script> -->
<!--     (function(s, t, o, c, k) { -->
<!--         c = s.createElement(t); -->
<!--         c.src = o; -->
<!--         c.async = 1; -->
<!--         k = s.getElementsByTagName(t)[0]; -->
<!--         k.parentNode.insertBefore(c, k); -->
<!--     })(document, 'script', '//stockist.co/embed/v1/widget.min.js'); -->
<!-- </script> -->
<!-- End Stockist.co widget -->


<main id="primary" class="site-main">
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile; // End of the loop.
    ?>

</main>


<?php
get_footer();
