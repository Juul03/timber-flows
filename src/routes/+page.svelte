<svelte:head>
  <title>Timber Flows: Visualizing Oak Trade into the Low Countries (1400–1800)</title>
  <meta name="description" content="Explore interactive maps and bar charts showing the historical distribution of oak and timber trade routes into the Low Countries from 1400 to 1800. Data collected from the Woods for Goods project." />
</svelte:head>

<div class="page-wrapper d-flex flex-column min-vh-100">
    <main class="{selectedMapType} flex-grow-1">
        <h1 class="text-primary d-none">Timber Flows</h1>
        <div class="{currentView == "map" ? "" : "d-none"}">
            <h2>Map</h2>
            <Map {activeDataSets}
                {timelineDataSelection}
                {selectedMapType}
                {timelineClicked}
                {timelineRunning}
                {timelineSpeed}
                {selectionPath}
                {selectedLocations}
                {previousSelectedLocations}
                {selectedMapLayers}
                arcgisApiKey={data.arcgisApiKey}
                bind:zeroState
            />
            <div class="container position-relative z-3">
                <div class="position-absolute w-100 top-0">
                    <!-- <Filters 
                        {dataWoodPurposes}
                        {uniqueLocations}
                        {totalDatapoints}
                        {datapointsLength}
                        {activeDataSets}
                        bind:selectedWoodPurpose 
                        bind:selectedType 
                        bind:selectedSubType
                        bind:selectionPath
                        bind:selectedOption
                        bind:selectedMapType
                        bind:selectedLocations
                        bind:selectedMapLayers
                    /> -->
                    <div class="row justify-content-end">
                        <div class="col-9">
                            <Timeline 
                                {activeDataSets}
                                {selectedMapType}
                                bind:currentYearTimeline
                                bind:timelineClicked
                                bind:timelineRunning
                                bind:timelineSpeed
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container {currentView != "map" ? "" : "d-none"}">
            <div class="row">
                <div class="col">
                    <!-- <Barchart
                        {activeDataSets}
                    /> -->
                </div>
            </div>
        </div>
        <div class="position-absolute bottom-0 start-50 translate-middle-x mb-2">
            <!-- <SwitchViews
                bind:currentView
            /> -->
        </div>
    </main>
    <Footer/>
</div>

