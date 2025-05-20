<form class="" on:submit|preventDefault>
    <div class="form-group position-relative">
        <input 
            id={searchId} 
            type="search"
            class="form-control bg-blur border-0 rounded-pill pe-5 ps-3 text-truncate" 
            placeholder="Search"
            bind:value={searchTerm}
            on:input={inputChange}
        >
        <div class="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent">
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
        </div>
    </div> 
</form>

<script>
    export let searchId;
    export let searchDataObject;
    export let filteredObjects;
    export let searchTerm = '';

    const inputChange = (event) => {
        searchTerm = event.target.value.toLowerCase();
    };

    $: if (searchTerm === '') {
        // If search input is empty, show all locations
        filteredObjects = [];
        for (const location of searchDataObject) {
            filteredObjects.push(location);
        }
    } else {
        // Otherwise, show only matching locations
        filteredObjects = [];
        for (const location of searchDataObject) {
            if (location.toLowerCase().includes(searchTerm)) {
                filteredObjects.push(location);
            }
        }
    }
</script>
