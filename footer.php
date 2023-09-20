<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package McAlpine
 */

?>
<?php if (get_field('footer_version', 'option') == 1) {
    echo do_blocks('<!-- wp:acf/reviews {"name":"acf/reviews","data":{"title":"See why we’re the first choice for tradespeople world wide!","_title":"field_644e730be3b28","text":"Duis mauris augue, efficitur eu arcu sit amet, posuere dignissim neque. Aenean enim sem, pharetra et magna sit amet, luctus aliquet nibh.\r\n","_text":"field_644e750b23169","show_button":"1","_show_button":"field_644e75572316d","button_button_text":"Button Text","_button_button_text":"field_644e752e2316b","button_button_url":{"title":"HomePage","url":"http://mcalpine2.local/","target":""},"_button_button_url":"field_644e753b2316c","button":"","_button":"field_644e751a2316a"},"mode":"edit"} /-->');
    echo do_blocks('<!-- wp:acf/contact {"name":"acf/contact","mode":"preview"} /-->');
}
if (get_field('footer_version', 'option') == 2) {
    echo do_blocks('<!-- wp:acf/cta {"name":"acf/cta","mode":"preview"} /-->');
}
?>
<footer class="site-footer version-<?php the_field('footer_version', 'option'); ?>">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-mobile-logo">
                <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 699.73 114.15">
                    <g id="McAlpine_Logo_-_New">
                        <rect class="cls-2" x="465.55" width="36.42" height="114.15" />
                        <polygon class="cls-2" points="662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55" />
                        <polygon class="cls-2" points="346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0" />
                        <polygon class="cls-2" points="576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83" />
                        <path class="cls-2" d="m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z" />
                        <path class="cls-2" d="m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z" />
                        <polygon class="cls-2" points="125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0" />
                        <path class="cls-2" d="m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z" />
                    </g>
                </svg>
                <p class="footer-paragraph"><?php the_field('footer_paragraph', 'option'); ?></p>
            </div>
            <div class="nav-links">
                <?php wp_nav_menu(array('theme_location' => 'footer')) ?>

            </div>
        </div>
        <div class="footer-copyright">
            <div class="footer-logo">
                <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 699.73 114.15">
                    <defs>
                        <style>
                            .cls-2 {
                                fill: #fff;
                                stroke-width: 0px;
                            }
                        </style>
                    </defs>
                    <g id="McAlpine_Logo_-_New">
                        <rect class="cls-2" x="465.55" width="36.42" height="114.15" />
                        <polygon class="cls-2" points="662.08 71.55 687.57 71.55 699.12 42.6 662.08 42.6 662.08 28.95 688.17 28.95 699.73 0 662.08 0 636.51 0 625.66 0 625.66 114.15 636.51 114.15 662.08 114.15 688.17 114.15 699.73 85.2 662.08 85.2 662.08 71.55" />
                        <polygon class="cls-2" points="346.9 0 310.48 0 310.48 114.15 328.69 114.15 346.9 114.15 362.39 114.15 373.94 82.9 346.9 82.9 346.9 0" />
                        <polygon class="cls-2" points="576.94 47.83 550.68 0 514.26 0 514.26 114.15 550.68 114.15 550.68 66.32 576.94 114.15 613.36 114.15 613.36 0 576.94 0 576.94 47.83" />
                        <path class="cls-2" d="m435.72,0h-54.1v114.15h36.42v-28.71h17.69c10.15,0,18.38-8.23,18.38-18.38V18.38c0-10.15-8.23-18.38-18.38-18.38Zm-8.26,48.73c0,4.3-3.36,8.35-9.42,8.35v-31.16c4.71,0,9.42,3.26,9.42,7.96v14.85Z" />
                        <path class="cls-2" d="m257.76,0h-36.42l-16.6,114.15h36.42l2.04-14.06h18.12l2.04,14.06h36.42L283.18,0h-25.43Zm-11.81,81.19l6.31-43.39,6.31,43.39h-12.62Z" />
                        <polygon class="cls-2" points="125.83 0 108.15 0 89.42 0 80.58 60.76 71.75 0 53.02 0 35.33 0 16.6 0 0 114.15 36.42 114.15 44.17 60.81 51.93 114.15 72.82 114.15 88.35 114.15 109.24 114.15 116.99 60.81 124.75 114.15 161.17 114.15 144.57 0 125.83 0" />
                        <path class="cls-2" d="m161.31,17.91h0v33.7h0c0,9.89,8.02,17.91,17.91,17.91h23.01v-17.91h-3.9c-5.37,0-9.72-4.35-9.72-9.72v-14.26c0-5.37,4.35-9.72,9.72-9.72h3.9V0h-23.01c-9.89,0-17.91,8.02-17.91,17.91Z" />
                    </g>
                </svg>
            </div>

            <div class="footer-social-links">
                <?php get_template_part('/template-parts/footer-socials'); ?>
            </div>
            <div class="footer-copyright_text"><?php the_field('footer_copyright', 'option'); ?></div>
        </div>
    </div>
</footer><!-- #colophon -->

<?php wp_footer(); ?>

</body>
<script>
    const searchContainer = document.getElementById('search-container');
    searchContainer.innerHTML = ''
    new Search({
        target: searchContainer,
        props: {
            siteUrl: "<?php echo site_url(); ?>",
            ajaxUrl: "<?php echo admin_url('admin-ajax.php'); ?>",
        }
    })

    const mobileNav = document.getElementById('mobile-menu');
    mobileNav.innerHTML = ''
    new Mobile({
        target: mobileNav,
        props: {
            siteUrl: "<?php echo site_url(); ?>",
            ajaxUrlProp: "<?php echo admin_url('admin-ajax.php'); ?>",
            versionProp: <?php the_field('mobile_nav_version', 'option'); ?>,
            facebookLink: "<?php the_field('facebook', 'option'); ?>",
            twitterLink: "<?php the_field('twitter', 'option'); ?>",
            instagramLink: "<?php the_field('instagram', 'option'); ?>",
            linkedinLink: "<?php the_field('linkedin', 'option'); ?>",
            youtubeLink: "<?php the_field('youtube', 'option'); ?>",
            emailLink: "<?php the_field('email', 'option'); ?>",
        }
    })

    const productMenu = document.getElementById('desktop-mega-menu');
    productMenu.innerHTML = ''

    new ProductMenu({
        target: productMenu
    })
</script>

</html>
