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
        <div class="col-12">
            <Searchbar/>
        </div>
        <div class="col-12">
            <span class="badge rounded-pill text-dark bg-blur { selectedWoodPurpose == 'all' ? 'fw-bold' : 'fw-normal' }">All</span>
            {#if selectedWoodPurpose && selectedWoodPurpose !== 'all'}
            <svg class="svg-icon-mini" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
            </svg>
                <span class="badge rounded-pill text-dark bg-blur fw-bold">{selectedWoodPurpose}</span>
            {/if}
        </div>
        <div class="col-12">
            <p class="m-0 text-end small">
                157 results
            </p>
            <div class="bg-blur rounded p-3">
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="radio"
                        name="woodPurpose"
                        id="all"
                        value="all"
                        bind:group={selectedWoodPurpose}
                    />
                    <label class="form-check-label w-100" for="all">All</label>
                </div>
                {#each woodPurposes as purpose}
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="woodPurpose"
                            id={purpose}
                            value={purpose}
                            bind:group={selectedWoodPurpose}
                        />
                        <label class="form-check-label w-100" for={purpose}>{purpose}</label>
                    </div>
                {/each}
            </div>
        </div>
        <div id="selectLocation" class="col-12">
            <div class="dropdown bg-blur {dropdownOpen ? 'rounded-top' : 'rounded'}">
                <button 
                    class="form-select text-start border-0" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="false"
                    aria-expanded="false"
                    on:click={toggleDropdown}
                >
                  Select locations
                </button>
                <ul class="dropdown-menu checkbox-list bg-blur rounded-bottom border-0 w-100 p-3">
                    <li class="mb-2 sticky-top z-1">
                        <Searchbar/>
                    </li>
                    {#each uniqueLocations as location}
                        <li>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="{location}" id="{location}">
                                <label class="w-100 form-check-label" for="{location}">{location}</label>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>          
        </div>      
        <!-- <div class="col-12 d-flex gap-2 align-items-center">
            <p class="m-0 w-100">Select purpose:</p>
            <select class="form-select" on:change={handlePurposeChange} bind:value={selectedWoodPurpose}>
                <option value="all" selected>All</option>
                {#each woodPurposes as purpose}
                    <option value={purpose}>{purpose}</option>
                {/each}
            </select>
        </div>
    
        <div class="col-12">
            <select class="form-select" on:change={handleTypeChange} bind:value={selectedType}>
                {#if getTypes(selectedWoodPurpose).length === 0}
                    <option value="all" selected disabled>No objecttypes available</option>
                {:else}
                <option value="all" selected>Select objecttype</option>
                {/if}
                {#each getTypes(selectedWoodPurpose) as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>        
        </div>
    
        <div class="col-12">
            <select class="form-select" on:change={handleSubTypeChange} bind:value={selectedSubType}>
                {#if getSubTypes(selectedWoodPurpose, selectedType).length === 0}
                    <option value="all" selected disabled>No subtypes available</option>
                {:else}
                    <option value="all" selected>Select subtypes</option>
                {/if}
                {#each getSubTypes(selectedWoodPurpose, selectedType) as subType}
                    <option value={subType}>{subType}</option>
                {/each}
            </select>
        </div> -->
    </div>
    <div class="position-absolute bottom-0 mb-2">
        <MapLayers/>
    </div>
</div>

<script>
    import Searchbar from '$lib/components/inputs/searchbar.svelte';
    import MapLayers from '$lib/components/mapLayers.svelte';

    export let dataWoodPurposes = [];
    export let selectedWoodPurpose = "all";
    export let selectedType = "all";
    export let selectedSubType = "all";
    export let uniqueLocations;
    let dropdownOpen = false;

    let toggleDropdown = () => {
        dropdownOpen = !dropdownOpen;
    }

    // scope variables
    const woodPurposes = Object.keys(dataWoodPurposes).sort();

    // Get types based on selected purpose
    const getTypes = (purpose) => {
        if (purpose === "all") {
            return Object.values(dataWoodPurposes)
                .flatMap(p => p.types)
                .filter(type => type)
                .sort();
        }
        return dataWoodPurposes[purpose]?.types?.sort() || [];
    };

    // Get Subtypes based on selected type
    const getSubTypes = (purpose, type) => {
        if (purpose === "all") {
            return Object.values(dataWoodPurposes)
                .flatMap(p => Object.values(p.subTypes).flat())
                .filter(sub => sub)
                .sort();
        }

        if (type === "all") {
            return Object.entries(dataWoodPurposes[purpose]?.subTypes || {})
                .flatMap(([_, subs]) => subs)
                .filter(sub => sub)
                .sort();
        }

        return dataWoodPurposes[purpose]?.subTypes[type]?.sort() || [];
    };

    // Find purpose by selected type
    const findPurposeByType = (type) => {
        for (const [purpose, data] of Object.entries(dataWoodPurposes)) {
            if (data.types.includes(type)) {
                return purpose;
            }
        }
        return "all";
    };

    const handlePurposeChange = (event) => {
        selectedWoodPurpose = event.target.value;
        selectedType = "all";
        selectedSubType = "all";
    }

    const handleTypeChange = (event) => {
        const type = event.target.value;
        selectedType = type;

        if (type !== "all") {
            const purpose = findPurposeByType(type);
            if (purpose !== selectedWoodPurpose) {
                selectedWoodPurpose = purpose;
            }
        }

        selectedSubType = "all";
    }

    const handleSubTypeChange = (event) => {
        const subType = event.target.value;
        selectedSubType = subType;

        if (subType === "all") {
            selectedType = "all";
            selectedWoodPurpose = "all";
            return;
        }

        // Find matching type and purpose for selected subtype
        for (const purpose of Object.keys(dataWoodPurposes)) {
            for (const type of Object.keys(dataWoodPurposes[purpose].subTypes)) {
                if (dataWoodPurposes[purpose].subTypes[type].includes(subType)) {
                    selectedWoodPurpose = purpose;
                    selectedType = type;
                    return;
                }
            }
        }
    }
</script>