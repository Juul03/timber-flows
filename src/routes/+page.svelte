<h1 class="text-primary d-none">Timber Flows</h1>

<Filters 
    {dataWoodPurposes} 
    bind:selectedWoodPurpose 
    bind:selectedType 
    bind:selectedSubType 
/>
<!-- <p>Selected purpose: {selectedWoodPurpose} {selectedType} {selectedSubType}</p> -->

<!-- <div class="container pb-3">
    <div class="row">
        <div class="col">
            <img class="w-100" src="src/assets/img/timeline.png" alt="timeline">
        </div>
    </div>
</div> -->

<Timeline {activeDataSets} 
    bind:currentYearTimeline
/>

<Map {activeDataSets}
    {timelineDataSelection}
/>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import '../assets/styles/app.scss';

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
            console.log("match", match[0]);
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
</script>