<h1 class="text-primary d-none">Timber Flows</h1>

<Filters 
    {dataWoodPurposes} 
    bind:selectedWoodPurpose 
    bind:selectedType 
    bind:selectedSubType 
/>
<p>Selected purpose: {selectedWoodPurpose} {selectedType} {selectedSubType}</p>

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
    console.log(fellingDatesHalfModels);
  
    let firstModel = halfModels[0];

    // Log the selected value
    console.log("Selected Wood Purpose: ", selectedWoodPurpose, selectedType, selectedSubType);
</script>