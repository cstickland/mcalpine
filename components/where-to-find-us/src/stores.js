import { writable } from 'svelte/store'

export const markers = writable([])

export const query = `{
  themeGeneralSettings {
    themeSettings {
      mapLocations {
        phoneNumber
        title
        location {
          postCode
          city
          streetNumber
          streetName
          state
          countryShort
          latitude
          longitude
        }
      }
    }
  }
}`

export const styles = {
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

export async function getData(query) {
  const fetchPromise = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '<YOUR_RAPIDAPI_KEY>',
    },
    body: JSON.stringify({
      query: query,
    }),
  })

  const response = await fetchPromise.json()
  return response
}

export function initMap(container, center, markers) {
  let map = new google.maps.Map(container, {
    zoom: 13,
    center: center,
  })

  map.markers = []
  markers.forEach((marker) => {
    initMarker(marker, map)
  })

  return map
}

export function initMarker(marker, map) {
  // Get position from marker.
  const lat = marker.location.latitude
  const lng = marker.location.longitude
  const markerText = '<div>Hiya</div>'
  const latLng = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  }

  // Create marker instance.
  const newMarker = new google.maps.Marker({
    position: latLng,
    map: map,
  })
  // Append to reference for later use.
  map.markers.push(newMarker)

  // Create info window.
  let infowindow = new google.maps.InfoWindow({
    content: markerText,
  })

  // Show info window when marker is clicked.
  newMarker.addListener('click', function () {
    infowindow.open(map, newMarker)
  })
}

export function centerMap(map) {
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
