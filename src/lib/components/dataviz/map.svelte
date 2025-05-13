<div 
    id="map-container" 
    class="position-absolute top-0 start-0 w-100 h-100 z-0" 
    bind:this={mapContainer}
    >
</div>
{#if showTooltipRoute}
    <TooltipRoute
        {tooltipRouteContent}
        {tooltipPosition}
    />
{/if}

<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { lineString } from '@turf/helpers';
    import bezierSpline from '@turf/bezier-spline';

    import { colorScale, subtypeMap } from '$lib/scripts/colorConfig';
    import { findCategoryPathFromLocation } from '$lib/scripts/formatData.js';

    import { filtersObject } from '$lib/data/filtersWoodPurpose.js';

    import tradeCitiesCoords from '$lib/data/tradeCities';
    import provenancesCoords from '$lib/data/provenances';
    import tradeRoutesCoords from '$lib/data/tradeRoutes';
    

    // components
    import TooltipRoute from '$lib/components/UI/routeTooltip.svelte';

    // Imported variables
    export let activeDataSets;
    export let timelineDataSelection;
    export let selectedMapType;

    // Compontent variables
    let drawnTradeRoutes = [];
    let animatingTradeRoutes = [];
    let routeDrawCounts = {};
    let leafletReady = false;
    let leaflet;
    
    let mapContainer;
    let map;
    let currentTileLayer;
    
    let showTooltipRoute = false;
    export let tooltipPosition = { x: 0, y: 0 };
    export let tooltipRouteContent = {
        fellingDate: '',
        location: '',
        startYear: '',
        endYear: '',
        length: '',
        TBP: '',
        provenance: '',
        categoryPath: [],
    }

    const keywordMap = {
        "Buildings": ['huis', 'kerk', 'kapel', 'souterrain'],
        "Shipwrecks": ['schip', 'schepen'],
        "Deck beams": ['dekbalk'],
        "Truss legs": ['spant'],
        "Corbels": ['korbelen', 'korbeel'],
        "Churches": ['kerk', 'kapel'],
        "Houses": ['huis', 'woning'],
    };

    // Trade city icon
    const createCustomIcon = (leaflet) => {
        return leaflet.divIcon({
            className: '',
            html: `
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="#111">
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                    </svg>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    };


    // Map functions
    const addMarkersToMap = (leaflet, tradeCities, map) => {
        const customIcon = createCustomIcon(leaflet);

        tradeCities.forEach(city => {
            let marker = leaflet.marker(city.coordinates, { icon: customIcon }).addTo(map);
            marker.bindPopup(city.name).openPopup();
        });
    };

    const addProvenancesToMap = (leaflet, provenances, map) => {
        provenances.forEach(provenance => {
            let polygon = L.polygon(provenance.coordinates, {
                color: 'whitesmoke',
                weight: 1,
                fillColor: 'dark',
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

    const smoothPath = (coords) => {
        // Turf expects [lng, lat], not [lat, lng]
        const line = lineString(coords.map(([lat, lng]) => [lng, lat]));
        const curved = bezierSpline(line, { sharpness: 0.85 });

        // Convert back to [lat, lng]
        return curved.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    };

    // Calculate offset of path
    const offsetPath = (path, [latOffset = 0, lngOffset = 0]) => {
        return path.map((point, i) => {
            if (i === 0 || i === path.length - 1) return point;
            const [lat, lng] = point;
            return [lat + latOffset, lng + lngOffset];
        });
    };
    
    const animatePath = (coords, options = {}, totalDuration = 3000, onComplete = () => {}) => {
        if (!coords.length) return;

        let index = 1;
        const path = L.polyline([coords[0]], options).addTo(map);

        animatingTradeRoutes.push(path);

        const interval = totalDuration / coords.length;

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
    };

    // add all trade routes
    const addTradeRouteToMap = (route, offset, color, routeData) => {
        const offsetCoordinates = offsetPath(route.coordinates, offset);
        const smoothedCoordinates = smoothPath(offsetCoordinates);

        animatePath(smoothedCoordinates, {
            color: color,
            weight: 2,
            opacity: 0.7,
        }, 300, (completedPath) => {
            const visiblePath = completedPath;

            // Create an invisible thicker path on top for easier hover
            const hoverPath = leaflet.polyline(visiblePath.getLatLngs(), {
                color: 'transparent',
                weight: 20,
                opacity: 0,
                className: 'hover-path',
                pane: 'shadowPane'
            }).addTo(map);

            // Highlight visible path on hover and show tooltip
            hoverPath.on('mouseover', () => {
                showTooltipRoute = true;

                // label = find subcategory in the filters
                // const location = routeData.location;
                // const categoryPath = findCategoryPathFromLocation(filtersObject, location, keywordMap);

                tooltipRouteContent.fellingDate = routeData.fellingDate;
                tooltipRouteContent.location = routeData.location;
                tooltipRouteContent.startYear = routeData.startYear;
                tooltipRouteContent.endYear = routeData.endYear;
                tooltipRouteContent.length = routeData.length;
                tooltipRouteContent.TBP = routeData.TBP;
                tooltipRouteContent.provenance = routeData.provenance;
                // tooltipRouteContent.categoryPath = categoryPath;
                tooltipRouteContent.categoryPath = ["Constructions", "Buildings", "Churches", "Truss legs"];

                visiblePath.setStyle({ weight: 5, opacity: 1 });

                drawnTradeRoutes.forEach(route => {
                    if(route !== visiblePath) {
                        route.setStyle({ opacity: 0.35 });
                    }
                })
            });

            hoverPath.on('mouseout', () => {
                showTooltipRoute = false;
                visiblePath.setStyle({ weight: 2, opacity: 0.7 });
                drawnTradeRoutes.forEach(route => {
                    route.setStyle({ opacity: 0.7 });
                })
            });

            drawnTradeRoutes.push(visiblePath, hoverPath);
        });
    };

    // Draw route on map
    const drawTradeRoute = (data, objectType) => {
        const provenance = data.provenance;
        const matchedRoute = tradeRoutesCoords.find(route => route.name === provenance);

        if (matchedRoute) {
            const count = routeDrawCounts[provenance] || 0;
            const offset = [0.03 * count, 0.03 * count];
            routeDrawCounts[provenance] = count + 1;
            
            const parentType = subtypeMap[objectType] || objectType;
            const color = colorScale(parentType);

            addTradeRouteToMap(matchedRoute, offset, color, data);
        } else {
            // console.warn("No matching route for provenance:", provenance);
        }
    };
    
    // Draw map
    const drawMapData = () => {
        if (!map || !leafletReady || !activeDataSets) return;

        cancelAnimatingTradeRoutes();
        clearTradeRoutesFromMap();
        routeDrawCounts = {};

        processActiveDataSets(activeDataSets);
    };

    const processActiveDataSets = (activeDataSets) => {
        // console.log("activedatasets", activeDataSets);
        if (!Array.isArray(activeDataSets)) {
            console.warn("Expected activeDataSets to be an array");
            return;
        }

        // Case 2 & 3: Structured with 'name' and 'data'
        activeDataSets.forEach(firstLevel => {
            const objectType = firstLevel.name || "unknown";

            if (Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if (secondLevel && Array.isArray(secondLevel.data)) {
                        // Case 3: Nested .data inside .data
                        secondLevel.data.forEach(item => {
                            drawTradeRoute(item, objectType);
                        });
                    } else {
                        // Case 2: Single layer
                        drawTradeRoute(secondLevel, objectType);
                    }
                });
            } else {
                console.warn("Unrecognized structure in item:", firstLevel);
            }
        });
    }

    let addZoomControl = (leaflet, map) => {
        map.removeControl(map.zoomControl);

        leaflet.control.zoom({
            position: 'bottomright'
        }).addTo(map);
    }
    
    onMount(async () => {
        if (browser) {
            leaflet = await import('leaflet');
            leafletReady = true;

            map = leaflet.map(mapContainer).setView([54.6128, 12.216797], 5);
            if (map) {
                map.on('mousemove', (event) => {
                    // Capture the mouse position relative to the map container
                    tooltipPosition = {
                        x: event.originalEvent.clientX,
                        y: event.originalEvent.clientY,
                    };
                });
            }

            updateCurrentMap(selectedMapType);

            addZoomControl(leaflet, map);

            addMarkersToMap(leaflet, tradeCitiesCoords, map);
            addProvenancesToMap(leaflet, provenancesCoords, map);

            drawMapData();

            // // get long and lat on click
            // const onMapClick = (event) => {
            //     alert("You clicked the map at " + event.latlng);
            // }
 
            // map.on('click', onMapClick);
        }
    });

    const drawTimelineYearData = () => {
        clearTradeRoutesFromMap();

        if (Array.isArray(timelineDataSelection)) {
            timelineDataSelection.forEach(data => {
                const objectType = data.objectType || "unknown";
                drawTradeRoute(data, data.objectType);
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

    let mapTypes = [
        {
            value: 'area',
            mapLink: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png?api_key=c4121b12-d5f5-4e00-9ce7-d8abe5389b1b',
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        },
        {
            value: 'dark',
            mapLink: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        {
            value: 'rivers',
            mapLink: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>'
        },

    ];

    let updateCurrentMap = (mapType) => {
        const selected = mapTypes.find(m => m.value === mapType);

        if (!selected) return;

        // Remove the old tile layer if it exists
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
        }

        // Create and add the new tile layer
        currentTileLayer = leaflet.tileLayer(selected.mapLink, {
            attribution: selected.attribution
        }).addTo(map);

    }

    $: if(selectedMapType && leaflet) {
        updateCurrentMap(selectedMapType);
    }

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