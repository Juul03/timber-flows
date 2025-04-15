<div class="container py-3">
    <div class="row">
        <div class="col-4 d-flex gap-2 align-items-center">
            <p class="m-0 w-100">Select purpose:</p>
            <select class="form-select" on:change={handlePurposeChange} bind:value={selectedWoodPurpose}>
                <option value="all" selected>All</option>
                {#each woodPurposes as purpose}
                    <option value={purpose}>{purpose}</option>
                {/each}
            </select>
        </div>

        <div class="col-3">
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

        <div class="col-3">
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
        </div>
    </div>
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