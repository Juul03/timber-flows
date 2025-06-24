<div class="offcanvas offcanvas-start show bg-transparent border-0 p-2" tabindex="-1" id="offcanvasFilters" aria-labelledby="offcanvasExampleLabel">
    <div class="row gap-2">
        <div class="col-12 d-flex justify-content-between flex-wrap align-items-center">
            <p class="fs-5 m-0">Find or select timber purpose</p>
            <button class="btn border-0 bg-transparent d-flex flex-row flex-wrap align-items-center justify-content-center gap-1" on:click={ () => clearFilters() }>
                <span class="small m-0">Clear filters</span>
                <svg class="svg-icon-small fs-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
        </div>
        <div class="col-12 mb-4">
            <!-- <Searchbar/> -->
             <div class="form-group position-relative">
                <input 
                    id="searchAll"
                    type="search"
                    class="form-control bg-blur border-0 rounded-pill pe-5 ps-3 text-truncate" 
                    placeholder="Search"
                >
                <div class="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent">
                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </div>
            </div> 
        </div>
        <div class="col-12 d-flex flex-wrap gap-2 align-items-center">
            <button 
                class="badge rounded-pill bg-blur border-0 {selectionPath?.length === 0 ? 'fw-bold' : 'fw-normal'}"
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
                    class={`badge rounded-pill border-0 ${index === 0 ? `bg-blur-${selectionPath[0].toLowerCase()}` : 'bg-blur'} ${index === selectionPath?.length - 1 ? 'fw-bold' : 'fw-normal'}`}
                    on:click={() => {
                        selectionPath = selectionPath.slice(0, index + 1);
                        selectedOption = `${selectionPath[selectionPath?.length - 1]}`;
                    }}
                >
                    {label}
                </button>
            {/each}
        </div>        
        <div class="col-12">
            <p class="m-0 text-end small">
                {totalDatapoints} results
            </p>
            <div id="woodPurposeFilter" class="d-flex flex-column justify-content-between bg-blur rounded p-3">
                <div>
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="all"
                            checked={selectedOptions.length === Object.keys(filtersObject).length}
                            on:change={() => {
                                if (selectedOptions.length === Object.keys(filtersObject).length) {
                                    selectedOptions = [];
                                } else {
                                    selectedOptions = Object.keys(filtersObject);
                                }
                            }}
                        />
                        <label class="form-check-label" for="all">
                            All
                        </label>
                    </div>
                    {#each Object.keys(filtersObject) as category}
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id={category}
                                value={category}
                                checked={selectedOptions.includes(category)}
                                on:change={() => {
                                    if (selectedOptions.includes(category)) {
                                        selectedOptions = selectedOptions.filter(opt => opt !== category);
                                    } else {
                                        selectedOptions = [...selectedOptions, category];
                                    }
                                }}
                            />
                            <!-- TODO: {selectedOptions.contains(category) ? 'fw-bold' : 'fw-normal'} -->
                            <label 
                                class="form-check-label d-flex justify-content-between w-100" 
                                style="color: {colorScale(toCamelCase(category))}"
                                for={category}
                                >
                                {category}
                                <span class="small text-light">
                                    {findDataPointsAmount(category)}
                                </span>
                            </label>
                        </div>
                    {/each}
                    <!-- <div class="form-check">
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
                                {findDataPointsAmount(selectedOption)}
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
                                    {findDataPointsAmount(option)}
                                </span>
                            </label>
                        </div>
                    {/each} -->
                </div>
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
                    {uniqueLocations?.length}
                  </span>
                </button>
                {#if uniqueLocations && Array.isArray(uniqueLocations)}
                <ul class="dropdown-menu checkbox-list bg-blur rounded-bottom border-0 w-100 p-3">
                    <div class="d-flex flex-column">
                        <li class="mb-2 sticky-top z-1">
                            <Searchbar 
                                searchId="searchLocations"
                                searchDataObject={uniqueLocations}
                                bind:filteredObjects
                                bind:searchTerm
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
                                    <label class="w-100 form-check-label d-flex justify-content-between" for="{location}">
                                        {location}
                                        <span class="small text-light">
                                            {countDatapointsForLocation(location)}
                                        </span>
                                    </label>
                                </div>
                            </li>
                        {/each}
                        {#if filteredObjects?.length === 0}
                            <li>Sorry, no matching location available</li>
                        {/if}
                    </div>
                </ul>
                {/if}
            </div>          
        </div>
    </div>
    <div class="position-absolute bottom-0 mb-2">
        <MapLayers
            bind:selectedMapType
            bind:selectedMapLayers
        />
    </div>
</div>

<script>
    import { onMount } from 'svelte';

    import { colorScale, subtypeMap } from '$lib/scripts/colorConfig';

    const subtype = "Churches";
    const objectType = subtypeMap[subtype];
    const color = colorScale(objectType);

    import Searchbar from '$lib/components/inputs/searchbar.svelte';
    import MapLayers from '$lib/components/mapLayers.svelte';

    // filters wood purpose
    import { filtersObject } from '$lib/data/filtersWoodPurpose.js';

    // Imported var from parent
    export let uniqueLocations;
    export let totalDatapoints;
    export let datapointsLength;
    export let activeDataSets;

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
    export let selectedOptions = [];
    export let selectedMapLayers = [];

    // export from searchbar
    export let searchTerm = '';

    // Var from this component
    let dropdownOpen = false;
    let fullscreenFilters = false;
    export let selectedLocations = [];

    let filterCategories = Object.keys(filtersObject);

    let toggleDropdown = () => {
        dropdownOpen = !dropdownOpen;
    }

    let toggleFiltersFullscreen = () => {
        fullscreenFilters = !fullscreenFilters;
    }

    let clearFilters = () => {
        selectionPath = [];
        selectedOption = 'All';
        selectedLocations = [];
        // TODO:clear main searchbar
    }
    function getOptionsArray(tree, path = []) {
    let node = tree;
    for (let key of path) {
        if (node && typeof node === "object") {
            node = node[key];
        }
    }
    // Return array of [option, children] pairs for use in {#each}
    return node && typeof node === "object"
        ? Object.entries(node)
        : [];
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

        searchTerm = '';
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
            // Go up one level in the filter path
            if (selectionPath.length > 0) {
                selectionPath = selectionPath.slice(0, -1);
                selectedOption = getCurrentLabel();
            } else {
                // At root, just reset to 'All'
                selectedOption = 'All';
            }
        } else {
            selectionPath = [...selectionPath, option];
            selectedOption = getCurrentLabel();
        }
    };

    const findPathToOption = (tree, target, path = []) => {
        for (const key in tree) {
            if (key === target) {
                return [...path, key];
            }
            if (tree[key] && typeof tree[key] === "object") {
                const result = findPathToOption(tree[key], target, [...path, key]);
                if (result) return result;
            }
        }
        return null;
    }

    const handleSelectFilterFull = (option) => {
        if (!option) {
            selectedOption = 'All';
            selectionPath = [];
            return;
        }
        const path = findPathToOption(filtersObject, option);
        if (path) {
            selectedOption = option;
            selectionPath = path;
        }
    }

    const findDataPointsAmount = (option) => {
        if(datapointsLength) {
            const data = datapointsLength.find(data => data.name === option);
            return data ? data.datapoints : 0;
        }
      
    };

    const toCamelCase = (str) => {
        console.log("camelcase", str);
        const string = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
        console.log("string camelcase", string);
        return string;
    }

    const countDatapointsForLocation = (location) => {
        let count = 0;
        if (!activeDataSets) return count;

        activeDataSets.forEach(firstLevel => {
            if (Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if (secondLevel && Array.isArray(secondLevel.data)) {
                        // Nested data
                        secondLevel.data.forEach(item => {
                            if (
                                item.location &&
                                item.location.toLowerCase().includes(location.toLowerCase())
                            ) {
                                count++;
                            }
                        });
                    } else if (secondLevel && secondLevel.location) {
                        // Single layer
                        if (
                            secondLevel.location.toLowerCase().includes(location.toLowerCase())
                        ) {
                            count++;
                        }
                    }
                });
            }
        });
        return count;
    }

    onMount(() => {
        selectedOptions = Object.keys(filtersObject);
        // selectedOptions = ['Constructions'];
    });

    $: sortedLocations = uniqueLocations && Array.isArray(uniqueLocations)
        ? [...uniqueLocations].sort((a, b) => {
            const aSelected = selectedLocations.includes(a);
            const bSelected = selectedLocations.includes(b);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.localeCompare(b); // Alphabetical fallback
        })
        : [];
</script>