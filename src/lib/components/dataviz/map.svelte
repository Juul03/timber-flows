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
{#if popup && showPopupAgain}
    <div class="popup-container col-3 position-absolute top-50 start-50 translate-middle z-3 bg-white rounded p-3">
        <div class="row popup-content">
            <div class="col-12">
                <h3 class="center">{popupContent.title}</h3>
                <p>{popupContent.description}</p>
                <button 
                    class="btn btn-primary d-inine-flex" 
                    on:click={() => popup = false}
                >
                    Got it! Close
                </button>
                <button 
                    class="btn btn-link d-inine-flex" 
                    on:click={() => {
                        popup = false
                        showPopupAgain = false;
                        }}
                >
                    Don't show again
                </button>
            </div>
        </div>
    </div>
{/if}

<script>
    // import { PUBLIC_ARCGIS_API_KEY } from '$env/static/public';
    export let arcgisApiKey;

    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { lineString } from '@turf/helpers';
    import bezierSpline from '@turf/bezier-spline';

    import { colorScale, subtypeMap } from '$lib/scripts/colorConfig';
    import { getCategoryPathCombined } from '$lib/scripts/formatData.js';

    import { filtersObject } from '$lib/data/filtersWoodPurpose.js';

    import tradeCitiesCoords from '$lib/data/tradeCities';
    import provenancesCoords from '$lib/data/provenances';
    import tradeRoutesCoords from '$lib/data/tradeRoutes';
    import endpointsLocations from '$lib/data/endpointsLocations.json';
    

    // components
    import TooltipRoute from '$lib/components/UI/routeTooltip.svelte';

    // Imported variables
    export let activeDataSets;
    export let timelineDataSelection;
    export let selectedMapType;
    export let keywordMap = {};
    export let timelineClicked;
    export let timelineRunning;
    export let timelineSpeed = 500;
    export let selectedLocations = [];
    export let previousSelectedLocations = [];
    export let selectionPath;
    export let selectedMapLayers = [];

    // Compontent variables
    let previousActiveDataSets = null;
    let previousSelectionPath = [];
    let skipNextDrawMapData = false;
    let drawnTradeRoutes = [];
    let animatingTradeRoutes = [];
    let routeDrawCounts = {};

    let leafletReady = false;
    let leaflet;
    let esri;
    
    let mapContainer;
    let map;
    let currentTileLayer;
    let markersActive = false;
    let cityMarkers = [];
    let waterwaysLayer = null;
    let oakLayer = null;

    let popup = false;
    let showPopupAgain = true;
    let popupContent = { title: '', description: '' };

    const provenanceEllipseMap = new Map();
    const locationEllipseMap = new Map();

    let animationSpeed;
    let animationSpeedSlow = 6000;
    let animationSpeedFast = timelineSpeed;
    export let zeroState = true;
    
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
        keyCode: '',
    }

    let mapTypes = [
        {
            value: 'area',
            mapLink: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png?api_key=c4121b12-d5f5-4e00-9ce7-d8abe5389b1b',
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        },
        {
            value: 'rivers',
            mapLink: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>'
        },
        {
            value: 'arcgis_topo',
            mapLink: 'Topographic', // Esri basemap ID
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
            isEsri: true
        },
        {
            value: 'gray_light',
            mapLink: 'Gray',
            attribution: 'Tiles &copy; Esri &mdash; Esri Dark Gray Basemap',
            isEsri: true
        },
        {
            value: 'gray_dark',
            mapLink: 'DarkGray',
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
            isEsri: true
        },

    ];

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
            const marker = leaflet.marker(city.coordinates, { icon: customIcon }).addTo(map);
            marker.bindPopup(city.name);
            cityMarkers.push(marker);
        });
    };


    const addProvenancesToMap = (leaflet, provenances, map) => {
        provenances.forEach(provenance => {
            let ellipse = L.ellipse(
                provenance.coordinateCenter,
                [provenance.xRadius, provenance.yRadius],
                typeof provenance.angle === "number" ? provenance.angle : 0,
                {
                    className: 'provenanceEllipse'
                }
            ).addTo(map);

            ellipse.bindPopup(provenance.name);

            // Store it by name
            provenanceEllipseMap.set(provenance.name, ellipse);
        });
    };

    const addLocationsToMap = (leaflet, locations, map) => {
        locations.forEach(location => {
            let ellipse = L.ellipse(
                location.coordinates,
                [1500, 1500],0,
                {
                    className: 'locationEllipse'
                }
            ).addTo(map);

            ellipse.bindPopup(location.location);

            // Store it by name
            locationEllipseMap.set(location.location, ellipse);
        });
    };

    // Clear traderoutes when data is updated
    const clearTradeRoutesFromMap = () => {
        drawnTradeRoutes.forEach(layer => {
            if (layer && map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
        drawnTradeRoutes = [];
    };


    const smoothPath = (coords) => {
        // Turf expects [lng, lat], not [lat, lng]
        const line = lineString(coords.map(([lat, lng]) => [lng, lat]));
        const curved = bezierSpline(line, { sharpness: 0.75 });

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
    
    const animatePath = (coords, options = {}, totalDuration = animationSpeed, onComplete = () => {}) => {
        if (!coords.length) return;

        const path = leaflet.polyline([coords[0]], {
            ...options,
            opacity: 1
        }).addTo(map);
        animatingTradeRoutes.push(path);

        let startTime = null;
        const initialOpacity = 1;
        let finalOpacity;

        if(timelineClicked || zeroState) {
            finalOpacity = 1;
        } else if (!timelineClicked) {
            finalOpacity = 0;
        }

        const opacityStep = (initialOpacity - finalOpacity) / coords.length;

        let index = 1;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            const targetIndex = Math.floor(progress * coords.length);

            while (index < targetIndex && index < coords.length) {
                path.addLatLng(coords[index]);
                index++;
            }

            if (index < coords.length) {
                if(totalDuration === animationSpeedFast) {
                    const easedProgress = Math.pow(progress, 2);
                    const newOpacity = initialOpacity - easedProgress * (initialOpacity - finalOpacity);
                    path.setStyle({ opacity: newOpacity });
                }
                
                requestAnimationFrame(step);
            } else {
                animatingTradeRoutes = animatingTradeRoutes.filter(p => p !== path);
                drawnTradeRoutes.push(path);

                if(totalDuration === animationSpeedFast) {
                    path.setStyle({ opacity: finalOpacity });
                }
                
                onComplete(path);
            }
        };

        requestAnimationFrame(step);
        return path;
    };

    // add all trade routes
    const addTradeRouteToMap = (route, offset, color, routeData) => {
        if (!routeData) return;

        const offsetCoordinates = offsetPath(route.coordinates, offset);
        let finalCoordinates = [...offsetCoordinates];

        // Check if exact lat/lng are provided
        if (
            routeData.latitude 
            && routeData.longitude 
            && routeData.latitude !== "0" 
            && routeData.longitude !== "0"
            && routeData.longitude !== "-"
            && routeData.latitude !== "-"
        ) {
            finalCoordinates[finalCoordinates.length - 1] = [
                parseFloat(routeData.latitude),
                parseFloat(routeData.longitude)
            ];

        } else if (routeData.location && routeData.location.trim() !== "") {
            // Fully clean the location (remove commas and trim)
            const cleanLocation = routeData.location.replace(/,/g, '').trim().toLowerCase();

            // Extract first word (or "den" + next if applicable)
            const parts = cleanLocation.split(' ');
            let key = parts[0];
            if (key === "den" && parts.length > 1) {
                key = `den ${parts[1]}`;
            }
            if (key === "alphen") {
                const remaining = parts.slice(1).join(' ');
                if (remaining.startsWith('aan den rijn')) {
                    key = "alphen aan den rijn";
                } else {
                    key = "alphen aan den rijn";
                }
            }

            // Try to match to endpoint locations
            const matched = endpointsLocations.find(loc =>
                loc.location.toLowerCase() === key
            );

            if (matched) {
                finalCoordinates[finalCoordinates.length - 1] = matched.coordinates;
            } else {
                // console.log("No matching location found in endpoints", routeData.location);
            }

        } else {
            // console.log("No coordinates or valid location provided, using original route", routeData.location);
        }

        const smoothedCoordinates = smoothPath(finalCoordinates);

        animatePath(smoothedCoordinates, {
            color: color,
            weight: 2,
            opacity: 0.7,
        }, animationSpeed, (completedPath) => {
            const visiblePath = completedPath;
            let hoverPath;

            // Create an invisible thicker path on top for easier hover
            if (
                leaflet &&
                map &&
                visiblePath &&
                typeof visiblePath.getLatLngs === 'function'
            ) {
                const latLngs = visiblePath.getLatLngs();

                // Validate that all latLngs are arrays of two valid numbers
                const areValidLatLngs = Array.isArray(latLngs) &&
                latLngs.length > 0 &&
                latLngs.every(coord =>
                    (Array.isArray(coord) &&
                        coord.length === 2 &&
                        typeof coord[0] === 'number' &&
                        typeof coord[1] === 'number' &&
                        !isNaN(coord[0]) &&
                        !isNaN(coord[1])
                    ) ||
                    (typeof coord?.lat === 'number' &&
                    typeof coord?.lng === 'number' &&
                    !isNaN(coord.lat) &&
                    !isNaN(coord.lng))
                );


                if (areValidLatLngs) {
                    hoverPath = leaflet.polyline(latLngs, {
                        color: 'transparent',
                        weight: 20,
                        opacity: 0,
                        className: 'hover-path',
                        pane: 'shadowPane'
                    }).addTo(map);
                } else {
                    // console.warn('Invalid coordinates found in visiblePath.getLatLngs()', latLngs);
                }
            }

            if(hoverPath) {
                // Highlight visible path on hover and show tooltip
                hoverPath.on('mouseover', () => {
                    showTooltipRoute = true;

                    let location = routeData.location;
                    const categoryPath = getCategoryPathCombined(filtersObject, routeData, keywordMap);
                    let fellingDate = routeData.fellingDate;
                    let startYear = routeData.startYear;

                    if(routeData.sapwood === 0 || routeData.fellingDate?.toString().length === 4) {
                        fellingDate = `After ${routeData.fellingDate}`;
                    }

                    if(routeData.startYear === undefined) {
                        startYear = routeData.endYear - routeData.length + 1;
                    }

                    tooltipRouteContent.fellingDate = fellingDate;
                    tooltipRouteContent.location = routeData.location;
                    tooltipRouteContent.startYear = startYear;
                    tooltipRouteContent.endYear = routeData.endYear;
                    tooltipRouteContent.length = routeData.length;
                    tooltipRouteContent.TBP = routeData.TBP;
                    tooltipRouteContent.provenance = routeData.provenance;
                    tooltipRouteContent.categoryPath = categoryPath;
                    tooltipRouteContent.keyCode = routeData.keyCode;

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

                // drawnTradeRoutes.push(visiblePath, hoverPath);
                drawnTradeRoutes.push(visiblePath);
                if (hoverPath) {
                    drawnTradeRoutes.push(hoverPath);
                }

            }
        });
    };

    // Draw route on map
    const drawTradeRoute = (data, objectType) => {
        const provenance = data.provenance || "";
        if(provenance === "") return; 

        const provenanceLower = provenance.toLowerCase().trim();
        const matchedRoute = tradeRoutesCoords.find(
            route => route.name?.toLowerCase().trim() === provenanceLower
        );

        if (matchedRoute) {
            const count = routeDrawCounts[provenance] || 0;
            const offset = [0.03 * count, 0.03 * count];
            routeDrawCounts[provenance] = count + 1;
            
            const parentType = subtypeMap[objectType] || objectType;
            const color = colorScale(parentType);

            addTradeRouteToMap(matchedRoute, offset, color, data);
        } else {
            console.warn("No matching route for provenance:", provenance);
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
        if (!Array.isArray(activeDataSets)) {
            console.warn("Expected activeDataSets to be an array");
            return;
        }

        // Structured with 'name' and 'data'
        activeDataSets.forEach(firstLevel => {
            const objectType = firstLevel.name || "unknown";

            if (Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if (secondLevel && Array.isArray(secondLevel.data)) {
                        // Case 3: Nested .data inside .data
                        secondLevel.data.forEach(item => {
                            if(selectedLocations && selectedLocations.length > 0) {
                                if(!selectedLocations.some(loc => item.location?.toLowerCase().includes(loc.toLowerCase()))) {
                                    return;
                                }
                            }
                            drawTradeRoute(item, objectType);
                        });
                    } else {
                        // Case 2: Single layer
                        if(selectedLocations && selectedLocations.length > 0) {
                            if(!selectedLocations.some(loc => secondLevel.location?.toLowerCase().includes(loc.toLowerCase()))) {
                                return;
                            }
                        }
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

    const extractYear = (fellingDate) => {
        if (!fellingDate) return null;

        // If it's a number (already a valid year), just return it
        if (typeof fellingDate === 'number') {
            return fellingDate;
        }

        // If it's a string (e.g., "1500-1550" or "1500"), extract first part
        if (typeof fellingDate === 'string') {
            // Try to find a year inside parentheses first
            const parenMatch = fellingDate.match(/\((\d{4})\)/);
            if (parenMatch) {
                return parseInt(parenMatch[1], 10);
            }

            // If no parentheses, check if it is a range "1500-1550"
            if (fellingDate.includes('-')) {
                const yearStr = fellingDate.split('-')[0].trim();
                const year = parseInt(yearStr, 10);
                return isNaN(year) ? null : year;
            }

            // Otherwise try parsing the whole string as year (e.g. "1500")
            const year = parseInt(fellingDate.trim(), 10);
            return isNaN(year) ? null : year;
        }

        // Fallback for unexpected types
        return null;
    };

    const groupDataByYear = (activeDataSets) => {
        const yearMap = new Map();

        activeDataSets.forEach(firstLevel => {
            const objectType = firstLevel.name || "unknown";

            if (Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if (secondLevel && Array.isArray(secondLevel.data)) {
                        secondLevel.data.forEach(item => {
                            const year = extractYear(item.fellingDate);
                            if (year && year >= 1400 && year <= 1850) {
                                if (!yearMap.has(year)) yearMap.set(year, []);
                                yearMap.get(year).push({ item, objectType });
                            }
                        });
                    } else {
                        const year = extractYear(secondLevel.fellingDate);
                        if (year && year >= 1400 && year <= 1850) {
                            if (!yearMap.has(year)) yearMap.set(year, []);
                            yearMap.get(year).push({ item: secondLevel, objectType });
                        }
                    }
                });
            } else {
                console.warn("Unrecognized structure in item:", firstLevel);
            }
        });

        return yearMap;
    };


    const drawMapDataByYear = async (activeDataSets) => {
        if (!map || !leafletReady || !activeDataSets) return;

        cancelAnimatingTradeRoutes();
        clearTradeRoutesFromMap();
        routeDrawCounts = {};

        const yearMap = groupDataByYear(activeDataSets);

        // Sort years ascending
        const years = Array.from(yearMap.keys()).sort((a, b) => a - b);

        for (const year of years) {
            const entries = yearMap.get(year);
            entries.forEach(({ item, objectType }) => {
                if(zeroState) {
                    drawTradeRoute(item, objectType);
                }
            });

            // Wait before drawing the next year
            await new Promise(resolve => setTimeout(resolve, 75));
        }
        zeroState = false;
        skipNextDrawMapData = true;
    };
        
    onMount(async () => {
        if (browser) {
            leaflet = await import('leaflet');
            leafletReady = true;
            await import('leaflet-ellipse');
            esri = await import('esri-leaflet');

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

            // get long and lat on click
            // const onMapClick = (event) => {
            //     alert("You clicked the map at " + event.latlng);
            // }

            // map.on('click', onMapClick);

            animationSpeed = animationSpeedSlow;
            updateCurrentMap(selectedMapType || 'area');

            addZoomControl(leaflet, map);

            if(markersActive) {
                addMarkersToMap(leaflet, tradeCitiesCoords, map);
            }

            addProvenancesToMap(leaflet, provenancesCoords, map);
            addLocationsToMap(leaflet, endpointsLocations, map);

            zeroState = false;

            // if(zeroState) {
            //     drawMapDataByYear(activeDataSets);
            // }
        }
    });

    const setProvenaceOpacity = () => {
        let opacity;

        if(selectedMapType === "dark") {
            opacity = 0.25;
        } else if (selectedMapType === "area") {
            opacity = 0.25;
        }

        if(timelineRunning) {
            provenanceEllipseMap.forEach(ellipse => {
                ellipse.setStyle({ opacity: 0, fillOpacity: 0 });
            });
        } else if(!timelineRunning) {
            provenanceEllipseMap.forEach(ellipse => {
                ellipse.setStyle({ opacity: .5, fillOpacity: opacity });
            });
        }
    }

    const drawTimelineYearData = () => {
        clearTradeRoutesFromMap();
        if(animationSpeed === animationSpeedSlow) {
            cancelAnimatingTradeRoutes();
        }

        routeDrawCounts = {};

        setProvenaceOpacity();

        if (Array.isArray(timelineDataSelection)) {
            console.log("Drawing timeline data selection", timelineDataSelection);
            timelineDataSelection.forEach(firstLevel => {
                const objectType = firstLevel.name || "unknown";

                if (Array.isArray(firstLevel.data)) {
                    firstLevel.data.forEach(secondLevel => {
                        if (secondLevel && Array.isArray(secondLevel.data)) {
                            // Nested data, draw each item
                            secondLevel.data.forEach(item => {
                                drawTradeRoute(item, objectType);
                                // allprovenances.find(provenance with matching id === item.provenance)
                                // highligh provenance to set opacity ot 0.75 for 500ms
                                const provenanceName = item.provenance;
                                const ellipse = provenanceEllipseMap.get(provenanceName);
                                if (ellipse) {
                                    ellipse.setStyle({ opacity: 1, fillOpacity: 0.25 });
                                }
                            });
                        } else {
                            // single layer
                            drawTradeRoute(secondLevel, objectType);

                            const provenanceName = secondLevel.provenance;
                            const ellipse = provenanceEllipseMap.get(provenanceName);
                            if (ellipse) {
                                ellipse.setStyle({ opacity: 1, fillOpacity: 0.25});
                            }
                        }
                    });
                }
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

    let updateCurrentMap = (mapType) => {
        const selected = mapTypes.find(m => m.value === mapType);

        if (!esri) return;
        if (!selected) return;

        // Remove old class
        mapTypes.forEach(m => mapContainer.classList.remove(`map-${m.value}`));
        mapContainer.classList.add(`map-${mapType}`);

        // Remove old tile layer if exists
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
        }

        // Remove existing tile layer
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
        }

        // Add Esri or standard Leaflet tile layer
        if (selected.isEsri) {
            currentTileLayer = esri.basemapLayer(selected.mapLink, {
                apikey: arcgisApiKey
            }).addTo(map);
        } else {
            currentTileLayer = leaflet.tileLayer(selected.mapLink, {
                attribution: selected.attribution
            }).addTo(map);
        }
    };

    let loadingPopup = null;

    // Maplayers
    const updateMapLayer = () => {
        // Toggle rivers
        if (selectedMapLayers.includes('rivers')) {
            if (!waterwaysLayer) {
                popup = true;
                popupContent = {
                    title: 'Loading waterways layer',
                    description: 'This layer is pretty big. It will take a while before anything is showing up. Please be patient.'
                };

                let selectedLayer = null;

                waterwaysLayer = esri.featureLayer({
                    url: 'https://services5.arcgis.com/sjP4Ugu5s0dZWLjd/arcgis/rest/services/European_main_rivers/FeatureServer/0',
                    simplifyFactor: 0.5,
                    precision: 5,
                    style: () => ({
                        color: '#3399cc',
                        weight: 2,
                        opacity: 0.8,
                        className: 'river-path'
                    }),
                    onEachFeature: function (feature, layer) {
                        const name = feature.properties?.NAME || 'Unnamed river';

                        // Add tooltip but not permanent at first
                        const tooltip = layer.bindTooltip(name, {
                            permanent: false,
                            direction: 'auto',
                            className: 'river-label'
                        });

                        const highlightStyle = {
                            color: '#004488',
                            weight: 5,
                            opacity: 1
                        };

                        const defaultStyle = {
                            color: '#3399cc',
                            weight: 2,
                            opacity: 0.8
                        };

                        layer._isSelected = false;

                        layer.on('mouseover', function () {
                            if (!layer._isSelected) {
                                layer.setStyle(highlightStyle);
                            }
                        });

                        layer.on('mouseout', function () {
                            if (!layer._isSelected) {
                                layer.setStyle(defaultStyle);
                            }
                        });

                        layer.on('click', function () {
                            // Deselect previously selected river
                            if (selectedLayer && selectedLayer !== layer) {
                                selectedLayer._isSelected = false;
                                selectedLayer.setStyle(defaultStyle);
                                selectedLayer.unbindTooltip(); // remove the persistent label
                                selectedLayer.bindTooltip(selectedLayer.feature.properties?.NAME || 'Unnamed river', {
                                    permanent: false,
                                    direction: 'auto',
                                    className: 'river-label'
                                });
                            }

                            // Select current layer
                            layer._isSelected = true;
                            selectedLayer = layer;
                            layer.setStyle(highlightStyle);

                            layer.unbindTooltip(); // clear old tooltip
                            layer.bindTooltip(name, {
                                permanent: true,
                                direction: 'center',
                                className: 'river-label-selected'
                            }).openTooltip();
                        });
                    }
                }).addTo(map);

                // set highloghtstyle to defaultstyle when there is a click not on the layer
                map.on('click', function (e) {
                    // if selecgtedLayer en selectedLayer is not clicked
                    if (selectedLayer && !selectedLayer.getBounds().contains(e.latlng)) {
                        selectedLayer._isSelected = false;
                        selectedLayer.setStyle({
                            color: '#3399cc',
                            weight: 2,
                            opacity: 0.8
                        });
                        selectedLayer.unbindTooltip(); // remove the persistent label
                        selectedLayer.bindTooltip(selectedLayer.feature.properties?.NAME || 'Unnamed river', {
                            permanent: false,
                            direction: 'auto',
                            className: 'river-label'
                        });
                        selectedLayer = null;
                    }
                });
            }
        } else {
            if (waterwaysLayer && map.hasLayer(waterwaysLayer)) {
            map.removeLayer(waterwaysLayer);
            waterwaysLayer = null;
            }
        }

        // Toggle markers for trade cities
        if (selectedMapLayers.includes('cities')) {
            addMarkersToMap(leaflet, tradeCitiesCoords, map);
        } else {
            cityMarkers.forEach(marker => {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
            cityMarkers = [];
            
        }

        if(selectedMapLayers.includes('oak_distribution')) {
            loadOakDistribution(map);
        } else {
            if (oakLayer && map.hasLayer(oakLayer)) {
                map.removeLayer(oakLayer);
                oakLayer = null;
            }
        }
    };

    const loadOakDistribution = async (map) => {
        if (oakLayer) {
            map.removeLayer(oakLayer);
            oakLayer = null;
            return;
        }

        const response = await fetch('/data/Quercus_robur_plg_clip.json');
        const geojson = await response.json();

        oakLayer = L.geoJSON(geojson, {
            style: {
                color: '#228B22',
                weight: 1,
                fillOpacity: 0.5
            },
            onEachFeature: (feature, layer) => {
                const name = 'Oak distribution';
                layer.bindTooltip(name);
            }
        }).addTo(map);
    }


    // Utility function for deep comparison
    const deepEqual = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    $: if (!deepEqual(selectedLocations, previousSelectedLocations)) {
        drawMapData();
        previousSelectedLocations = structuredClone(selectedLocations);
    }

    $: if(selectedMapType && leaflet && map) {
        updateCurrentMap(selectedMapType);
    }

    $: if (
        leafletReady && map &&
        activeDataSets &&
        !zeroState &&
        (
            activeDataSets !== previousActiveDataSets ||
            !deepEqual(selectionPath, previousSelectionPath)
        )
    ) {
        if (skipNextDrawMapData) {
            skipNextDrawMapData = false;
        } else {
            previousActiveDataSets = activeDataSets;
            previousSelectionPath = structuredClone(selectionPath);

            animationSpeed = animationSpeedSlow;
            drawMapData();
        }
    }

    $: if (timelineDataSelection != undefined && leafletReady && map) {
        animationSpeed = animationSpeedFast;

        if(timelineClicked) {
            animationSpeed = animationSpeedSlow;
        }
        drawTimelineYearData();
    }

    $: if(timelineRunning || !timelineRunning) { 
        setProvenaceOpacity();
    }

    let previousTimelineRunning = timelineRunning;

    $: if (timelineRunning && !previousTimelineRunning) {
        cancelAnimatingTradeRoutes();
    }

    // Update the previous value **after** the reactive block
    $: previousTimelineRunning = timelineRunning;

    $: if(selectedMapLayers) {
        updateMapLayer();
    }

</script>  
    
<style>
    @import 'leaflet/dist/leaflet.css';
</style>