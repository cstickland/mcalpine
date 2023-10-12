<?php
/* Template Name: Where to Buy */

get_header();

?>

<main id="primary" class="site-main">

    <?php echo do_blocks('<!-- wp:mcalpine/small-hero {"name":"mcalpine/small-hero","data":{"title":"Where To Buy","_title":"field_64ef3eb65a74d","message":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam…","_message":"field_64ef3ec25a74e","image":"","_image":"field_64ef3ed55a74f","breadcrumb_middle_link":"","_breadcrumb_middle_link":"field_64ef4f89decd4"},"mode":"edit"} /-->'); ?>

    <div id="map"></div>
    <?php if (have_rows('map_locations', 'option')) : ?>
        <div class="map-search">
            <div class="" <h3>Find Your Local Stockist</h3>
                <input type="text" placeholder="">
                <?php while (have_rows('map_locations', 'option')) : the_row();

                    // Load sub field values.
                    $location = get_sub_field('location');
                    $title = get_sub_field('title');
                ?>
                    <div class="marker" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                        <div class="marker-text">
                            <h3><?php echo esc_html($title); ?></h3>
                            <p><em><?php echo esc_html($location['address']); ?></em></p>
                        </div>
                    </div>
                <?php endwhile; ?>

            </div>
            <div class="acf-map" data-zoom="16">
                <?php while (have_rows('map_locations', 'option')) : the_row();

                    // Load sub field values.
                    $location = get_sub_field('location');
                    $title = get_sub_field('title');
                ?>
                    <div class="marker" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                        <h3><?php echo esc_html($title); ?></h3>
                        <p><em><?php echo esc_html($location['address']); ?></em></p>
                    </div>
                <?php endwhile; ?>
            </div>
        </div>
    <?php endif; ?>
    <?php

    if (have_posts()) :
        while (have_posts()) :
            the_post();
            the_content();
        endwhile;
    endif;
    ?>

</main><!-- #main -->

<script>
    const mapContainer = document.getElementById('map');
    const app = new MapComponent({
        target: mapContainer,
        props: {
            ready: false,
            apiKey: "<?php the_field('api_key', 'option'); ?>"
        }
    });
    window.initMap = function ready() {
        app.$set({
            ready: true
        });
    }
</script>

<style>
    #map .h1 {
        color: blue;
        font-size: 100px;
    }

    .map-search {
        display: none;
    }

    .acf-map {
        display: none;
    }
</style>
<?php
get_footer();