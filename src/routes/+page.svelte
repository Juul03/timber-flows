<h1 class="text-primary d-none">Timber Flows</h1>

<Map {activeDataSets}
    {timelineDataSelection}
/>
<div class="container position-relative z-3">
    <div class="position-absolute w-100">
        <div class="row">
            <div class="col-3">
                <Test/>
            </div>
           

            <!-- <div id="filters-container" class="col-3 py-3 d-flex flex-column justify-content-between">
                <Filters 
                    {dataWoodPurposes} 
                    bind:selectedWoodPurpose 
                    bind:selectedType 
                    bind:selectedSubType 
                />
                <MapLayers/>
            </div>
            <div class="col-9 py-3">
                <Timeline 
                    {activeDataSets}
                    bind:currentYearTimeline
                />
            </div> -->
        </div>
    </div>
</div>

<!-- <p>Selected purpose: {selectedWoodPurpose} {selectedType} {selectedSubType}</p> -->

<script>
    import '../assets/styles/app.scss';

    import { onMount } from 'svelte';

    // Data files (need to be an async function later)
    import dataWoodPurposes from '$lib/data/woodPurposes.json';
    import dataHalfModels from '$lib/data/artworks/half-models.json';
    import dataConstructions from '$lib/data/constructions/constructions.json';

    // Scripts
    import { formatData, getUniqueValues, getFellingDates } from '$lib/scripts/formatData.js';

    // Components
    import Filters from '$lib/components/filters.svelte';
    import Map from '$lib/components/dataviz/map.svelte';
    import Timeline from '$lib/components/timeline.svelte';
    import MapLayers from '$lib/components/mapLayers.svelte';
    import Test from '$lib/components/test.svelte';

    // Variables
    // Dynamic var retrieved from filters
    let selectedWoodPurpose = "all";
    let selectedType = "all";
    let selectedSubType = "all";

    // Dynamic retrieved from timeline
    let currentYearTimeline;

    // Var to store data based on timeline selection
    export let timelineDataSelection;

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
        }];
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

    // Get all felling dates
    let fellingDatesHalfModels = getFellingDates(halfModels);

    // on change, find right dataset
    $: if(selectedWoodPurpose || selectedType || selectedSubType) {
        activeDataSets = filterDataOnSelection();
        console.log(activeDataSets);
    }

    $: if(currentYearTimeline) {
        filterDataOnTimeline();
    }

    const filterDataOnSelection = () => {
        console.log("Selected:", selectedWoodPurpose, selectedType, selectedSubType);

        if (selectedSubType !== "all") {
            console.log("Filtering by SubType:", selectedSubType);
        }

        if (selectedType !== "all") {
            console.log("Filtering by Type:", selectedType);
            if (selectedType === "Half models") {
                // return dataSetsArtworks
                return halfModels;
            }
        }

        if (selectedWoodPurpose !== "all") {
            console.log("Filtering by Purpose:", selectedWoodPurpose);
            if (selectedWoodPurpose === "Artworks") {
                // return dataSetsArtworks
                return dataSetsArtworks;
            }
            if (selectedWoodPurpose === "Constructions") {
                return dataSetsConstructions;
            }
            if (selectedWoodPurpose === "Furniture") {
                // no data yet
                return;
            }
        }

        console.log("Returning all data");
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

        if (selectedWoodPurpose !== "all") {
            // Not "all", filter directly
            activeDataSets.forEach(dataSet => {
                const matchingItems = dataSet.data.filter(item => getYear(item.fellingDate) === currentYearTimeline);
                timelineDataSelection.push(...matchingItems);

                if (matchingItems.length > 0) {
                    console.log(`✅ Matches from "${dataSet.name}" in year ${currentYearTimeline}:`, matchingItems);
                }
            });
        }

        if (selectedWoodPurpose === "all") {
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
        }

        console.log("📊 timelineDataSelection final:", timelineDataSelection);
    };

    onMount(async () => {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
    });
</script>