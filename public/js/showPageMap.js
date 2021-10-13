mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: cafe.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

const marker1 = new mapboxgl.Marker()
.setLngLat(cafe.geometry.coordinates)
.addTo(map);