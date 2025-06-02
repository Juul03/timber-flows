<div class="row align-items-center">
    {#each chartIds as chartId (chartId)}
        <div class="col-4 py-2">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <input 
                                class="bg-blur border-0 rounded-pill px-3 py-1 text-truncate fw-bold" 
                                type="number" 
                                placeholder="Select startyear" 
                                min=1400 
                                max=1800
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2">
                                <line id="Line_103" x2="10" transform="translate(1 1)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                            </svg>
                            <input 
                                class="maxYear bg-blur border-0 rounded-pill px-3 py-1 text-truncate fw-bold" 
                                type="number" 
                                placeholder="Select endyear" 
                                min=1401 
                                max=1800
                                >
                        </div>
                        {#if chartIds.length > 1}
                            <div>
                                <button class="btn btn-link" on:click={removeChart(chartId)}>
                                    Remove chart
                                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                    </svg>
                                </button>
                            </div>
                        {/if}
                    </div>

                    <div id={chartId} class="w-100"></div>
                </div>
            </div>
        </div>
    {/each}
    <div class="col-4">
        <button class="btn btn-primary d-flex justify-content-center align-items-center gap-2" on:click={addNewChart}>
            Add chart
            <svg class="svg-icon icon-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
            </svg>
        </button>
    </div>
</div>

<script>
    import { onMount, tick } from 'svelte';
    import * as d3 from 'd3';

    export let activeDataSets = [];

    let chartData = [];
    let chartIds = ['barchart-container-0']; // start with one chart
    let chartCounter = 1;

    const getStackedData = (dataSets) => {
        const counts = {};
        dataSets.forEach(ds => {
            // "constructions" or "artworks" or "furniture
            const type = ds.name;
            if (ds.data) {
                ds.data.forEach(group => {
                    const items = Array.isArray(group.data) ? group.data : [group];
                    items.forEach(item => {
                        const prov = item.provenance || 'Unknown';
                        if (!counts[prov]) counts[prov] = { constructions: 0, artworks: 0 };
                        if (type === "constructions") counts[prov].constructions += 1;
                        if (type === "artworks") counts[prov].artworks += 1;
                    });
                });
            }
        });
        // Convert to array for D3
        return Object.entries(counts).map(([provenance, values]) => ({
            provenance,
            ...values
        }));
    }

    const drawStackedBarchart = (containerId, data) => {
        const keys = ["constructions", "artworks"];
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 50, left: 40 };

        d3.select(`#${containerId}`).selectAll("*").remove();

        const svg = d3.select(`#${containerId}`)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, D => -d3.sum(D, d => d.constructions + d.artworks), d => d.provenance))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const series = d3.stack()
            .keys(keys)
            (data);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#4e79a7", "#f28e2b"]);

        svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.provenance))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth());

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    }

    onMount(() => {
        chartData = getStackedData(activeDataSets);
        chartIds.forEach(id => drawStackedBarchart(id, chartData));
    });

    const addNewChart = () => {
        const newId = `barchart-container-${chartCounter++}`;
        chartIds = [...chartIds, newId];
        tick().then(() => drawStackedBarchart(newId, chartData)); // wait for DOM to render new container
    };

    const removeChart = (chartId) => {
        chartIds = chartIds.filter(id => id !== chartId);
    };

    $: if (activeDataSets.length > 0) {
        chartData = getStackedData(activeDataSets);
        chartIds.forEach(id => {
            onMount(() => drawStackedBarchart(id, chartData));
        });
    }

    $: if (chartIds.length && chartData.length) {
        chartIds.forEach(id => drawStackedBarchart(id, chartData));
    }
</script>