<!-- <div class="container">
    <div class="row">
        <div class="col">
            <div id="map-container" bind:this={mapContainer}></div>
        </div>
    </div>
</div> -->

<div 
    id="map-container" 
    class="position-absolute top-0 start-0 w-100 h-100 z-0" 
    bind:this={mapContainer}
    >
</div>

<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { scaleOrdinal } from 'd3-scale';
    import { schemeCategory10 } from 'd3-scale-chromatic';

    import tradeCitiesCoords from '$lib/data/tradeCities';
    import provenancesCoords from '$lib/data/provenances';
    import tradeRoutesCoords from '$lib/data/tradeRoutes';

    // Imported variables
    export let activeDataSets;
    export let timelineDataSelection;
    const objectTypes = ["constructions", "artworks", "furniture"];
    const subtypeMap = {
        halfModels: "artworks",
        constructions: "constructions",
    };

    const colorScale = scaleOrdinal()
        .domain(objectTypes)
        .range(schemeCategory10);

    // Compontent variables
    let drawnTradeRoutes = [];
    let animatingTradeRoutes = [];
    let routeDrawCounts = {};
    let leafletReady = false;
    let leaflet;
    
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

    // Clear traderoutes when data is updated
    const clearTradeRoutesFromMap = () => {
        drawnTradeRoutes.forEach(layer => map.removeLayer(layer));
        drawnTradeRoutes = [];
        // routeDrawCounts = {};
    };


    // Calculate offset of path
    const offsetPath = (path, [latOffset = 0, lngOffset = 0]) => {
        return path.map((point, i) => {
            if (i === 0 || i === path.length - 1) return point;
            const [lat, lng] = point;
            return [lat + latOffset, lng + lngOffset];
        });
    };

    
    const animatePath = (coords, options = {}, interval = 200, onComplete = () => {}) => {
        let index = 1;
        const path = L.polyline([coords[0]], options).addTo(map);

        animatingTradeRoutes.push(path);

        const drawNextPoint = () => {
            if (index < coords.length) {
                path.addLatLng(coords[index]);
                index++;
                setTimeout(drawNextPoint, interval);
            } else {
                animatingTradeRoutes = animatingTradeRoutes.filter(p => p !== path);
                drawnTradeRoutes.push(path);
                onComplete(path);
            }
        };

        drawNextPoint();
        return path;
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
    const addTradeRouteToMap = (route, offset, color) => {
        const offsetCoordinates = offsetPath(route.coordinates, offset);

        animatePath(offsetCoordinates, {
            color: color,
            weight: 2,
            opacity: 0.7,
        }, 300, (completedPath) => {
            drawnTradeRoutes.push(completedPath);
        });
    };

    // Draw route on map
    const drawTradeRoute = (data, objectType) => {
        const provenance = data.provenance;
        const matchedRoute = tradeRoutesCoords.find(route => route.name === provenance);

        if (matchedRoute) {
            const count = routeDrawCounts[provenance] || 0;
            const offset = [0.01 * count, 0.01 * count];
            routeDrawCounts[provenance] = count + 1;
            
            const parentType = subtypeMap[objectType] || objectType;
            const color = colorScale(parentType);

            addTradeRouteToMap(matchedRoute, offset, color);
        } else {
            console.warn("No matching route for provenance:", provenance);
        }
    };
    
    // Draw map
    const drawMapData = () => {
        if (!map || !leafletReady || !activeDataSets) return;

        clearTradeRoutesFromMap();
        routeDrawCounts = {};

        // Handles both grouped and flat formats
        activeDataSets.forEach(firstLevel => {
            if ('data' in firstLevel && Array.isArray(firstLevel.data)) {
                const objectType = firstLevel.name;

                firstLevel.data.forEach(secondLevel => {
                    if ('data' in secondLevel && Array.isArray(secondLevel.data)) {
                        // activedatasets = all
                        secondLevel.data.forEach(item => {
                            drawTradeRoute(item, objectType);
                        });
                    } else {
                        // activedatasets = just one objecttype
                        drawTradeRoute(secondLevel, objectType);
                    }
                });
            } else {
                console.warn("Unrecognized structure in drawMapData", firstLevel);
            }
        });
    };
    
    onMount(async () => {
        if (browser) {
            leaflet = await import('leaflet');
            leafletReady = true;

            map = leaflet.map(mapContainer).setView([54.6128, 12.216797], 5);

            // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);

            // leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            // }).addTo(map);

            leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            addMarkersToMap(leaflet, tradeCitiesCoords, map);
            addProvenancesToMap(leaflet, provenancesCoords, map);

            drawMapData();
        }
    });

    const drawTimelineYearData = () => {
        clearTradeRoutesFromMap();

        if (Array.isArray(timelineDataSelection)) {
            timelineDataSelection.forEach(data => {
                const objectType = data.objectType || "unknown";
                drawTradeRoute(data, objectType);
            });
        } else {
            console.warn("timelineDataSelection is not an array", timelineDataSelection);
        }
    };

    onDestroy(async () => {
       if(map) {
          map.remove();
       }
    });

    const cancelAnimatingTradeRoutes = () => {
        animatingTradeRoutes.forEach(path => {
            map.removeLayer(path);
        });
        animatingTradeRoutes = [];
    };


    $: if (leafletReady && map && activeDataSets) {
        drawMapData();
    }

    $: if (timelineDataSelection != undefined && leafletReady && map) {
        drawTimelineYearData();
    }
</script>  
    
<style>
    @import 'leaflet/dist/leaflet.css';
</style>