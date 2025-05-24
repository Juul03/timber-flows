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
        />
        <div class="container position-relative z-3">
            <div class="position-absolute w-100 top-0">
                <Filters 
                    {dataWoodPurposes}
                    {uniqueLocations}
                    bind:selectedWoodPurpose 
                    bind:selectedType 
                    bind:selectedSubType
                    bind:selectionPath
                    bind:selectedOption
                    bind:selectedMapType
                />
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
                <h2>Compare</h2>
                <img class="w-100" src="/img/placeholder-barchart.png" alt="barchart placeholder img">
            </div>
        </div>
    </div>
    <div class="position-absolute bottom-0 start-50 translate-middle-x mb-2">
        <SwitchViews
            bind:currentView
        />
    </div>
</main>




<!-- <p>Selected purpose: {selectedWoodPurpose} {selectedType} {selectedSubType}</p> -->

<script>
    import '../assets/styles/app.scss';

    import { onMount } from 'svelte';

    // Data files (need to be an async function later)
    import dataWoodPurposes from '$lib/data/woodPurposes.json';
    import dataHalfModels from '$lib/data/artworks/half-models.json';
    import dataConstructions from '$lib/data/constructions/constructions.json';
    import dataShipwreckBatavia from '$lib/data/constructions/shipwreckBatavia.json';
    import dataArcheology from '$lib/data/constructions/archeology.json';
    import dataPanelPaintings from '$lib/data/artworks/panelPaintings.json';

    // Scripts
    import { formatData, formatDataBatavia, formatDataSjoerd, getUniqueValues, getFellingDates, getUniqueLocations } from '$lib/scripts/formatData.js';

    // Components
    import Filters from '$lib/components/filters.svelte';
    import Map from '$lib/components/dataviz/map.svelte';
    import Timeline from '$lib/components/timeline.svelte';
    import SwitchViews from '$lib/components/UI/switchViews.svelte';

    // Variables
    // Dynamic var retrieved from filters
    let selectedWoodPurpose = "all";
    let selectedType = "all";
    let selectedSubType = "all";

    let selectionPath = [];
    let selectedOption = 'All';

    export let selectedMapType = 'area';

    // Dynamic retrieved from timeline
    let currentYearTimeline;
    let timelineClicked = false;
    export let timelineRunning = false;
    export let timelineSpeed = 500;

    // Dynamic retrieved from view buttons
    export let currentView = "map";

    // Var to store data based on timeline selection
    export let timelineDataSelection;

    // exported var 
    export let uniqueLocations;

    // Format data files
    let formattedDataHalfModels = formatData(dataHalfModels, true);
    let formattedDataConstructions = formatData(dataConstructions);
    let formattedDataShipwrecksBatavia = formatDataBatavia(dataShipwreckBatavia);
    let formattedDataArcheology = formatDataSjoerd(dataArcheology);
    let formattedDataPanelPaintings = formatDataSjoerd(dataPanelPaintings);

    // Data variables
    let halfModels = formattedDataHalfModels;
    let constructions = formattedDataConstructions;
    let shipwrecksBatavia = formattedDataShipwrecksBatavia;
    let archeology = formattedDataArcheology;
    let panelPaintings = formattedDataPanelPaintings;

    let dataSetsArtworks = [
        {
            name: "halfModels",
            data: halfModels,
        },
        {
            name: "sculptures",
            data: null,
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

    // Datasets filtered
    // Construction subsets
    export let keywordMap = {
        "Buildings": ['huis', 'kerk', 'kapel', 'souterrain'],
        "Shipwrecks": ['schip', 'schepen', 'ship', 'shipwreck', 'shipwrecks'],
        "Deck beams": ['dekbalk'],
        "Truss legs": ['spant'],
        "Corbels": ['korbelen', 'korbeel'],
        "Churches": ['kerk', 'kapel'],
        "Houses": ['huis', 'woning']
    };
    const dataSetCache = {
        "Buildings": null,
        "Shipwrecks": null,
        "Deck beams": null,
        "Truss legs": null,
        "Corbels": null,
        "Churches": null,
        "Houses": null
    };

    // Active data based on selected filters
    let activeDataSets = [];

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
    uniqueLocations = getUniqueLocations([constructions, shipwrecksBatavia, archeology]);

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
            }

            if (selectedOption === "Panel paintings") {
                const set = dataSetsArtworks.find(set => set.name === "panelPaintings");
                return set ? [set] : [];
            }
        }

        if (selectionPath[0] === "Constructions") {
            if (selectedOption === "Constructions") return dataSetsConstructions;

            if (selectionPath[1] === "Shipwrecks") {
                if (selectedOption === "Shipwrecks") {
                    // all shipwreck datasets (for now only batavia)
                    const set = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");
                    return set ? [set] : [];
                } else if (selectedOption === "Batavia shipwreck") {
                    // only batavia shipwreck
                    const set = dataSetsConstructions.find(set => set.name === "shipwrecksBatavia");
                    return set ? [set] : [];
                }
            } else if (selectionPath[1] === "Archeology") {
                const set = dataSetsConstructions.find(set => set.name === "archeology");
                return set ? [set] : [];
            }

            // keyword filtering on construction data to ex. "deck beams"
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

        return dataSetsAll;
    };

    const getYear = (fellingDate) => {
        if (!fellingDate) return null;

        if (typeof fellingDate === "string") {
            const match = fellingDate.match(/\d{4}/);
            return match ? parseInt(match[0]) : null;
        }

        if (typeof fellingDate === "number") {
            return fellingDate;
        }

        return null;
    };

    const filterDataOnTimeline = () => {
        timelineDataSelection = [];

        if (selectionPath[0] == null && selectedOption === 'All') {
            // For each top-level group (like "artworks")
            activeDataSets.forEach(purpose => {
                if (!Array.isArray(purpose.data)) return;

                // Build filtered groups array
                const filteredGroups = [];

                // For each subgroup (like "halfModels", "sculptures")
                purpose.data.forEach(group => {
                    if (!Array.isArray(group.data)) return;

                    // Filter the deepest items by year
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
            // Not 'All' selection, simpler structure — top level with direct array of items (no groups)
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