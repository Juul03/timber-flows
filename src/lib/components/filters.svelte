<div class="offcanvas offcanvas-start show bg-transparent border-0 p-2" tabindex="-1" id="offcanvasFilters" aria-labelledby="offcanvasExampleLabel">
    <div class="row gap-2">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <p class="fs-5 m-0">Find or select timber purpose</p>
            <button class="btn border-0 bg-transparent d-flex flex-row flex-wrap align-items-center justify-content-center gap-1">
                <span class="small m-0">Clear filters</span>
                <svg class="svg-icon-small fs-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
        </div>
        <div class="col-12 mb-4">
            <Searchbar/>
        </div>
        <div class="col-12 d-flex flex-wrap gap-2 align-items-center">
            <button 
                class="badge rounded-pill text-dark bg-blur border-0 {selectionPath.length === 0 ? 'fw-bold' : 'fw-normal'}"
                on:click={() => {
                    selectionPath = [];
                    selectedOption = 'All';
                }}
            >
                All
            </button>
        
            {#each selectionPath as label, index}
                <svg class="svg-icon-mini" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                </svg>
                <button 
                    class={`badge rounded-pill text-dark border-0 ${index === 0 ? `bg-blur-${selectionPath[0].toLowerCase()}` : 'bg-blur'} ${index === selectionPath.length - 1 ? 'fw-bold' : 'fw-normal'}`}
                    on:click={() => {
                        selectionPath = selectionPath.slice(0, index + 1);
                        selectedOption = `${selectionPath[selectionPath.length - 1]}`;
                    }}
                >
                    {label}
                </button>
            {/each}
        </div>        
        <div class="col-12">
            <p class="m-0 text-end small">
                157 results
            </p>
            <div id="woodPurposeFilter" class="bg-blur rounded p-3">
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="woodPurpose"
                        id="all"
                        value={getCurrentLabel()}
                        bind:group={selectedOption}
                        on:click={() => handleSelect(null)}
                    />
                    <label class="form-check-label d-flex justify-content-between w-100 {selectedOption === getCurrentLabel() ? 'fw-bold' : 'fw-normal'}" for="all">
                        {getCurrentLabel()}
                        <span class="small text-light">
                            157
                        </span>
                    </label>
                </div>
                {#each getCurrentOptions(filtersObject, selectionPath) as option}
                    <div class="form-check ms-2">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="woodPurpose"
                            id={option}
                            value={option}
                            on:click={() => handleSelect(option)}
                        />
                        <label 
                            class="form-check-label d-flex justify-content-between w-100 {selectedOption === option ? 'fw-bold' : 'fw-normal'}"
                            style={selectedOption == "All" ? `color: ${colorScale(option.toLowerCase())} !important` : ""} 
                            for={option}
                        >
                            {option}
                            <span class="small text-light">
                                120
                            </span>
                        </label>
                    </div>
                {/each}
            </div>
        </div>
        <div id="selectLocation" class="col-12">
            <div class="dropdown bg-blur {dropdownOpen ? 'rounded-top' : 'rounded'}">
                <button 
                    class="form-select text-start border-0 d-flex justify-content-between align-items-center" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="false"
                    aria-expanded="false"
                    on:click={toggleDropdown}
                >
                  Select locations
                  <span class="small text-light">
                    {uniqueLocations.length}
                  </span>
                </button>
                <ul class="dropdown-menu checkbox-list bg-blur rounded-bottom border-0 w-100 p-3">
                    <div class="d-flex flex-column">
                        <li class="mb-2 sticky-top z-1">
                            <Searchbar 
                                searchId="searchLocations"
                                searchDataObject={uniqueLocations}
                                bind:filteredObjects
                            />
                        </li>
                        {#each uniqueLocations as location}
                            <li 
                                class="
                                {(filteredObjects && filteredObjects.includes(location)) ? "" : "d-none"}
                                {selectedLocations.includes(location) ? '' : 'order-1'}
                                ">
                                <div class="form-check">
                                    <input 
                                        class="form-check-input" 
                                        type="checkbox" 
                                        value="{location}" 
                                        id="{location}"
                                        on:change={handleCheckboxChange}
                                        checked={selectedLocations.includes(location)}
                                    >
                                    <label class="w-100 form-check-label" for="{location}">
                                        {location}
                                    </label>
                                </div>
                            </li>
                        {/each}
                        {#if filteredObjects.length === 0}
                            <li>Sorry, no matching location available</li>
                        {/if}
                    </div>
                </ul>
            </div>          
        </div>
    </div>
    <div class="position-absolute bottom-0 mb-2">
        <MapLayers
            bind:selectedMapType
        />
    </div>
</div>

<script>
    import { colorScale, subtypeMap } from '$lib/scripts/colorConfig';

    const subtype = "Churches";
    const objectType = subtypeMap[subtype];
    const color = colorScale(objectType);
    console.log("color in subn", color);

    import Searchbar from '$lib/components/inputs/searchbar.svelte';
    import MapLayers from '$lib/components/mapLayers.svelte';

    // filters wood purpose
    import { filtersObject } from '$lib/data/filtersWoodPurpose.js';

    // Imported var from parent
    export let dataWoodPurposes = [];
    export let uniqueLocations

    // Imported var from searchbar
    export let filteredObjects;

    // Imported var from mapLayers
    export let selectedMapType = 'area';
    $: if(selectedMapType) {
        console.log("selected map type in filters", selectedMapType);
    }
    
    // export var from this component to parent
    export let selectionPath = [];
    export let selectedOption = 'All';

    // Var from this component
    let dropdownOpen = false;
    let selectedLocations = [];

    let toggleDropdown = () => {
        dropdownOpen = !dropdownOpen;
    }

    const handleCheckboxChange = (event) => {
        const location = event.target.value;
        if (event.target.checked) {
            if (!selectedLocations.includes(location)) {
                selectedLocations = [...selectedLocations, location];
            }
        } else {
            selectedLocations = selectedLocations.filter(l => l !== location);
        }
    }

    const getCurrentOptions = (tree, path) => {
        let node = tree;
        for (let key of path) {
            if (node && typeof node === "object") {
                node = node[key];
            }
        }
        return node && typeof node === "object" ? Object.keys(node) : [];
    }

    const getCurrentLabel = () => {
        if (selectionPath.length === 0) return 'All';
        return `${selectionPath[selectionPath.length - 1]}`;
    }

    const handleSelect = (option) => {
        if (option === null) {
            selectionPath = [];
            selectedOption = getCurrentLabel();
        } else {
            selectionPath = [...selectionPath, option];
            selectedOption = getCurrentLabel();
        }
    }

    $: sortedLocations = [...uniqueLocations]
        .sort((a, b) => {
            const aSelected = selectedLocations.includes(a);
            const bSelected = selectedLocations.includes(b);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.localeCompare(b); // Alphabetical fallback
        });
</script>