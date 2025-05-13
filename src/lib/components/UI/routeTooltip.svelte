<script>
    export let tooltipRouteContent;
    export let tooltipPosition;

    // Calculate tooltip position dynamically based on mouse location
    let adjustedPosition = { x: tooltipPosition.x, y: tooltipPosition.y };

    // code from previous project - disney incident matcher rep https://github.com/Juul03/ID-tech-track-23-24
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Adjust horizontal (left and right)
    if (tooltipPosition.x < screenWidth / 2) {
        adjustedPosition.x = tooltipPosition.x + 10;
    } else {
        adjustedPosition.x = tooltipPosition.x - 390;
    }

    // Adjust vertical position (top or bottom)
    if (tooltipPosition.y < screenHeight / 2) {
        adjustedPosition.y = tooltipPosition.y + 10;
    } else {
        adjustedPosition.y = tooltipPosition.y - 250;
    }
</script>

<div 
    id="tooltip-route" 
    class="position-absolute col-3 bg-white rounded p-3"
    style="left: {adjustedPosition.x}px; top: {adjustedPosition.y}px;"
>
    <div class="row">
        <div class="col-12 d-flex flex-wrap gap-2 align-items-center mb-2">
            {#if tooltipRouteContent.categoryPath && tooltipRouteContent.categoryPath.length}
                <div class="col-12 d-flex flex-wrap gap-2 align-items-center mb-2">
                    <button class="badge rounded-pill text-white bg-dark border-0 fw-normal">
                        All
                    </button>

                    {#each tooltipRouteContent.categoryPath as label, index}
                        <svg class="svg-icon-mini" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                        </svg>
                        <button
                            class={`badge rounded-pill border-0 fw-normal ${index === 0 ? `bg-blur-${label.toLowerCase()} text-dark` : 'bg-dark text-white '}`}
                        >
                            {label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="col-12 mb-2">
            <div class="d-flex justify-content-between flex-wrap align-items-center">
                <h3 class="m-0">{tooltipRouteContent.categoryPath[tooltipRouteContent.categoryPath.length - 1]}</h3>
                <p class="text-dark text-small m-0">{tooltipRouteContent.keyCode}</p>
            </div>
            <p class="text-light text-small">{tooltipRouteContent.location}</p>
        </div>
        <div class="col-4 mb-2">
            <p class="text-light d-flex flex-column m-0">
                Startyear
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.startYear}</span>
            </p>
        </div>
        <div class="col-4 mb-2">
            <p class="text-light d-flex flex-column m-0">
                Endyear
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.endYear}</span>
            </p>
        </div>
        <div class="col-4 mb-2">
            <p class="text-light d-flex flex-column m-0">
                Length
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.length}</span>
            </p>
        </div>
        <div class="col-4">
            <p class="text-light d-flex flex-column m-0">
                Fellingdate
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.fellingDate}</span>
            </p>
        </div>
        <div class="col-4">
            <p class="text-light d-flex flex-column m-0">
                TBP
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.TBP}</span>
            </p>
        </div>
        <div class="col-4">
            <p class="text-light d-flex flex-column m-0">
                Provenance
                <span class="fs-5 text-dark mt-n1 text-wrap">{tooltipRouteContent.provenance}</span>
            </p>
        </div>
    </div>
</div>