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
            let polygonCoordinates = [
                [54.357517, 11.381836],
                [53.083467, 11.513672],
                [53.267841, 12.216797],
                [53.109855, 13.095703],
                [53.7643, 14.326172],
                [54.739845, 13.447266],
                [54.357517, 11.381836]
            ];

            // Add polygon to the map
            let polygon = L.polygon(polygonCoordinates, {
                color: 'blue', // Polygon color
                fillColor: 'blue', // Fill color
                fillOpacity: 0.2 // Fill opacity
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