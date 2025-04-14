<div class="container">
    <div class="row">
        <div class="col-4 d-flex gap-2 align-items-center">
            <p class="m-0 w-100">Select purpose:</p>
            <select class="form-select" bind:value={selectedWoodPurpose}>
                <option value="all" selected>All</option>
                {#each woodPurposes as purpose}
                    <option value={purpose}>{purpose}</option>
                {/each}
            </select>
        </div>

        {#if selectedWoodPurpose !== "all"}
            <div class="col-3">
                <select class="form-select" bind:value={selectedType}>
                    <option value="all" selected>All</option>
                    {#each getTypes(selectedWoodPurpose) as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </div>
        {/if}

        {#if selectedWoodPurpose !== "all" && selectedType !== "all"}
            <div class="col-3">
                <select class="form-select" bind:value={selectedSubType}>
                    <option value="all" selected>All</option>
                    {#each getSubTypes(selectedWoodPurpose, selectedType) as subType}
                        <option value={subType}>{subType}</option>
                    {/each}
                </select>
            </div>
        {/if}
    </div>
</div>

<script>
    export let dataWoodPurposes = [];
    export let selectedWoodPurpose = "all";
    export let selectedType = "all";
    export let selectedSubType = "all";

    const woodPurposes = Object.keys(dataWoodPurposes);

    // Get types based on selected purpose
    const getTypes = (purpose) => {
        if(purpose != "all") {
            return dataWoodPurposes[purpose]?.types || [];
        }
        return [];
    };

    // Get Subtypes based on selected type
    const getSubTypes = (purpose, type) => {
        if (purpose !== "all" && type !== "all") {
            return dataWoodPurposes[purpose]?.subTypes[type] || [];
        }
        return [];
    };
</script>