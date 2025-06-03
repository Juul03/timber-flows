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
                                min="1400"
                                max={chartIntervals[chartId]?.end || 1800}
                                value={chartIntervals[chartId].start}
                                on:input={e => {
                                    const val = +e.target.value;
                                    chartIntervals[chartId].start = val;
                                    if (
                                        chartIntervals[chartId].start &&
                                        chartIntervals[chartId].end &&
                                        chartIntervals[chartId].start < chartIntervals[chartId].end
                                    ) {
                                        updateChart(chartId);
                                    }
                                }}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2">
                                <line id="Line_103" x2="10" transform="translate(1 1)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                            </svg>
                            <input 
                                class="maxYear bg-blur border-0 rounded-pill px-3 py-1 text-truncate fw-bold" 
                                type="number" 
                                placeholder="Select endyear" 
                                min={chartIntervals[chartId]?.start || 1401}
                                max="1800"
                                value={chartIntervals[chartId]?.end}
                                on:input={e => {
                                    const val = +e.target.value;
                                    chartIntervals[chartId].end = val;
                                    if (
                                        chartIntervals[chartId].start &&
                                        chartIntervals[chartId].end &&
                                        chartIntervals[chartId].start < chartIntervals[chartId].end
                                    ) {
                                        updateChart(chartId);
                                    }
                                }}
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
                </div>
                <div class="col-12 d-flex justify-content-end align-items-center gap-2">
                    <p class="m-0 text-small">Sort:</p>
                    <!-- select sorting method: alpahbetic, descending, descending constructions, descending artworks -->
                    <select
                        class="form-select small w-auto bg-blur box-shadow border-0 rounded-pill px-3 py-1 text-truncate fw-bold"
                        value={chartSorts[chartId]}
                        on:change={e => {
                            chartSorts[chartId] = e.target.value;
                            updateChart(chartId);
                        }}>
                        <option value="alphabetic">Alphabetic</option>
                        <option value="descending">Descending</option>
                        <option value="descending-constructions">Descending Constr.</option>
                        <option value="descending-artworks">Descending Artw.</option>
                    </select>
                </div>
                <div class="col-12">
                    <div id={chartId + "-stacked"} class="w-100"></div>
                    <div id={chartId + "-normalized"} class="w-100"></div>
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

    let chartIntervals = {
        'barchart-container-0': { start: 1400, end: 1800 }
    };

    let chartSorts = {
        'barchart-container-0': 'descending'
    }
    
    let prevGlobalMax = 0;
    let globalMax = 100;

    const getSortedDomain = (data, sort) => {
        if (sort === 'alphabetic') {
            return data.map(d => d.provenance).sort((a, b) => a.localeCompare(b));
        }
        if (sort === 'descending-constructions') {
            return data.slice().sort((a, b) => b.constructions - a.constructions).map(d => d.provenance);
        }
        if (sort === 'descending-artworks') {
            return data.slice().sort((a, b) => b.artworks - a.artworks).map(d => d.provenance);
        }
        // Default: descending by total
        return data.slice().sort((a, b) => (b.constructions + b.artworks) - (a.constructions + a.artworks)).map(d => d.provenance);
    }
    
    const extractYear = (fellingDate) => {
        if (!fellingDate) return null;

        // If it's a number (already a valid year), just return it
        if (typeof fellingDate === 'number') {
            return fellingDate;
        }

        // If it's a string (e.g., "1500-1550" or "1500"), extract first part
        if (typeof fellingDate === 'string') {
            // Try to find a year inside parentheses first
            const parenMatch = fellingDate.match(/\((\d{4})\)/);
            if (parenMatch) {
                return parseInt(parenMatch[1], 10);
            }

            // If no parentheses, check if it is a range "1500-1550"
            if (fellingDate.includes('-')) {
                const yearStr = fellingDate.split('-')[0].trim();
                const year = parseInt(yearStr, 10);
                return isNaN(year) ? null : year;
            }

            // Otherwise try parsing the whole string as year (e.g. "1500")
            const year = parseInt(fellingDate.trim(), 10);
            return isNaN(year) ? null : year;
        }

        // Fallback for unexpected types
        return null;
    };

    const getAllProvenances = (dataSets) => {
        const provSet = new Set();
        dataSets.forEach(ds => {
            if (ds.data) {
                ds.data.forEach(group => {
                    const items = Array.isArray(group.data) ? group.data : [group];
                    items.forEach(item => {
                        provSet.add(item.provenance || 'Unknown');
                    });
                });
            }
        });
        return Array.from(provSet);
    }

    const getStackedData = (dataSets, startYear, endYear) => {
        const allprovenances = getAllProvenances(dataSets);
        const counts = {};

        allprovenances.forEach(prov => {
            counts[prov] = { constructions: 0, artworks: 0 };
        });

        dataSets.forEach(ds => {
            const type = ds.name;
            if (ds.data) {
                ds.data.forEach(group => {
                    const items = Array.isArray(group.data) ? group.data : [group];
                    items.forEach(item => {
                        const year = extractYear(item.fellingDate);
                        if (year && year >= startYear && year <= endYear) {
                            const prov = item.provenance || 'Unknown';
                            if (!counts[prov]) counts[prov] = { constructions: 0, artworks: 0 };
                            if (type === "constructions") counts[prov].constructions += 1;
                            if (type === "artworks") counts[prov].artworks += 1;
                        }
                    });
                });
            }
        });
        return Object.entries(counts).map(([provenance, values]) => ({
            provenance,
            ...values
        }));
    };

    const getGlobalMax = () => {
        let max = 0;
        chartIds.forEach(id => {
            const interval = chartIntervals[id];
            if (interval) {
                const data = getStackedData(activeDataSets, interval.start, interval.end);
                data.forEach(d => {
                    const total = (d.constructions || 0) + (d.artworks || 0);
                    if (total > max) max = total;
                });
            }
        });
        return max;
    }

    const drawStackedBarchart = (containerId, data, sort) => {
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
            .domain(getSortedDomain(data, sort))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const series = d3.stack()
            .keys(keys)
            (data);

        const y = d3.scaleLinear()
            .domain([0, globalMax])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
        
        if (!data || data.length === 0 || data.every(d => (d.constructions === 0 && d.artworks === 0))) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", "1.2em")
                .text("No data, select a wider interval");
            return;
        }

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#4e79a7", "#f28e2b"]);

        // bars update enter exit
        const bars = svg.selectAll("g.layer")
            .data(series, d => d.key);

        bars.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

        const barsEnter = bars.enter()
            .append("g")
            .attr("class", "layer")
            .attr("fill", d => color(d.key));

        const rects = barsEnter.merge(bars)
            .selectAll("rect")
            .data(d => d, d => d.data.provenance);

        rects.exit()
            .transition()
            .duration(500)
            .attr("y", y(0))
            .attr("height", 0)
            .remove();

        rects.enter()
            .append("rect")
            .attr("x", d => x(d.data.provenance))
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]));

        rects.transition()
            .duration(500)
            .attr("x", d => x(d.data.provenance))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]));
    }

    const drawStackedBarchartNormalized = (containerId, data, sort) => {
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
            .domain(getSortedDomain(data, sort))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const series = d3.stack()
            .keys(keys)
            .offset(d3.stackOffsetExpand) // 100% stacked!
            (data);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(["#4e79a7", "#f28e2b"]);

        // bars update enter exit
        const bars = svg.selectAll("g.layer")
            .data(series, d => d.key);

        bars.exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();

        const barsEnter = bars.enter()
            .append("g")
            .attr("class", "layer")
            .attr("fill", d => color(d.key));

        const rects = barsEnter.merge(bars)
            .selectAll("rect")
            .data(d => d, d => d.data.provenance);
        
        rects.exit()
            .transition()
            .duration(500)
            .attr("y", y(0))
            .attr("height", 0)
            .remove();

        rects.enter()
            .append("rect")
            .attr("x", d => x(d.data.provenance))
            .attr("width", x.bandwidth())
            .attr("y", y(0))
            .attr("height", 0)
            .transition()
            .duration(500)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]));
        
        rects.transition()
            .duration(500)
            .attr("x", d => x(d.data.provenance))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));
    }

    onMount(() => {
        globalMax = getGlobalMax();

        chartIds.forEach(id => {
            const interval = chartIntervals[id];
            const sort = chartSorts[id] || 'descending';
            if (interval) {
                const data = getStackedData(activeDataSets, interval.start, interval.end);
                drawStackedBarchart(id + "-stacked", data, sort);
                drawStackedBarchartNormalized(id + "-normalized", data, sort);
            }
        });
    });

    const addNewChart = () => {
        const newId = `barchart-container-${chartCounter++}`;
        chartIds = [...chartIds, newId];
        chartIntervals[newId] = { start: 1400, end: 1800 };
        chartSorts[newId] = 'descending';
        tick().then(() => {
            const interval = chartIntervals[newId];
            const sort = chartSorts[newId] || 'descending';
            const data = getStackedData(activeDataSets, interval.start, interval.end);
            drawStackedBarchart(newId + "-stacked", data, sort);
            drawStackedBarchartNormalized(newId + "-normalized", data, sort);

            const newGlobalMax = getGlobalMax();
            if(Math.abs(newGlobalMax - prevGlobalMax) > 10) {
                updateAllCharts();
            }
        });
    };

    const updateAllCharts = () => {
        const newGlobalMax = getGlobalMax();
        
        prevGlobalMax = newGlobalMax;
        globalMax = newGlobalMax;
        chartIds.forEach(id => {
            const interval = chartIntervals[id];
            const sort = chartSorts[id] || 'descending';
            if (interval) {
                const data = getStackedData(activeDataSets, interval.start, interval.end);
                drawStackedBarchart(id + "-stacked", data, sort);
                drawStackedBarchartNormalized(id + "-normalized", data, sort);
            }
        });  
    }
    
   const updateChart = (chartId) => {
        const interval = chartIntervals[chartId];
        const sort = chartSorts[chartId] || 'descending';
        if (interval) {
            const data = getStackedData(activeDataSets, interval.start, interval.end);
            drawStackedBarchart(chartId + "-stacked", data, sort);
            drawStackedBarchartNormalized(chartId + "-normalized", data, sort);
            
            const newGlobalMax = getGlobalMax();
            if(Math.abs(newGlobalMax - prevGlobalMax) > 10) {
                updateAllCharts();
            }
        }
    }

    const removeChart = (chartId) => {
        chartIds = chartIds.filter(id => id !== chartId);
        delete chartIntervals[chartId];
        delete chartSorts[chartId];

        const newGlobalMax = getGlobalMax();
        if(Math.abs(newGlobalMax - prevGlobalMax) > 10) {
            updateAllCharts();
        }
    };
</script>