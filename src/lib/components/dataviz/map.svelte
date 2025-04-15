<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let mapContainer;
    let map;
    
    onMount(async () => {
       if(browser) {
          const leaflet = await import('leaflet');
          map = leaflet.map(mapContainer).setView([54.6128, 12.216797], 5);
    
            // Add the tile layer
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
            
            // Add a marker to the map
            let marker = leaflet.marker([54.6128, 12.216797]).addTo(map)
            
            // Define the polygon with coordinates
            let easternGermanyPolygon = [
                [54.357517, 11.381836],
                [53.083467, 11.513672],
                [53.267841, 12.216797],
                [53.109855, 13.095703],
                [53.7643, 14.326172],
                [54.739845, 13.447266],
                [54.357517, 11.381836]
            ];

            // Add polygon to the map
            let polygon = L.polygon(easternGermanyPolygon, {
                color: 'blue', // Polygon color
                fillColor: 'blue', // Fill color
                fillOpacity: 0.2 // Fill opacity
            }).addTo(map);

            // Calculate offset of path
            const offsetPath = (path, latOffset = 0, lngOffset = 0) => {
                return path.map(([lat, lng]) => [lat + latOffset, lng + lngOffset]);
            }

            let easternGermanyPathCoords = [
                [52.182016, 4.526367],
                [54.689074, 4.921875],
                [56.013123, 6.635742],
                [57.245771, 7.77832],
                [57.788575, 9.404297],
                [57.671261, 10.986328],
                [56.379852, 11.821289],
                [55.675106, 10.755615],
                [55.04565, 11.11267],
                [54.647141, 10.706177],
                [54.174011, 11.359863],
                [53.868077, 10.700684],
            ];

            let easternGermanyPath = L.polyline(easternGermanyPathCoords, {
                color: 'purple',
                weight: 3,
                opacity: 0.7,
                smoothFactor: 1
            }).addTo(map);

            // Offset path
            let secondPath = L.polyline(offsetPath(easternGermanyPathCoords, 0.05, 0.05), {
                color: 'green',
                weight: 3,
                opacity: 0.7,
            }).addTo(map);

            marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
            polygon.bindPopup("I am a polygon.");

            const onMapClick = (event) => {
                alert("You clicked the map at " + event.latlng);
            }

            map.on('click', onMapClick);
        }
    });
    
    onDestroy(async () => {
       if(map) {
          map.remove();
       }
    });
</script>
    
    
<div class="container">
    <div class="row">
        <div class="col">
            <div id="map-container" bind:this={mapContainer}></div>
        </div>
    </div>
</div>  
    
<style>
    @import 'leaflet/dist/leaflet.css';
</style>