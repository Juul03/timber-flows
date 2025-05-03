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
        <form class="" action="">
            <div class="form-group position-relative">
                <input type="text" class="form-control rounded-pill pe-5 ps-3 text-truncate" placeholder="Search">
                <button type="submit" class="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent">
                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </button>
            </div>            
        </form>
    </div>
    <div class="col-12">
        <span class="badge rounded-pill text-dark bg-primary">All</span>
    </div>
    <div class="col-12">
        <p class="m-0 text-end small">
            157 results
        </p>
        <div class="bg-blur rounded p-3">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" checked>
                <label class="form-check-label" for="radioDefault1">
                    Default radio
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2">
                <label class="form-check-label" for="radioDefault2">
                    Default checked radio
                </label>
            </div>
        </div>
    </div>
    <div class="col-12">
        <div class="dropdown">
            <button 
                class="form-select text-start" 
                type="button" 
                data-bs-toggle="dropdown"
                data-bs-auto-close="false"
                aria-expanded="false"
            >
              Select location
            </button>
            <ul class="dropdown-menu checkbox-list w-100 p-3">
                <li>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Aethionemoideae" id="aethionemoideae">
                        <label class="form-check-label" for="aethionemoideae">Aethionemoideae</label>
                    </div>
                </li>
                <li>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Brassicoideae" id="brassicoideae">
                        <label class="form-check-label" for="brassicoideae">Brassicoideae</label>
                    </div>
                </li>
                <li>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Brassicoideae" id="brassicoideae">
                        <label class="form-check-label" for="brassicoideae">Brassicoideae</label>
                    </div>
                </li>
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

<script>
    export let dataWoodPurposes = [];
    export let selectedWoodPurpose = "all";
    export let selectedType = "all";
    export let selectedSubType = "all";

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

<style>
    .checkbox-list {
        height: 20vh;
        overflow-y: auto;
    }
</style>