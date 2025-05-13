
<div 
    id="tooltip-route" 
    class="position-absolute col-3 bottom-0 end-50" 
    style="left: {tooltipPosition.x + 10}px; top: {tooltipPosition.y + 10}px;"
    >
    <div class="row bg-white rounded p-2">
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

<script>
  export let tooltipRouteContent;
  export let tooltipPosition;
</script>
