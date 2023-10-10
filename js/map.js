;(function () {
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
    let markers = element.querySelectorAll('.marker')

    // Create gerenic map.
    let mapArgs = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    let map = new google.maps.Map(element, mapArgs)

    // Add markers.
    map.markers = []
    markers.forEach((marker) => {
      initMarker(marker, map)
    })
    const styles = {
      default: [],
      hide: [
        {
          featureType: 'poi.business',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
    }
    map.setOptions({
      styles: styles['hide'],
    })

    // Center map based on markers.
    centerMap(map)

    // Return map instance.
    return map
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
    const lat = marker.dataset.lat
    const lng = marker.dataset.lng
    const markerText = marker.innerHTML
    const latLng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    }

    // Create marker instance.
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
    })

    // Append to reference for later use.
    map.markers.push(marker)

    // If marker contains HTML, add it to an infoWindow.
    if (marker.innerHTML != '') {
      // Create info window.
      let infowindow = new google.maps.InfoWindow({
        content: markerText,
      })

      // Show info window when marker is clicked.
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker)
      })
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
    const bounds = new google.maps.LatLngBounds()
    map.markers.forEach(function (marker) {
      bounds.extend({
        lat: marker.position.lat(),
        lng: marker.position.lng(),
      })
    })

    // Case: Single marker.
    if (map.markers.length == 1) {
      map.setCenter(bounds.getCenter())

      // Case: Multiple markers.
    } else {
      map.fitBounds(bounds)
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    mapContainer = document.querySelector('.acf-map')

    const mapInit = initMap(mapContainer)
  })
})()