<script>
    import '../assets/styles/app.scss';
    export let data;

    import { onMount } from 'svelte';

    // Data
    import { datafiles } from '$lib/data/datafiles/index';

    // Data files (need to be an async function later)
    import dataWoodPurposes from '$lib/data/woodPurposes.json';
    // import dataHalfModels from '$lib/data/artworks/half-models.json';
    // import dataConstructions from '$lib/data/constructions/constructions.json';
    // import dataShipwreckBatavia from '$lib/data/constructions/shipwreckBatavia.json';
    // import dataArcheology from '$lib/data/constructions/archeology.json';
    // import dataPanelPaintings from '$lib/data/artworks/panelPaintings.json';
    // import dataSculptures from '$lib/data/artworks/sculptures.json';
    // import dataBuildings from '$lib/data/constructions/buildings.json';
    // import dataShipwrecks from '$lib/data/constructions/shipwrecks.json';
    // import dataFurniture from '$lib/data/furniture/furniture.json';
    // import dataStaves from '$lib/data/constructions/staves.json';

    // Scripts
    import { formatData, formatDataBatavia, formatDataSjoerd, getUniqueValues, getFellingDates, getUniqueLocations, countDataPoints, countFlatDataPoints } from '$lib/scripts/formatData.js';

    // Components
    import Filters from '$lib/components/filters.svelte';
    import Map from '$lib/components/dataviz/map.svelte';
    import Barchart from '$lib/components/dataviz/barchart.svelte';
    import Timeline from '$lib/components/timeline.svelte';
    import SwitchViews from '$lib/components/UI/switchViews.svelte';
    import Footer from '$lib/components/footer.svelte';

    // Datasets
    let rawDatafiles = [ 
        { 
            file: 'half-models.json', 
            name: 'halfModels', 
            format: 'formatData'
        },
        { 
            file: 'panelPaintings.json', 
            name: 'panelPaintings', 
            format: 'formatDataSjoerd' 
        },
        { 
            file: 'sculptures.json', 
            name: 'sculptures', 
            format: 'formatDataSjoerd'
        },
        { 
            file: 'constructions.json', 
            name: 'constructions', 
            format: 'formatData'
        },
        { 
            file: 'shipwrecks.json', 
            name: 'shipwrecks', 
            format: 'formatDataSjoerd'
        },
        { 
            file: 'shipwreckBatavia.json', 
            name: 'shipwrecksBatavia', 
            format: 'formatDataBatavia' 
        },
        { 
            file: 'archeology.json', 
            name: 'archeology', 
            format: 'formatDataSjoerd'
        },
        { 
            file: 'buildings.json', 
            name: 'buildings', 
            format: 'formatDataSjoerd'
        },
        { 
            file: 'staves.json', 
            name: 'staves', 
            format: 'formatDataSjoerd'
        },
        { 
            file: 'furniture.json', 
            name: 'furniture', 
            format: 'formatDataSjoerd'
        }
    ];

    let halfModels;
    let panelPaintings;
    let sculptures;
    let constructions;
    let shipwrecks;
    let shipwrecksBatavia;
    let archeology;
    let buildings;
    let staves;
    let furniture;


    // Variables
    // Dynamic var retrieved from filters
    let selectedWoodPurpose = "all";
    let selectedType = "all";
    let selectedSubType = "all";

    let selectionPath = [];
    let selectedOption = 'All';

    export let selectedLocations = [];
    export let previousSelectedLocations = [];

    export let selectedMapType = 'area';
    export let selectedMapLayers = [];

    // // Dynamic retrieved from timeline
    let currentYearTimeline;
    let timelineClicked = false;
    export let timelineRunning = false;
    export let timelineSpeed = 500;

    // // Dynamic retrieved from view buttons
    export let currentView = "map";

    // // Dynamic retrieved from map
    export let zeroState = true;

    // // Var to store data based on timeline selection
    export let timelineDataSelection;

    // // exported var 
    // export let uniqueLocations;
    // export let totalDatapoints;

    // Format data files
    // let formattedDataHalfModels = formatData(dataHalfModels, true);
    // let formattedDataConstructions = formatData(dataConstructions);
    // let formattedDataShipwrecksBatavia = formatDataBatavia(dataShipwreckBatavia);
    // let formattedDataArcheology = formatDataSjoerd(dataArcheology);
    // let formattedDataPanelPaintings = formatDataSjoerd(dataPanelPaintings);
    // let formattedDataSculptures = formatDataSjoerd(dataSculptures);
    // let formattedDataBuildings = formatDataSjoerd(dataBuildings);
    // let formattedDataShipwrecks = formatDataSjoerd(dataShipwrecks);
    // let formattedDataFurniture = formatDataSjoerd(dataFurniture);
    // let formattedDataStaves = formatDataSjoerd(dataStaves);

    // Data variables
    // let halfModels = formattedDataHalfModels;
    // let constructions = formattedDataConstructions;
    // let shipwrecksBatavia = formattedDataShipwrecksBatavia;
    // let archeology = formattedDataArcheology;
    // let panelPaintings = formattedDataPanelPaintings;
    // let sculptures = formattedDataSculptures;
    // let buildings = formattedDataBuildings;
    // let shipwrecks = formattedDataShipwrecks;
    // let furniture = formattedDataFurniture;
    // let staves = formattedDataStaves;

    // let dataSetsArtworks = [
    //     {
    //         name: "halfModels",
    //         data: halfModels,
    //     },
    //     {
    //         name: "sculptures",
    //         data: sculptures,
    //     },
    //     {
    //         name: "panelPaintings",
    //         data: panelPaintings,
    //     }
    // ];

    // let dataSetsConstructions = [
    //     {
    //         name: "constructions",
    //         data: constructions,
    //     },
    //     {
    //         name: "shipwrecks",
    //         data: shipwrecks,
    //     },
    //     {
    //         name: "shipwrecksBatavia",
    //         data: shipwrecksBatavia,
    //     },
    //     {
    //         name: "archeology",
    //         data: archeology,
    //     },
    //     {
    //         name: "buildings",
    //         data: buildings,
    //     },
    //     {
    //         name: "staves",
    //         data: staves,
    //     }
    // ];

    // let dataSetsFurniture = [
    //     {
    //         name: "furniture",
    //         data: furniture,
    //     }
    // ];

    let dataSetsAll = [];
    // let dataSetsAll = [
    //     {
    //         name: "artworks",
    //         data: dataSetsArtworks,
    //     },
    //     {
    //         name: "constructions",
    //         data: dataSetsConstructions,
    //     },
    //     {
    //         name: "furniture",
    //         data: dataSetsFurniture,
    //     }
    // ];

    // totalDatapoints = countDataPoints(dataSetsAll);
    // const totalConstructions = dataSetsConstructions.reduce((sum, ds) => sum + ds.data.length, 0);
    // const totalArtworks = dataSetsArtworks.reduce((sum, ds) => sum + ds.data.length, 0);

    // Datasets filtered
    // Construction subsets
    // export let keywordMap = {
    //     "Buildings": ['huis', 'kerk', 'kapel', 'souterrain'],
    //     "Shipwrecks": ['schip', 'schepen', 'ship', 'shipwreck', 'shipwrecks'],
    //     "Superimposed tiebeam": ['dekbalk'],
    //     "Truss legs": ['spant'],
    //     "Corbels": ['korbelen', 'korbeel'],
    //     "Churches": ['kerk', 'kapel'],
    //     "Houses": ['huis', 'woning']
    // };

    // const dataSetCache = {
    //     "Buildings": null,
    //     "Shipwrecks": null,
    //     "Superimposed tiebeam": null,
    //     "Truss legs": null,
    //     "Corbels": null,
    //     "Churches": null,
    //     "Houses": null
    // };

    // export let datapointsLength = [
    //     {
    //         name: "All",
    //         datapoints: totalDatapoints
    //     },
    //     {
    //         name: "Halfmodels",
    //         datapoints: halfModels.length
    //     },
    //     {
    //         name: "Sculptures",
    //         datapoints: sculptures.length
    //     },
    //     {
    //         name: "Panel paintings",
    //         datapoints:panelPaintings.length
    //     },
    //     {
    //         name: "Artworks",
    //         datapoints:totalArtworks
    //     },
    //     {
    //         name: "Furniture",
    //         datapoints: furniture.length
    //     },
    //     {
    //         name: "Constructions",
    //         datapoints: totalConstructions
    //     },
    //     {
    //         name: "Shipwrecks Batavia",
    //         datapoints: shipwrecksBatavia.length
    //     },
    //     {
    //         name: "Buildings",
    //         datapoints: buildings.length + 8 + 13 + 6 + 25 + 15
    //     },
    //     {
    //         name: "Archeology",
    //         datapoints:archeology.length
    //     },
    //     {
    //         name: "Shipwrecks",
    //         datapoints:shipwrecksBatavia.length + shipwrecks.length
    //     },
    //     {
    //         name: "Batavia shipwreck",
    //         datapoints: shipwrecksBatavia.length
    //     },
    //     {
    //         name: "Staves",
    //         datapoints: staves.length
    //     },
    //     {
    //         name: "Non-specified building",
    //         datapoints: buildings.length
    //     },
    //     {
    //         name: "Non-specified shipwrecks",
    //         datapoints:shipwrecks.length
    //     },
    //     {
    //         name: "Superimposed tiebeam",
    //         datapoints: 8
    //     },
    //     {
    //         name: "Truss legs",
    //         datapoints: 13
    //     },
    //     {
    //         name: "Corbels",
    //         datapoints: 6
    //     },
    //     {
    //         name: "Churches",
    //         datapoints: 25
    //     },
    //     {
    //         name: "Houses",
    //         datapoints: 15
    //     },
    //     {
    //         name: "Constructions",
    //         datapoints: totalConstructions
    //     },
    // ];

    // Active data based on selected filters
    export let activeDataSets = dataSetsAll;

    // Get all unique provenances
    // let uniqueProvenancesHalfModels = getUniqueValues(halfModels, 'provenance');
    // let uniqueProvenancesConstructions = getUniqueValues(constructions, 'provenance');

    // let allUniqueProvenances = [...new Set([
    //     ...uniqueProvenancesHalfModels,
    //     ...uniqueProvenancesConstructions
    // ])].sort();

    // Get all felling dates 
    // let fellingDatesHalfModels = getFellingDates(halfModels);
    
    // Get all unique locations (for constructions)
    // uniqueLocations = getUniqueLocations([constructions, shipwrecksBatavia, shipwrecks, archeology, buildings, sculptures, panelPaintings, halfModels, furniture]);

    // const findAllKeysWithValue = (dataSetsConstructions, dataSetName, location, buildingKeywords) => {
    //     const filteredData = dataSetsConstructions.map(dataset => {
    //         const matchingItems = dataset.data.filter(item => {
    //             const lowerLocation = item.location.toLowerCase();

    //             return buildingKeywords.some(keyword => lowerLocation.includes(keyword));
    //         });

    //         return {
    //             name: dataSetName,
    //             data: matchingItems
    //         };
    //     }).filter(dataset => dataset.data.length > 0);

    //     return filteredData;
    // }

    // const filterDataOnSelection = () => {
    //     const findMore = () => {
    //         if (selectionPath[1] !== "Buildings") return;

    //         const buildingType = selectionPath[2]; // e.g., "Churches", "Houses"
    //         const keywords = keywordMap[selectedOption];

    //         if (!buildingType || !keywords) return;

    //         const buildingData = dataSetCache[buildingType];
    //         if (!buildingData) {
    //             console.warn(`No cached data for ${buildingType}`);
    //             return;
    //         }

    //         const dataSetName = `${selectedOption} in ${selectionPath[1]}`;
    //         const filtered = findAllKeysWithValue(buildingData, dataSetName, location, keywords);

    //         return filtered;
    //     };

    //     if (selectionPath[0] === "Artworks") {
    //         if (selectedOption === "Artworks") return dataSetsArtworks;

    //         if (selectedOption === "Halfmodels") {
    //             const set = dataSetsArtworks.find(set => set.name === "halfModels");
    //             return set ? [set] : [];
    //         } else if (selectedOption === "Panel paintings") {
    //             const set = dataSetsArtworks.find(set => set.name === "panelPaintings");
    //             return set ? [set] : [];
    //         } else if (selectedOption === "Sculptures") {
    //             const set = dataSetsArtworks.find(set => set.name === "sculptures");
    //             return set ? [set] : [];
    //         }

    //         return [];
    //     }

    //     if (selectionPath[0] === "Constructions") {
    //         if (selectedOption === "Constructions") return dataSetsConstructions;

    //         if (selectionPath[1] === "Shipwrecks") {
    //             const shipwrecksSet = dataSetsConstructions.find(set => set.name === "shipwrecks");
    //             const shipwrecksBataviaSet = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");

    //             if (selectedOption === "Shipwrecks") {
    //                 // Always return both general and Batavia shipwrecks
    //                 const result = [];
    //                 if (shipwrecksSet) result.push(shipwrecksSet);
    //                 if (shipwrecksBataviaSet) result.push(shipwrecksBataviaSet);
    //                 return result;
    //             } else if (selectedOption === "Batavia shipwreck") {
    //                 return shipwrecksBataviaSet ? [shipwrecksBataviaSet] : [];
    //             } else if (selectedOption === "Non-specified shipwrecks") {
    //                 return shipwrecksSet ? [shipwrecksSet] : [];
    //             }
    //         } else if (selectionPath[1] === "Archeology") {
    //             const set = dataSetsConstructions.find(set => set.name === "archeology");
    //             return set ? [set] : [];
    //         } else if (selectionPath[1] === "Buildings") {
    //             const buildingsSet = dataSetsConstructions.find(set => set.name === "buildings");

    //             if (selectedOption === "Buildings" && keywordMap[selectedOption]) {
    //                 if (!dataSetCache[selectedOption]) {
    //                     const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap[selectedOption]);
    //                     dataSetCache[selectedOption] = filtered;
    //                 }
    //                 const filteredData = dataSetCache[selectedOption] || [];

    //                 // Combine buildingsSet data with filteredData, avoiding duplicates if needed
    //                 const combinedData = [];

    //                 if (buildingsSet) combinedData.push(buildingsSet);
    //                 combinedData.push(...filteredData);

    //                 return combinedData;
    //             }

    //             // filter churches en houses, superimposed tiebeam etc.
    //             if (selectedOption !== "Buildings") {
    //                 if (keywordMap[selectedOption]) {
    //                     if (!dataSetCache[selectedOption]) {
    //                         const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap[selectedOption]);
    //                         dataSetCache[selectedOption] = filtered;
    //                     }
    //                     const more = findMore();
    //                     if (more) {
    //                         return more;
    //                     }
    //                     return dataSetCache[selectedOption];
    //                 }
    //             }

    //             // fallback: just return buildingsSet if no keywordMap or selectedOption doesn't match
    //             return buildingsSet ? [buildingsSet] : [];
    //         } else if (selectionPath[1] === "Staves") {
    //             const set = dataSetsConstructions.find(set => set.name === "staves");
    //             return set ? [set] : [];
    //         }
    //         return [];
    //     }

    //     if (selectionPath[0] === "Furniture") {
    //         if (selectedOption === "Furniture") return dataSetsFurniture;

    //         const set = dataSetsFurniture.find(set => set.name === "furniture");
    //         return set ? [set] : [];
    //     }

    //     if(selectedOption === "All" || selectedOption === null) {
    //         return dataSetsAll;

    //     }

    //     return [];
    // };

    const getYear = (data) => {
        if (typeof data === "string") {
            // First try to find a year in parentheses (e.g., (1628))
            let match = data.match(/\((\d{4})\)/);
            if (match) {
                return parseInt(match[1], 10);
            }
            // Fallback: first 4-digit number anywhere in the string
            match = data.match(/(\d{4})/);
            return match ? parseInt(match[1], 10) : null;
        }
        if (typeof data === "number") {
            return data;
        }
        return null;
    };


    const filterDataOnTimeline = () => {
        timelineDataSelection = [];

        // Loop through each dataset (e.g. halfModels, sculptures, etc.)
        activeDataSets.forEach(dataSet => {
            if (!Array.isArray(dataSet.data)) return;

            // Filter items for the current year
            const matchingItems = dataSet.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);

            if (matchingItems.length > 0) {
                timelineDataSelection.push({
                    name: dataSet.name,
                    data: matchingItems
                });
            }
        });
    };

    // Mapping from names to local variable references
    const variableMap = {
        halfModels: v => (halfModels = v),
        panelPaintings: v => (panelPaintings = v),
        sculptures: v => (sculptures = v),
        constructions: v => (constructions = v),
        shipwrecks: v => (shipwrecks = v),
        shipwrecksBatavia: v => (shipwrecksBatavia = v),
        archeology: v => (archeology = v),
        buildings: v => (buildings = v),
        staves: v => (staves = v),
        furniture: v => (furniture = v),
    };

    // Load all datafiles and format them, store them in the let
    let loadAllDataFiles = async () => {
        for (const file of rawDatafiles) {
            try {
                const module = await datafiles[file.file]();

                let formatted;
                if (file.format === 'formatData') {
                    formatted = formatData(module.default);
                } else if (file.format === 'formatDataBatavia') {
                    formatted = formatDataBatavia(module.default);
                } else if (file.format === 'formatDataSjoerd') {
                    formatted = formatDataSjoerd(module.default);
                }

                if (variableMap[file.name]) {
                    variableMap[file.name](formatted);
                } else {
                    console.warn(`No local variable mapping for ${file.name}`);
                }
            } catch (error) {
                console.error(`Error loading ${file.file}:`, error);
            }
        }
        console.log("datasetsall", dataSetsAll);
    };


    onMount(async () => {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');

        loadAllDataFiles();
    });

    // on change, find right dataset
    $: dataSetsAll = [
        { name: "halfModels", data: halfModels },
        { name: "panelPaintings", data: panelPaintings },
        { name: "sculptures", data: sculptures },
        { name: "constructions", data: constructions },
        { name: "shipwrecks", data: shipwrecks },
        { name: "shipwrecksBatavia", data: shipwrecksBatavia },
        { name: "archeology", data: archeology },
        { name: "buildings", data: buildings },
        { name: "staves", data: staves },
        { name: "furniture", data: furniture }
    ].filter(ds => ds.data);

    console.log("Data sets loaded:", dataSetsAll);

    $: if(dataSetsAll) {
        activeDataSets = dataSetsAll;
    }
    // $: if(selectionPath) {
    //     activeDataSets = filterDataOnSelection();
    // }

    $: if(currentYearTimeline) {
        filterDataOnTimeline();
    }

    // $: if (currentView) {
    //     // console.log("current view changes in parent", currentView);
    // }
</script>