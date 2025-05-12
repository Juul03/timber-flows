<div id="layers" class="row">
    <div class="col-12">
        <button 
            class="border-0 bg-blur d-flex align-items-center justify-content-start gap-2 p-2 {dropdownOpen ? 'rounded-bottom w-100' : 'rounded-pill'}" 
            aria-label="Open map layer selection"
            type="button" 
            data-bs-toggle="dropdown"
            data-bs-auto-close="false"
            aria-expanded="false"
            on:click={toggleDropdown}
        >
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
            </svg>
            {#if dropdownOpen}
                <span>Map Layers</span>
            {/if}
        </button>
        <div class="dropdown">
            <!-- ul with map layers above this -->
            <div
                id="mapLayers"
                class="dropdown-menu checkbox-list bg-blur border-0 w-100 p-3"
            >
                <div class="mb-2">
                    <h3 class="fs-6">Map types</h3>
                    {#each mapTypes as type}
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="maptypes"
                                id={type.name}
                                value={type.value}
                                on:click={() => updateMapType(type.value)}
                                checked={selectedMapType === type.value}
                            />
                            <label class="form-check-label w-100" for={type.name}>
                                {type.name}
                            </label>
                        </div>
                    {/each}
                </div>
                <div>
                    <h3 class="fs-6">Map layers</h3>
                    {#each mapLayers as type}
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="maplayers"
                                id={type.name}
                                value={type.value}
                            />
                            <label class="form-check-label w-100" for={type.name}>
                                {type.name}
                            </label>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Exported var
    export let selectedMapType = 'area';

	let dropdownOpen = false;

    let mapTypes = [
        {
            name:'Area map',
            value: 'area'
        },
        {
            name: 'Basemap (dark)',
            value: 'dark'
        }
    ];

    let mapLayers = [
        {
            name:'Rivers',
            value: 'rivers'
        },
        {
            name: 'Trade cities',
            value: 'cities'
        }
    ];

    let toggleDropdown = () => {
		dropdownOpen = !dropdownOpen;
	}

    let updateMapType = (value) => {
        selectedMapType = value;
    }
</script>