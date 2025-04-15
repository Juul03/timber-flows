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
    let halfModels = formattedDataHalfModels;

    // Get all provenances
    let uniqueProvenances = getUniqueValues(halfModels, 'provenance');

    // Get all felling dates
    let fellingDatesHalfModels = getFellingDates(halfModels);
    console.log(fellingDatesHalfModels);
  
    let firstModel = halfModels[0];

    // Log the selected value
    console.log("Selected Wood Purpose: ", selectedWoodPurpose, selectedType, selectedSubType);
</script>