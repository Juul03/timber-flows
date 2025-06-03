<h1 class="text-primary d-none">Timber Flows</h1>

<main class="{selectedMapType}">
    <div class="{currentView == "map" ? "" : "d-none"}">
        <Map {activeDataSets}
            {timelineDataSelection}
            {selectedMapType}
            {keywordMap}
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
                <Filters 
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
                />
                <div class="row justify-content-end">
                    <div class="col-9">
                        <Timeline 
                            {activeDataSets}
                            {selectedMapType}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container {currentView != "map" ? "" : "d-none"}">
        <div class="row">
            <div class="col">
                <Barchart
                    {activeDataSets}
                />
                <!-- <img class="w-100" src="/img/placeholder-barchart.png" alt="barchart placeholder img"> -->
            </div>
        </div>
    </div>
    <div class="position-absolute bottom-0 start-50 translate-middle-x mb-2">
        <SwitchViews
            bind:currentView
        />
    </div>
</main>
<Footer/>

<script>
    import '../assets/styles/app.scss';
    export let data;

    import { onMount } from 'svelte';

    // Data files (need to be an async function later)
    import dataWoodPurposes from '$lib/data/woodPurposes.json';
    import dataHalfModels from '$lib/data/artworks/half-models.json';
    import dataConstructions from '$lib/data/constructions/constructions.json';
    import dataShipwreckBatavia from '$lib/data/constructions/shipwreckBatavia.json';
    import dataArcheology from '$lib/data/constructions/archeology.json';
    import dataPanelPaintings from '$lib/data/artworks/panelPaintings.json';
    import dataSculptures from '$lib/data/artworks/sculptures.json';
    import dataBuildings from '$lib/data/constructions/buildings.json';

    // Scripts
    import { formatData, formatDataBatavia, formatDataSjoerd, getUniqueValues, getFellingDates, getUniqueLocations, countDataPoints, countFlatDataPoints } from '$lib/scripts/formatData.js';

    // Components
    import Filters from '$lib/components/filters.svelte';
    import Map from '$lib/components/dataviz/map.svelte';
    import Barchart from '$lib/components/dataviz/barchart.svelte';
    import Timeline from '$lib/components/timeline.svelte';
    import SwitchViews from '$lib/components/UI/switchViews.svelte';
    import Footer from '$lib/components/footer.svelte';

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

    // Dynamic retrieved from timeline
    let currentYearTimeline;
    let timelineClicked = false;
    export let timelineRunning = false;
    export let timelineSpeed = 500;

    // Dynamic retrieved from view buttons
    export let currentView = "map";

    // Dynamic retrieved from map
    export let zeroState = true;

    // Var to store data based on timeline selection
    export let timelineDataSelection;

    // exported var 
    export let uniqueLocations;
    export let totalDatapoints;

    // Format data files
    let formattedDataHalfModels = formatData(dataHalfModels, true);
    let formattedDataConstructions = formatData(dataConstructions);
    let formattedDataShipwrecksBatavia = formatDataBatavia(dataShipwreckBatavia);
    let formattedDataArcheology = formatDataSjoerd(dataArcheology);
    let formattedDataPanelPaintings = formatDataSjoerd(dataPanelPaintings);
    let formattedDataSculptures = formatDataSjoerd(dataSculptures);
    let formattedDataBuildings = formatDataSjoerd(dataBuildings);

    // Data variables
    let halfModels = formattedDataHalfModels;
    let constructions = formattedDataConstructions;
    let shipwrecksBatavia = formattedDataShipwrecksBatavia;
    let archeology = formattedDataArcheology;
    let panelPaintings = formattedDataPanelPaintings;
    let sculptures = formattedDataSculptures;
    let buildings = formattedDataBuildings;

    let dataSetsArtworks = [
        {
            name: "halfModels",
            data: halfModels,
        },
        {
            name: "sculptures",
            data: sculptures,
        },
        {
            name: "panelPaintings",
            data: panelPaintings,
        }
    ];

    let dataSetsConstructions = [
        {
            name: "constructions",
            data: constructions,
        },
        {
            name: "shipwrecksBatavia",
            data: shipwrecksBatavia,
        },
        {
            name: "archeology",
            data: archeology,
        },
        {
            name: "buildings",
            data: buildings,
        }
    ];

    let dataSetsAll = [
        {
            name: "artworks",
            data: dataSetsArtworks,
        },
        {
            name: "constructions",
            data: dataSetsConstructions,
        }
    ];

    totalDatapoints = countDataPoints(dataSetsAll);
    const totalConstructions = dataSetsConstructions.reduce((sum, ds) => sum + ds.data.length, 0);
    const totalArtworks = dataSetsArtworks.reduce((sum, ds) => sum + ds.data.length, 0);

    // Datasets filtered
    // Construction subsets
    export let keywordMap = {
        "Buildings": ['huis', 'kerk', 'kapel', 'souterrain'],
        "Shipwrecks": ['schip', 'schepen', 'ship', 'shipwreck', 'shipwrecks'],
        "Superimposed tiebeam": ['dekbalk'],
        "Truss legs": ['spant'],
        "Corbels": ['korbelen', 'korbeel'],
        "Churches": ['kerk', 'kapel'],
        "Houses": ['huis', 'woning']
    };

    const dataSetCache = {
        "Buildings": null,
        "Shipwrecks": null,
        "Superimposed tiebeam": null,
        "Truss legs": null,
        "Corbels": null,
        "Churches": null,
        "Houses": null
    };

    export let datapointsLength = [
        {
            name: "All",
            datapoints: totalDatapoints
        },
        {
            name: "Halfmodels",
            datapoints: halfModels.length
        },
        {
            name: "Sculptures",
            datapoints: sculptures.length
        },
        {
            name: "Panel paintings",
            datapoints:panelPaintings.length
        },
        {
            name: "Artworks",
            datapoints:totalArtworks
        },
        {
            name: "Buildings",
            datapoints: buildings.length + 8 + 13 + 6 + 25 + 15
        },
        {
            name: "Archeology",
            datapoints:archeology.length
        },
        {
            name: "Shipwrecks",
            datapoints:shipwrecksBatavia.length + 6
        },
        {
            name: "Batavia shipwreck",
            datapoints: shipwrecksBatavia.length
        },
        {
            name: "Non-specified building",
            datapoints: buildings.length
        },
        {
            name: "Non-specified shipwrecks",
            datapoints:6
        },
        {
            name: "Superimposed tiebeam",
            datapoints: 8
        },
        {
            name: "Truss legs",
            datapoints: 13
        },
        {
            name: "Corbels",
            datapoints: 6
        },
        {
            name: "Churches",
            datapoints: 25
        },
        {
            name: "Houses",
            datapoints: 15
        },
        {
            name: "Constructions",
            datapoints: totalConstructions
        },
    ];

    // Active data based on selected filters
    export let activeDataSets = dataSetsAll;

    // Get all unique provenances
    let uniqueProvenancesHalfModels = getUniqueValues(halfModels, 'provenance');
    let uniqueProvenancesConstructions = getUniqueValues(constructions, 'provenance');

    let allUniqueProvenances = [...new Set([
        ...uniqueProvenancesHalfModels,
        ...uniqueProvenancesConstructions
    ])].sort();

    // Get all felling dates 
    let fellingDatesHalfModels = getFellingDates(halfModels);
    
    // Get all unique locations (for constructions)
    uniqueLocations = getUniqueLocations([constructions, shipwrecksBatavia, archeology, buildings, sculptures, panelPaintings, halfModels]);

    const findAllKeysWithValue = (dataSetsConstructions, dataSetName, location, buildingKeywords) => {
        const filteredData = dataSetsConstructions.map(dataset => {
            const matchingItems = dataset.data.filter(item => {
                const lowerLocation = item.location.toLowerCase();

                return buildingKeywords.some(keyword => lowerLocation.includes(keyword));
            });

            return {
                name: dataSetName,
                data: matchingItems
            };
        }).filter(dataset => dataset.data.length > 0);

        return filteredData;
    }

    const filterDataOnSelection = () => {
        const findMore = () => {
            if (selectionPath[1] !== "Buildings") return;

            const buildingType = selectionPath[2]; // e.g., "Churches", "Houses"
            const keywords = keywordMap[selectedOption];

            if (!buildingType || !keywords) return;

            const buildingData = dataSetCache[buildingType];
            if (!buildingData) {
                console.warn(`No cached data for ${buildingType}`);
                return;
            }

            const dataSetName = `${selectedOption} in ${selectionPath[1]}`;
            const filtered = findAllKeysWithValue(buildingData, dataSetName, location, keywords);

            return filtered;
        };

        if (selectionPath[0] === "Artworks") {
            if (selectedOption === "Artworks") return dataSetsArtworks;

            if (selectedOption === "Halfmodels") {
                const set = dataSetsArtworks.find(set => set.name === "halfModels");
                return set ? [set] : [];
            } else if (selectedOption === "Panel paintings") {
                const set = dataSetsArtworks.find(set => set.name === "panelPaintings");
                return set ? [set] : [];
            } else if (selectedOption === "Sculptures") {
                const set = dataSetsArtworks.find(set => set.name === "sculptures");
                return set ? [set] : [];
            }

            return [];
        }

        if (selectionPath[0] === "Constructions") {
            if (selectedOption === "Constructions") return dataSetsConstructions;

            if (selectionPath[1] === "Shipwrecks") {
                const shipwrecksSet = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");

                if(selectedOption === "Shipwrecks" && keywordMap[selectedOption]) {
                    if (!dataSetCache[selectedOption]) {
                        const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap[selectedOption]);
                        dataSetCache[selectedOption] = filtered;
                    }
                    const filteredData = dataSetCache[selectedOption] || [];

                    // Combine buildingsSet data with filteredData, avoiding duplicates if needed
                    const combinedData = [];

                    if (shipwrecksSet) combinedData.push(shipwrecksSet);
                    combinedData.push(...filteredData);

                    return combinedData;
                } else if(selectedOption === "Batavia shipwreck") {
                    const set = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");
                    return set ? [set] : [];
                } else if (selectedOption === "Non-specified shipwrecks") {
                    if(!dataSetCache['Shipwrecks']) {
                        const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap['Shipwrecks']);
                        dataSetCache['Shipwrecks'] = filtered;
                    }
                    const filteredData = dataSetCache['Shipwrecks'] || [];
                    return filteredData;
                }
                // if (selectedOption === "Shipwrecks" || selectedOption === "Batavia shipwreck") {
                //     const set = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");
                //     return set ? [set] : [];
                // }
            } else if (selectionPath[1] === "Archeology") {
                const set = dataSetsConstructions.find(set => set.name === "archeology");
                return set ? [set] : [];
            } else if (selectionPath[1] === "Buildings") {
                const buildingsSet = dataSetsConstructions.find(set => set.name === "buildings");

                if (selectedOption === "Buildings" && keywordMap[selectedOption]) {
                    if (!dataSetCache[selectedOption]) {
                        const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap[selectedOption]);
                        dataSetCache[selectedOption] = filtered;
                    }
                    const filteredData = dataSetCache[selectedOption] || [];

                    // Combine buildingsSet data with filteredData, avoiding duplicates if needed
                    const combinedData = [];

                    if (buildingsSet) combinedData.push(buildingsSet);
                    combinedData.push(...filteredData);

                    return combinedData;
                }

                // filter churches en houses, superimposed tiebeam etc.
                if (selectedOption !== "Buildings") {
                    if (keywordMap[selectedOption]) {
                        if (!dataSetCache[selectedOption]) {
                            const filtered = findAllKeysWithValue(dataSetsConstructions, selectedOption, location, keywordMap[selectedOption]);
                            dataSetCache[selectedOption] = filtered;
                        }
                        const more = findMore();
                        if (more) {
                            return more;
                        }
                        return dataSetCache[selectedOption];
                    }
                }

                // fallback: just return buildingsSet if no keywordMap or selectedOption doesn't match
                return buildingsSet ? [buildingsSet] : [];
            }
            return [];
        }

        if(selectedOption === "All" || selectedOption === null) {
            return dataSetsAll;

        }

        return [];
    };

    const getYear = (fellingDate) => {
        if (!fellingDate) return null;

        if (typeof fellingDate === 'number') {
            return fellingDate;
        }

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

        // Fallback
        return null;
    };


    const filterDataOnTimeline = () => {
        timelineDataSelection = [];

        if (selectionPath[0] == null && selectedOption === 'All') {
            activeDataSets.forEach(purpose => {
                if (!Array.isArray(purpose.data)) return;

                const filteredGroups = [];

                purpose.data.forEach(group => {
                    if (!Array.isArray(group.data)) return;

                    const matchingItems = group.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);

                    if (matchingItems.length > 0) {
                        filteredGroups.push({
                            name: group.name,
                            data: matchingItems
                        });
                    }
                });

                if (filteredGroups.length > 0) {
                    timelineDataSelection.push({
                        name: purpose.name,
                        data: filteredGroups
                    });
                }
            });
        } else {
            activeDataSets.forEach(dataSet => {
                if (!Array.isArray(dataSet.data)) return;

                const matchingItems = dataSet.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);

                if (matchingItems.length > 0) {
                    timelineDataSelection.push({
                        name: dataSet.name,
                        data: matchingItems
                    });
                }
            });
        }
    };


    onMount(async () => {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });

    // on change, find right dataset
    $: if(selectionPath) {
        activeDataSets = filterDataOnSelection();
    }

    $: if(currentYearTimeline) {
        filterDataOnTimeline();
    }

    $: if (currentView) {
        console.log("current view changes in parent", currentView);
    }
</script>