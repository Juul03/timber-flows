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
                class="badge rounded-pill bg-blur border-0 {selectionPath.length === 0 ? 'fw-bold' : 'fw-normal'}"
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
                    class={`badge rounded-pill border-0 ${index === 0 ? `bg-blur-${selectionPath[0].toLowerCase()}` : 'bg-blur'} ${index === selectionPath.length - 1 ? 'fw-bold' : 'fw-normal'}`}
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
                {totalDatapoints} results
            </p>
            <div id="woodPurposeFilter" class="d-flex flex-column justify-content-between bg-blur rounded p-3">
                <div>
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
                    {/each}
                </div>
                <div>
                    <button class="w-100 text-end btn btn-link fw-bold pe-0" on:click = {toggleFiltersFullscreen}>
                        <span class="small">Show all filters</span>
                        <svg class="svg-icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM160 144c-13.3 0-24 10.7-24 24s10.7 24 24 24l94.1 0L119 327c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l135-135L288 328c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160c0-13.3-10.7-24-24-24l-152 0z"/>
                        </svg>
                    </button>
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
            bind:selectedMapLayers
        />
    </div>
    {#if fullscreenFilters}
        <div
            class="offcanvas show custom-offcanvas {selectedMapType == 'dark' ? 'bg-dark' : 'bg-blur'} rounded border-0 p-4"
            tabindex="-1"
            id="offcanvasFullscreenFilters"
            aria-labelledby="offcanvasFullscreenFiltersLabel"
     >
            <button 
                class="btn btn-link fw-bold position-absolute top-0 end-0 mt-2 me-2 z-2"
                style="z-index: 1051;"
                on:click={toggleFiltersFullscreen}
                aria-label="Close filters"
            >
                <span class="small">Close filters</span>
                <svg class="svg-icon-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
            <div class="row h-100">
                <div class="col-12">
                    <h3>Filters</h3>
                </div>
                {#each filterCategories as category}
                    <div class="col h-90 rounded">
                        <div class="d-flex justify-content-between position-sticky top-0 z-3 bg-blur pt-3 pb-2 px-3 rounded-top">
                            <h4 
                                class="mb-0" 
                                style={`color: ${colorScale(category.toLowerCase())} !important`}
                                >
                                {category}
                            </h4>
                            <span class="small text-light">
                                {findDataPointsAmount(category)}
                            </span>
                        </div>
                        <div class="bg-blur rounded-bottom p-3 h-90 overflow-auto">
                            {#each getOptionsArray(filtersObject, [category]) as [option, children]}
                                <div class="form-check ms-0">
                                    <input
                                        class="form-check-input" 
                                        type="radio" 
                                        name={category} 
                                        id={option} 
                                        value={option}
                                        checked={selectedOption === option}
                                        on:click={() => handleSelectFilterFull(option)}
                                    />
                                    <label
                                        class="form-check-label d-flex justify-content-between w-100 {selectedOption === option ? 'fw-bold' : 'fw-normal'}"
                                        for={option}>
                                        {option}
                                        <span class="small text-light">
                                            {findDataPointsAmount(option)}
                                        </span>
                                    </label>
                                </div>
                                {#if children && typeof children === 'object'}
                                    {#each Object.entries(children) as [subOption, subChildren]}
                                        <div class="form-check ms-2">
                                            <input
                                                class="form-check-input" 
                                                type="radio" 
                                                name={category} 
                                                id={subOption} 
                                                value={subOption}
                                                checked={selectedOption === subOption}
                                                on:click={() => handleSelectFilterFull(subOption)}
                                            />
                                            <label
                                                class="form-check-label d-flex justify-content-between w-100 {selectedOption === subOption ? 'fw-bold' : 'fw-normal'}" 
                                                for={subOption}
                                                >
                                                {subOption}
                                                <span class="small text-light">
                                                    {findDataPointsAmount(subOption)}
                                                </span>
                                            </label>
                                        </div>
                                        {#if subChildren && typeof subChildren === 'object'}
                                            {#each Object.entries(subChildren) as [subSubOption, _]}
                                                <div class="form-check ms-4">
                                                    <input
                                                        class="form-check-input" 
                                                        type="radio" 
                                                        name={category} 
                                                        id={subSubOption} 
                                                        value={subSubOption}
                                                        checked={selectedOption === subSubOption}
                                                        on:click={() => handleSelectFilterFull(subSubOption)}
                                                    />
                                                    <label
                                                        class="form-check-label d-flex justify-content-between w-100 {selectedOption === subSubOption ? 'fw-bold' : 'fw-normal'}" 
                                                        for={subSubOption}
                                                    >
                                                        {subSubOption}
                                                        <span class="small text-light">
                                                            {findDataPointsAmount(subSubOption)}
                                                        </span>
                                                    </label>
                                                </div>
                                            {/each}
                                        {/if}
                                    {/each}
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<script>
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
        // console.log("selected map type in filters", selectedMapType);
    }
    
    // export var from this component to parent
    export let selectionPath = [];
    export let selectedOption = 'All';
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
        const data = datapointsLength.find(data => data.name === option);
        return data ? data.datapoints : 0;
    };

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

    $: sortedLocations = [...uniqueLocations]
        .sort((a, b) => {
            const aSelected = selectedLocations.includes(a);
            const bSelected = selectedLocations.includes(b);

            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.localeCompare(b); // Alphabetical fallback
        });
</script>