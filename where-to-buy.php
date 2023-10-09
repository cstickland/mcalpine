<?php
/* Template Name: Where to Buy */

get_header();

?>

<main id="primary" class="site-main">

    <?php echo do_blocks('<!-- wp:mcalpine/small-hero {"name":"mcalpine/small-hero","data":{"title":"Where To Buy","_title":"field_64ef3eb65a74d","message":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam…","_message":"field_64ef3ec25a74e","image":"","_image":"field_64ef3ed55a74f","breadcrumb_middle_link":"","_breadcrumb_middle_link":"field_64ef4f89decd4"},"mode":"edit"} /-->'); ?>

    <?php if (have_rows('map_locations', 'option')) : ?>
        <div class="map-search">
            <h3>Find Your Local Stockist</h3>
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


<script src="https://maps.googleapis.com/maps/api/js?key=<?php the_field('api_key', 'option'); ?>&callback=Function.prototype"></script>
<script>
    (function() {

        /**
         * initMap
         *
         * Renders a Google Map onto the selected element
         *
         * @date    22/10/19
         * @since   5.8.6
         *
         * @param   jQuery $el The jQuery element.
         * @return  object The map instance.
         */
        function initMap(element) {

            // Find marker elements within map.
            const markers = element.querySelectorAll('.marker');

            // Create gerenic map.
            const mapArgs = {
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            const map = new google.maps.Map(element, mapArgs);

            // Add markers.
            map.markers = [];
            markers.forEach((marker) => {
                initMarker(marker, map);
            });
            const styles = {
                default: [],
                hide: [{
                        featureType: "poi.business",
                        stylers: [{
                            visibility: "off"
                        }],
                    },
                    {
                        featureType: "transit",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }],
                    },
                ],
            };
            map.setOptions({
                styles: styles["hide"]
            })


            // Center map based on markers.
            centerMap(map);

            // Return map instance.
            return map;
        }

        /**
         * initMarker
         *
         * Creates a marker for the given jQuery element and map.
         *
         * @date    22/10/19
         * @since   5.8.6
         *
         * @param   jQuery $el The jQuery element.
         * @param   object The map instance.
         * @return  object The marker instance.
         */
        function initMarker(marker, map) {

            // Get position from marker.
            var lat = marker.dataset.lat;
            var lng = marker.dataset.lng;
            const markerText = marker.innerHTML;
            var latLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            };

            // Create marker instance.
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            });

            // Append to reference for later use.
            map.markers.push(marker);

            // If marker contains HTML, add it to an infoWindow.
            if (marker.innerHTML != '') {

                // Create info window.
                var infowindow = new google.maps.InfoWindow({
                    content: markerText,
                });

                // Show info window when marker is clicked.
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
            }
        }

        /**
         * centerMap
         *
         * Centers the map showing all markers in view.
         *
         * @date    22/10/19
         * @since   5.8.6
         *
         * @param   object The map instance.
         * @return  void
         */
        function centerMap(map) {

            // Create map boundaries from all map markers.
            var bounds = new google.maps.LatLngBounds();
            map.markers.forEach(function(marker) {
                bounds.extend({
                    lat: marker.position.lat(),
                    lng: marker.position.lng()
                });
            });

            // Case: Single marker.
            if (map.markers.length == 1) {
                map.setCenter(bounds.getCenter());

                // Case: Multiple markers.
            } else {
                map.fitBounds(bounds);
            }
        }


        document.addEventListener('DOMContentLoaded', () => {
            map = document.querySelector('.acf-map');

            let mapInit = initMap(map);
        })

    })();
</script>
<?php
get_footer();
