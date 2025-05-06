<h1 class="text-primary d-none">Timber Flows</h1>

<main>
    <Map {activeDataSets}
        {timelineDataSelection}
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
            />
            <div class="row justify-content-end">
                <div class="col-9">
                    <Timeline 
                        {activeDataSets}
                        bind:currentYearTimeline
                    />
                </div>
            </div>
        </div>
        <div class="position-absolute bottom-0 start-50 translate-middle-x mb-2">
            <SwitchViews
                bind:currentView
            />
        </div>
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

    // Scripts
    import { formatData, getUniqueValues, getFellingDates, getUniqueLocations } from '$lib/scripts/formatData.js';

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

    // Dynamic retrieved from timeline
    let currentYearTimeline;

    // Dynamic retrieved from view buttons
    export let currentView = "map";

    // Var to store data based on timeline selection
    export let timelineDataSelection;

    // exported var 
    export let uniqueLocations;

    // Format data files
    let formattedDataHalfModels = formatData(dataHalfModels);
    let formattedDataConstructions = formatData(dataConstructions)

    // Data variables
    let halfModels = formattedDataHalfModels;
    let constructions = formattedDataConstructions;

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
            data: null,
        }
    ];

    let dataSetsConstructions = [
        {
            name: "constructions",
            data: constructions,
        }];

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

    // Active data based on selected filters
    let activeDataSets = [];

    // Get all unique provenances
    let uniqueProvenancesHalfModels = getUniqueValues(halfModels, 'provenance');
    let uniqueProvenancesConstructions = getUniqueValues(constructions, 'provenance');

    let allUniqueProvenances = [...new Set([
        ...uniqueProvenancesHalfModels,
        ...uniqueProvenancesConstructions
    ])].sort();

    console.log("unique provenances", allUniqueProvenances);

    // Get all felling dates 
    let fellingDatesHalfModels = getFellingDates(halfModels);
    
    // Get all unique locations (for constructions)
    uniqueLocations = getUniqueLocations(constructions);

    // on change, find right dataset
    $: if(selectionPath) {
        activeDataSets = filterDataOnSelection();
    }

    $: if(currentYearTimeline) {
        filterDataOnTimeline();
    }

    const filterDataOnSelection = () => {
        if (selectionPath[0] === "Artworks") {
            if (selectedOption === "Artworks") {
                return dataSetsArtworks;
            } else if (selectedOption === "Halfmodels") {
                const selectedSet = dataSetsArtworks.find(set => set.name === "halfModels");
                return selectedSet ? [selectedSet] : [];
            }
        }

        if (selectionPath[0] === "Constructions") {
            if(selectedOption === "Constructions") {
                return dataSetsConstructions;
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
            // 'All', nested structure, filter with extra nesting
            activeDataSets.forEach(purposes => {
                purposes.data.forEach(group => {
                    if (Array.isArray(group.data)) {
                        const matchingItems = group.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);
                        timelineDataSelection.push(...matchingItems);

                        if (matchingItems.length > 0) {
                            console.log(`✅ Matches in group "${group.name}" of "${purposes.name}" for year ${currentYearTimeline}:`, matchingItems);
                        }
                    }
                });
            });
        } else {
            // Not "all", filter directly
            activeDataSets.forEach(dataSet => {
                const matchingItems = dataSet.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);
                timelineDataSelection.push(...matchingItems);

                if (matchingItems.length > 0) {
                    console.log(`✅ Matches from "${dataSet.name}" in year ${currentYearTimeline}:`, matchingItems);
                }
            });
        }
    };

    onMount(async () => {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });

    $: if (currentView) {
        console.log("current view changes in parent", currentView);
    }
</script>