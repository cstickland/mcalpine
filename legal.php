<?php
/* Template Name: Legal */

get_header();

?>

<main id="primary" class="site-main legal-page">
    <div class="legal-gradient"></div>
    <div class="legal-content">
        <div class="hero-breadcrumbs">
            <a href="<?php echo get_site_url(); ?>">Home</a>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245">
                    <path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" />
                </svg>
            </span>

            <div class="breadcrumbs-current"><?php the_title(); ?></div>
        </div>
        <h1><?php the_title(); ?></h1>
        <?php

        if (have_posts()) :
            while (have_posts()) :
                the_post();
                the_content();
            endwhile;
        endif;
        ?>
    </div>

</main><!-- #main -->



<?php
get_footer();
