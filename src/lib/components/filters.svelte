<div class="container">
    <div class="row">
        <div class="col">
            <h2>Filters</h2>
        </div>
        <div class="col-2">
            <select class="form-select">
                <option value="">All purposes</option>
                {#each woodPurposes as purpose}
                    <option value={purpose}>{purpose}</option>
                {/each}
            </select>
        </div>
    </div>
</div>

<script>
    export let woodPurposes = [];
</script>