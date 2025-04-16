<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import tradeCitiesCoords from '$lib/data/tradeCities';
    import provenancesCoords from '$lib/data/provenances';
    import tradeRoutesCoords from '$lib/data/tradeRoutes';

    // Imported variables
    export let activeDataSets;

    console.log("active in map", activeDataSets);
    
    let mapContainer;
    let map;

    // Map functions
    const addMarkersToMap = (leaflet, tradeCities, map) => {
        tradeCities.forEach(city => {
            let marker = leaflet.marker(city.coordinates).addTo(map);
            marker.bindPopup(city.name).openPopup();
        })
    }

    const addProvenancesToMap = (leaflet, provenances, map) => {
        provenances.forEach(provenance => {
            let polygon = L.polygon(provenance.coordinates, {
                color: 'black',
                weight: 1,
                fillColor: 'blue',
                fillOpacity: 0.2
            }).addTo(map);
            polygon.bindPopup(provenance.name);
        })
    }

    // Calculate offset of path
    const offsetPath = (path, [latOffset = 0, lngOffset = 0]) => {
        return path.map((point, i) => {
            if (i === 0 || i === path.length - 1) return point;
            const [lat, lng] = point;
            return [lat + latOffset, lng + lngOffset];
        });
    };

    
    const animatePath = (coords, options = {}, interval = 200) => {
        let index = 1;
        const path = L.polyline([coords[0]], options).addTo(map);

        const drawNextPoint = () => {
            if (index < coords.length) {
                path.addLatLng(coords[index]);
                index++;
                setTimeout(drawNextPoint, interval);
            }
        };

        drawNextPoint();
    }

    // add all trade routes
    const addTradeRoutesToMap = (leaflet, routes, map) => {
        routes.forEach(route => {
            animatePath(route.coordinates, {
                color: 'purple',
                weight: 2,
                opacity: 0.7,
            }, 300);
        })
    }

    // add trade route based on data
    const addTradeRouteToMap = (leaflet, route, offset, map) => {
        // Apply offset (e.g., to avoid overlapping paths)
        const offsetCoordinates = offsetPath(route.coordinates, offset); // tweak values as needed

        animatePath(offsetCoordinates, {
            color: 'purple',
            weight: 2,
            opacity: 0.7,
        }, 300);
    };

    
    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');
            map = leaflet.map(mapContainer).setView([54.6128, 12.216797], 5);
    
            // Add the tile layer
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
            
            // Add markers of tradecities to the map
            addMarkersToMap(leaflet, tradeCitiesCoords, map);

            // Add provenances to the map
            addProvenancesToMap(leaflet, provenancesCoords, map);

            // Add all trade routes to the map
            // addTradeRoutesToMap(leaflet, tradeRoutesCoords, map);
            const routeDrawCounts = {};

            const drawTradeRoute = (data) => {
                const provenance = data.provenance;
                const matchedRoute = tradeRoutesCoords.find(route => route.name === provenance);

                if (matchedRoute) {
                    // Get current draw count, default to 0
                    const count = routeDrawCounts[provenance] || 0;

                    // Calculate offset based on how many times it's been drawn
                    const latOffset = 0.01 * count;
                    const lngOffset = 0.01 * count;

                    // Update the draw count
                    routeDrawCounts[provenance] = count + 1;

                    // Draw with calculated offset
                    addTradeRouteToMap(leaflet, matchedRoute, [latOffset, lngOffset], map);
                } else {
                    console.warn("No matching route for provenance:", provenance);
                }
            };


            console.log("activeData", activeDataSets);
            activeDataSets.forEach(dataSetsType => {
                // artworks, constructions, furniture
                console.log("datasettype", dataSetsType.name); 

                dataSetsType.data.forEach(dataObject => {
                    // halfmodels, sculptures, shipwrecks, etc.
                    console.log("dataset specifiek", dataObject.name);

                    dataObject.data.forEach(item => {
                        // the actual item
                        // console.log("Actual item", item);

                        drawTradeRoute(item);
                    });
                });
            });


    

            // const drawPathOnMap = (provenance, n = 0) => {
            //     const offsetStep = 0.0;
            //     console.log("DRAW LINE", provenance);
            //     L.polyline(
            //             offsetPath(easternGermanyPathCoords, offsetStep * n, offsetStep * n),
            //             {
            //                 color: 'green',
            //                 weight: .5,
            //                 opacity: 0.7,
            //             }
            //         ).addTo(map);

            //     if (provenance === "South Germany") {
                
            //     }
            //     return
            // };
            // // draw function
            // const getProvenance = (dataSets) => {
            //     let index = 0;

            //     dataSets.forEach(dataSet => {
            //         dataSet.forEach(item => {
            //             item.forEach(i => {
            //                 index++;
            //                 console.log("provenance", i.provenance, index);
            //                 drawPathOnMap(item.provenance, index);
            //             })
            //         })
            //     });
            // };

            // let halfModelsEasternGermany = getProvenance(activeDataSets);
            

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