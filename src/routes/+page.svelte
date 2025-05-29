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

<footer class="bg-blur py-3">
  <div class="container">
    <div class="row justify-content-center">
        <div class="col-8">
            <h2 class="text-primary">About</h2>
            <p class="text-primary">Explore the dataset of Woods for Goods project in an interactive datavisualisation.</p>
        </div>
        <div class="col-4">
            <h2 class="text-primary">Links</h2>
            <ul class="list-unstyled d-flex flex-column gap-2">
                <li>
                    <a class="text-decoration-none" href="https://www.linkedin.com/in/martadominguezdelmas/?originalSubdomain=nl" target="_blank" rel="noopener noreferrer">
                        <svg class="svg-icon svg-primary me-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                        </svg>
                        Marta Domínguez-Delmás
                    </a>
                </li>
                <li>
                    <a class="text-decoration-none" href="https://www.nwo.nl/en/projects/016veni195502" target="_blank" rel="noopener noreferrer">
                        <img class="svg-icon" src="/img/nwo_logo.svg" alt="nwo logo">
                        Woods for Goods
                    </a>
                </li>
                <li>
                    <a class="text-decoration-none" href="https://www.naturalis.nl/marta-dominguez-delmas" target="_blank" rel="noopener noreferrer">
                        <img class="svg-icon" src="/img/naturalis.jpg" alt="Naturalis logo">
                        Naturalis Biodiversity Center
                    </a>
                </li>
                <li>
                    <a class="text-decoration-none" href="https://nl.linkedin.com/in/julia-hoek-89ba2125a">
                        <svg class="svg-icon svg-primary me-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                        </svg>
                        Developed by Julia Hoek
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-8">
            <p class="small m-0 text-center">
                This website was created by Julia Hoek, February till June 2025. In collaboration with Marta Domínguez-Delmás.
                For technical issues, email
                <a href="mailto:juliahoek16@gmail.com">juliahoek16@gmail.com</a>.
                For questions about the project, email
                <a href="mailto:marta.dominguezdelmas@naturalis.nl">marta.dominguezdelmas@naturalis.nl</a>.
            </p>
        </div>
    </div>
  </div>
</footer>


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
    import dataSculptures from '$lib/data/artworks/sculptures.json';
    import dataBuildings from '$lib/data/constructions/buildings.json';

    // Scripts
    import { formatData, formatDataBatavia, formatDataSjoerd, getUniqueValues, getFellingDates, getUniqueLocations, countDataPoints, countFlatDataPoints } from '$lib/scripts/formatData.js';

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

    export let selectedLocations = [];
    export let previousSelectedLocations = [];

    export let selectedMapType = 'area';

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
    let activeDataSets = dataSetsAll;

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