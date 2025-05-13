<script>
    export let tooltipRouteContent;
    export let tooltipPosition;

    // Calculate tooltip position dynamically based on mouse location
    let adjustedPosition = { x: tooltipPosition.x, y: tooltipPosition.y };

    // code from previous project - disney incident matcher rep https://github.com/Juul03/ID-tech-track-23-24
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (tooltipPosition.x < screenWidth / 2) {
        // If mouse is on the left half, position tooltip on the right side of the cursor
        adjustedPosition.x = tooltipPosition.x + 10;
    } else {
        // If mouse is on the right half, position tooltip on the left side of the cursor
        adjustedPosition.x = tooltipPosition.x - 390;
    }

    // Adjust vertical position (top or bottom)
    if (tooltipPosition.y < screenHeight / 2) {
        // If mouse is on the top half, position tooltip below the cursor
        adjustedPosition.y = tooltipPosition.y + 10;
    } else {
        // If mouse is on the bottom half, position tooltip above the cursor
        adjustedPosition.y = tooltipPosition.y - 120;
    }
</script>

<div 
    id="tooltip-route" 
    class="position-absolute col-3 bg-white rounded p-2"
    style="left: {adjustedPosition.x}px; top: {adjustedPosition.y}px;"
>
    <div class="row">
        <div class="col-4">
            <p class="text-light d-flex flex-column m-0">
                Startyear
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.startYear}</span>
            </p>
        </div>
        <div class="col-4">
            <p class="text-light d-flex flex-column m-0">
                Endyear
                <span class="fs-5 text-dark mt-n1">{tooltipRouteContent.endYear}</span>
            </p>
        </div>
        <div class="col-4">
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