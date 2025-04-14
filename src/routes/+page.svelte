<h1 class="text-primary">Timber Flows</h1>

<div>
<h2>Eerste Model:</h2>
    <p><strong>Provenance:</strong> {firstModel.provenance}</p>
</div>



<script>
    import 'bootstrap/dist/css/bootstrap.min.css';

    // Data files
    import dataHalfModels from '$lib/data/artworks/half-models.json';

    // Scripts
    import { formatData, getUniqueValues } from '$lib/scripts/formatData.js';

    // Components
    // import Filters from '$lib/components/filters.svelte';

    // Format data files
    let formattedDataHalfModels = formatData(dataHalfModels);
    let halfModels = formattedDataHalfModels;

    // Get all provenances
    let uniqueProvenances = getUniqueValues(halfModels, 'provenance');
    console.log(uniqueProvenances);
    console.log(halfModels);
  
    let firstModel = halfModels[0];
</script>
