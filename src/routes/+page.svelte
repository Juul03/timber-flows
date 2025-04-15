<h1 class="text-primary d-none">Timber Flows</h1>

<Filters 
    {dataWoodPurposes} 
    bind:selectedWoodPurpose 
    bind:selectedType 
    bind:selectedSubType 
/>
<p>Selected purpose: {selectedWoodPurpose} {selectedType} {selectedSubType}</p>

<DatavizTest {activeDataSets}/>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import '../assets/styles/app.scss';

    // Data files
    import dataWoodPurposes from '$lib/data/woodPurposes.json';
    import dataHalfModels from '$lib/data/artworks/half-models.json';
    import dataConstructions from '$lib/data/constructions/constructions.json';

    // Scripts
    import { formatData, getUniqueValues, getFellingDates } from '$lib/scripts/formatData.js';

    // Components
    import Filters from '$lib/components/filters.svelte';
    import DatavizTest from '$lib/components/dataviz/test.svelte';

    // Variables
    // Dynamic var retrieved from filters
    let selectedWoodPurpose = "all";
    let selectedType = "all";
    let selectedSubType = "all";

    // Format data files
    let formattedDataHalfModels = formatData(dataHalfModels);
    let formattedDataConstructions = formatData(dataConstructions)

    // Data variables
    let halfModels = formattedDataHalfModels;
    let constructions = formattedDataConstructions;

    let dataSetsArtworks = [halfModels];
    let dataSetsConstructions = [constructions];
    let dataSetsAll = [dataSetsArtworks, dataSetsConstructions];

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


</script>