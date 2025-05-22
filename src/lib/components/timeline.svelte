<div id="timeline" class="row align-items-center">
    <div class="col-12 pt-2">
        <input 
            class="minYear bg-blur border-0 rounded-pill px-3 py-1 text-truncate fw-bold"
            type="number" 
            name="" 
            id="" 
            placeholder="Select startyear"
            min={minYear}
            max={maxYear}
            bind:value={currentYearTimeline}
            on:change={onInputYearChange}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2">
            <line id="Line_103" data-name="Line 103" x2="10" transform="translate(1 1)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
        </svg>
        <input 
            class="maxYear bg-blur border-0 rounded-pill px-3 py-1 text-truncate fw-bold" 
            type="number" 
            name="" 
            id="" 
            placeholder="Select startyear"
            min={currentYearTimeline}
            max={maxYear}
        >
    </div>
    <div class="col-11">
        <div id="timeline-container"></div>
    </div>
    <div class="col-1">
        <div class="row pb-1">
            <div class="col-12">
                <button id="timeline-speed" class="btn bg-blur d-flex justify-content-between w-100" on:click={changeTimelineSpeed}>
                    {@html timelineSpeedIcons[timelineSpeedIndex]}
                    <span>
                        {timelineSpeedIndex + 1}X
                    </span>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-12 d-flex justify-content-end gap-1">
                <button class="btn btn-secondary bg-blur d-flex align-items-center justify-content-center" on:click={startTimelineAnimation}>
                    {#if timelineRunning}
                        <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                        </svg>
                    {:else}
                        <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                        </svg>
                    {/if}
                </button>
                <button class="btn btn-secondary bg-blur" aria-label="open timeline events" on:click={openTimelineEvents}>
                    <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 33">
                        <g id="Group_181" data-name="Group 181" transform="translate(-1563.084 -171)">
                        <g id="Group_67" data-name="Group 67" transform="translate(1563.084 180)">
                            <rect id="Rectangle_33" data-name="Rectangle 33" width="20" height="8" rx="1" transform="translate(2)"/>
                            <rect id="Rectangle_34" data-name="Rectangle 34" width="20" height="8" rx="1" transform="translate(12 10)"/>
                            <rect id="Rectangle_35" data-name="Rectangle 35" width="8" height="8" rx="1" transform="translate(0 10)"/>
                        </g>
                        <line id="Line_95" data-name="Line 95" y2="32" transform="translate(1576.584 171.5)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="1"/>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { getFellingDates } from '$lib/scripts/formatData.js';

    export let activeDataSets = [];

    // exported variables from this component
    export let currentYearTimeline = 1450;

    // chart variables
    let chartContainer;
    let minYear;
    let maxYear;
    let svg;
    let filledData;

    // timeline variables
    let timelineLine;
    let xScaleTimeline;
    let timelineIndex = 0;
    export let timelineRunning = false;
    export let timelineClicked = false;
    export let timelineSpeed = 500;
    let timelineSpeedIndex = 0;
    let timelineSpeedOptions = [
        500,
        250,
        100
    ]
    let timelineSpeedIcons = [
        `
        <svg id="snail" data-name="snail" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="459.079" height="313.068" viewBox="0 0 459.079 313.068">
            <defs>
                <clipPath id="clip-path">
                <rect id="Rectangle_32" data-name="Rectangle 32" width="459.079" height="313.068" fill="none"/>
                </clipPath>
            </defs>
            <g id="Group_29" data-name="Group 29" clip-path="url(#clip-path)">
                <path id="Path_125" data-name="Path 125" d="M189.388,265.829c10.111-27.361,9.92-56.4-8.179-80.331-25.169-33.281-77.23-40.994-105.343-6.681C55.591,203.563,59.1,244.39,89.338,259.369c4.493,2.226,21.069,7.792,24.8,4.214,4.1-8.7-7.894-6.5-13.963-8.047-37.977-9.7-37.533-61.607-7.729-82.143,39.233-27.034,93.2,6.382,95.983,51.889C192.575,293.164,123.6,330.53,63.7,305c-73.256-31.222-81.9-124.494-33.3-181.644,73.834-86.811,210.707-46.59,253.827,50.113,14.2,31.845,8.234,45.421-20.836,61.879-23.252,13.164-48.858,21.793-74.011,30.478"/>
                <path id="Path_126" data-name="Path 126" d="M458.139,16.09c5.021,5.75-11.513,10.847-15.68,13.32-22.638,13.43-41.079,34.015-54.687,56.378l.594,1.515c13.226,6.4,24.133,16.5,18.489,32.5-5.034,14.272-20.622,12.347-30.809,19.191-19.846,13.334-26.519,74.511-31.945,97.055-8.049,33.449-37.354,51.575-68.709,59.291-41.539,10.222-85.474,12.965-128.008,16.482-.5-2.336.292-1.606,1.283-2.239,10.085-6.436,17.668-10.858,25.682-20.286,2.764-3.253,8.05-12.672,10.663-14.337,5.1-3.253,23.587-7.411,30.884-10.116,21.908-8.122,69.93-26.66,79.675-48.325,7.941-17.653,1.724-30.253-4-46.959,15.807-35.621,43.535-84.679,87.819-85.219C394.075,60.028,413.8,36.93,438.707,22.658c2.906-1.665,12.062-6.747,14.676-7.411,1.506-.383,3.726-.336,4.756.843"/>
                <path id="Path_127" data-name="Path 127" d="M371.264,77.709l-8.879-.372c6.982-16.988,14.714-33.687,25.176-48.824C391.008,23.525,408.394.75,413.053.046c3.047-.461,5.269,2.684,3.824,5.769C415.952,7.789,405,18.129,402.406,21.358a192.371,192.371,0,0,0-31.142,56.351"/>
            </g>
        </svg>
        `,
        `
        <svg id="turtle" data-name="turtle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="478.648" height="271.812" viewBox="0 0 478.648 271.812">
            <defs>
                <clipPath id="clip-path">
                <rect id="Rectangle_33" data-name="Rectangle 33" width="478.648" height="271.812" fill="none"/>
                </clipPath>
            </defs>
            <g id="Group_31" data-name="Group 31" clip-path="url(#clip-path)">
                <path id="Path_128" data-name="Path 128" d="M37.055,181.507A9.324,9.324,0,0,0,39.746,196.7c9.693,4.158,35.258,7.661,46.668,9.332,94.731,13.873,198.717-3.473,228.832-107.836,2.716-9.413,9.087-37.45,5.744-45.74-4.566-11.321-16.006.079-23.6-.322C257.1,37.449,215.058,28.836,172.75,40.7,109.288,58.491,68.318,118.642,48.268,178.216c-1.493,1.77-7.923.221-11.213,3.291"/>
                <path id="Path_129" data-name="Path 129" d="M181.248,271.2l-1.515-2.454,18.01-26.54c-20.371,2.97-40.974,1.754-61.536,2.035L93.489,240.36c-13.911,7.559-21.317,28.922-38.238,30.839-16.333,1.85-36.129-1.245-52.838-.166-7.656-2.616,5.117-15.676,7.821-18.851a180.028,180.028,0,0,1,52.271-41.805c107.769,23.882,245.258,17.188,274.93-111.995,1.263-5.5,1.28-12.711,2.555-17.444.6-2.211,3.872-5.66,4.933-8.067,9.971-22.623,18.041-43.809,37.81-60.19,33.474-27.736,71.445-5.237,95.915,22.158-29.6,53.328-69.886,99.735-114.62,140.841,17.377,28.217,38.928,53.557,58.557,80.171,3.855,5.723.8,14.519-6.3,15.388-20.32-1.5-43.076,1.843-63.087,0-6.617-.608-8.1-3.786-10.63-9.371-6.07-13.4-9.676-29.074-16.6-42.348l18.773-28.319L309.42,212.368l-26.175,11.839c-2.782.509-1.24-3.749-1.366-5.381l6.374-26.625c-6.982,9.727-12.139,20.876-17.363,31.636-5.746,11.834-12.108,31.117-18.729,41.272-.989,1.516-5.366,5.753-6.913,6.087ZM398.481,55.955c19.968,3.689,21.6-23.873,5.517-26.55-17.323-2.883-20.849,23.718-5.517,26.55"/>
            </g>
        </svg>
        `,
        `
        <svg id="Group_34" data-name="Group 34" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="282.743" height="246.073" viewBox="0 0 282.743 246.073">
            <defs>
                <clipPath id="clip-path">
                <rect id="Rectangle_34" data-name="Rectangle 34" width="282.743" height="246.073" fill="none"/>
                </clipPath>
            </defs>
            <g id="Group_33" data-name="Group 33" clip-path="url(#clip-path)">
                <path id="Path_130" data-name="Path 130" d="M142.844,218.519c8.97.828,25.772,5.531,26.56,16.513.535,7.453-4.741,9.651-11.006,11.041-25.025-1.438-50.565.92-75.545-.564-24.41-1.45-41.776-7.093-53.366-29.634-1.474-2.865-1.883-6.951-3.662-9.338-2.783-3.733-10.25-8.308-13.9-13.1-6.387-8.406-17.794-36.445-8.3-44.611,5.963-5.129,9.063,5.562,13.17,7.742a19.022,19.022,0,0,0,9.523,1.938c4.524-28.535,23.988-54.335,51.5-64,33.247-11.679,69.1-2.694,99.033,13.744l9.467-9.225C156.678,85.4,131.316,53.578,130.284,20.035c-.62-20.133,19.64-6.051,27.975-.932,18.068,11.1,38.657,27.526,52.054,43.946C213.924,67.474,225.365,86.56,227.358,88c2.694,1.952,11.714,3.6,16.195,5.805,15.064,7.43,19.236,17.23,27.977,30.024,6.208,9.087,17.469,16.207,6.811,28.183-15.389,17.291-42.418,9.411-59.007,23.993-7.664,6.736-17.524,28.642-15.546,38.569,3.045,15.278,19.77,13.463,25,20,9.639,12.047-13.942,10.785-19.929,10.947-6.036.164-11.488,1.2-17.8-1.215-7.074-2.71-8.272-9.445-12.3-14.7-6.641-8.674-19.444-15.666-30.413-16.1,28.547-27.5,1.6-53.091-25.52-64.976-2.911-.228-.852,1.206.164,1.841,9.523,5.952,17.066,9.3,24.184,18.816,12.144,16.243,7.564,38.638-12.554,45.1l-14.274,4.226c7.282.486,15.316-.663,22.5,0m101.242-96.258c6.348-5.992-5.217-15.892-9.8-8.307-4.423,7.323,5.219,12.629,9.8,8.307"/>
                <path id="Path_131" data-name="Path 131" d="M220.333,62.519a269.011,269.011,0,0,0-51.488-45.943c-.21-9.148,7.727-22.661,17.492-13.552,5.462,5.1,16.055,22.7,20.178,29.823,5.354,9.256,10.881,19.372,13.818,29.672"/>
            </g>
        </svg>
        `
    ]
    // variables
    let fellingDateFrequency

    // Function to calculate the fellingDates frequencies
    const getFellingDateFrequency = (dataSets) => {
        const counts = {};
        console.log("timeline datasets", dataSets);

        dataSets.forEach(firstLevel => {
            if ('data' in firstLevel && Array.isArray(firstLevel.data)) {
                let objectType = firstLevel.name || "unknown";
                firstLevel.data.forEach(secondLevel => {
                    if ('data' in secondLevel && Array.isArray(secondLevel.data)) {
                        objectType = secondLevel.name || "unknown";
                        secondLevel.data.forEach(item => {
                            const fellingYears = getFellingDates([item], objectType);
                            const year = fellingYears[0];
                            if (year) {
                                counts[year] = (counts[year] || 0) + 1;
                            }
                        });
                    } else {
                        const fellingYears = getFellingDates([secondLevel], objectType);
                        const year = fellingYears[0];
                        if (year) {
                            counts[year] = (counts[year] || 0) + 1;
                        }
                    }
                });
                console.log("TYPEEEE", objectType)
            }
        });

        return Object.entries(counts).map(([fellingDate, frequency]) => ({
            fellingDate,
            frequency
        }));
    };

    const fillMissingYears = (data, startYear, endYear) => {
        const yearMap = new Map(data.map(d => [Number(d.fellingDate), d.frequency]));
        const filled = [];

        for (let year = startYear; year <= endYear; year++) {
            filled.push({
                fellingDate: year,
                frequency: yearMap.get(year) || 0
            });
        }

        return filled;
    };

    let getMinYear = (standard, dynamic) => {
        if(dynamic < standard) {
            return dynamic
        } else {
            return standard
        }
    }

    let getMaxYear = (standard, dynamic) => {
        if(dynamic > standard) {
            return dynamic
        } else {
            return standard
        }
    }

    const onInputYearChange = () => {
        if (!svg || !filledData || filledData.length === 0) return;

        const year = Number(currentYearTimeline);
        const x = xScaleTimeline(year) + xScaleTimeline.bandwidth() / 2;

        // Clamp the value to a valid year
        const validYears = filledData.map(d => d.fellingDate);
        const closest = validYears.reduce((a, b) => {
            return Math.abs(b - year) < Math.abs(a - year) ? b : a;
        });

        const xPos = xScaleTimeline(closest) + xScaleTimeline.bandwidth() / 2;

        // Move the line
        svg.select(".timeline-line")
            .transition()
            .duration(timelineSpeed)
            .attr("x1", xPos)
            .attr("x2", xPos);

        // Update internal state
        currentYearTimeline = closest;
        timelineIndex = filledData.findIndex(d => d.fellingDate == closest);
    };

    const animateTimeline = () => {
        if (!timelineRunning) return;

        if (timelineIndex >= filledData.length) {
            timelineRunning = false;
            timelineIndex = filledData.length;
            return;
        }

        const year = filledData[timelineIndex].fellingDate;
        const x = xScaleTimeline(year) + xScaleTimeline.bandwidth() / 2;

        svg.select(".timeline-line")
            .transition()
            .duration(timelineSpeed)
            .attr("x1", x)
            .attr("x2", x);

        currentYearTimeline = year;
        timelineIndex++;

        setTimeout(animateTimeline, timelineSpeed);
    };

    // Animate timeline
    const startTimelineAnimation = () => {
        if (!svg || filledData.length === 0) return;

        // If it's already at the end, reset to the beginning
        if (timelineIndex >= filledData.length) {
            timelineIndex = 0;
        }

        if (!timelineRunning) {
            timelineRunning = true;
            timelineClicked = false;
            animateTimeline();
        } else {
            // If it's running, stop it
            timelineRunning = false;
            timelineClicked = false;
        }
    };

    const changeTimelineSpeed = () => {
        timelineSpeedIndex++;

        if(timelineSpeedIndex > 2) {
            timelineSpeedIndex = 0;
        }

        timelineSpeed = timelineSpeedOptions[timelineSpeedIndex];
    }


    // Show timeline events
    const openTimelineEvents = () => {
        console.log("open timeline events");
    }

    // onMount
    onMount(() => {
        fellingDateFrequency = getFellingDateFrequency(activeDataSets);
        drawBarchart(fellingDateFrequency);
    });

    // timeline tooltip
    const showTooltip = (event, year) => {
        let tooltip = d3.select("#tooltip-timeline");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("id", "tooltip-timeline")
            .style("position", "absolute")
            .style("z-index", "10000")
            .style("padding", "4px 8px")
            .style("border-radius", "4px")
            .style("pointer-events", "none");
        }
        tooltip
            .attr("class", selectedMapType)
            .style("left", (event.pageX - 35) + "px")
            // .style("top", (event.pageY + 25) + "px")
            .style("top", (event.pageY - 45) + "px")
            .style("display", "block")
            .text(`Year: ${year}`);
    }

    const hideTooltip = () => {
        d3.select("#tooltip-timeline").style("display", "none");
    }

    const highlightBar = (year) => {
        svg.selectAll(".bar")
            .attr("class", d => d.fellingDate === year ? "bar hover" : "bar")
            .transition().duration(50)
    }

    // Function to draw the bar chart
    const drawBarchart = (data) => {
        console.log("chart data", data);

        chartContainer = document.getElementById("timeline-container");

        // Chart dimensions and margins
        const width = 1000;
        const height = 100;
        const marginTop = 30;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const containerWidth = (chartContainer.clientWidth || width) - marginLeft;

        const minYearAtLeast = 1450;
        const maxYearAtLeast = 1750;

        const fellingDateTicks = 25;

        const allFrequencies = data.map(d => d.frequency);
        let maxFrequency = d3.max(allFrequencies);

        if(minYear === undefined || maxYear === undefined) {
            const allYears = data.map(d => d.fellingDate);
            const minAllYears = d3.min(allYears);
            const maxAllYears = d3.max(allYears);
            minYear = getMinYear(minYearAtLeast, minAllYears);
            maxYear = getMaxYear(maxYearAtLeast, maxAllYears);
        }

        // Fill in missing years
        filledData = fillMissingYears(data, minYear, maxYear);

        xScaleTimeline = d3.scaleBand()
            .domain(filledData.map(d => d.fellingDate))
            .range([marginLeft, containerWidth - marginRight])
            .padding(0);

        // X scale: Position of the bars (based on fellingDate)
        const x = d3.scaleBand()
            .domain(filledData.map(d => d.fellingDate))
            .range([marginLeft, containerWidth - marginRight])
            .padding(0);


        // Y scale: Frequency values (based on the count)
        const y = d3.scaleLinear()
            .domain([0, d3.max(filledData, (d) => d.frequency)])
            .range([height - marginBottom, marginTop]);

        if (!svg) {
            svg = d3.select(chartContainer)
                .append("svg")
                .attr("width", "100%")
                .attr("height", height)
                .attr("viewBox", [0, 0, containerWidth, height])
                .attr("style", "max-width: 100%; height: auto;");

            // Add x-axis group
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x)
                    .tickValues(x.domain().filter((d, i) => d % fellingDateTicks === 0))
                    .tickSizeOuter(0));

            // Add y-axis group
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(maxFrequency).tickFormat(d3.format("~s"))) 
                .call(g => g.select(".domain").remove())
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    // .text("Frequency")
                )
        }

        // append timeline selector 
        timelineLine = svg.select(".timeline-line");
        if (timelineLine.empty()) {
            svg.append("line")
                .attr("class", "timeline-line")
                .attr("y1", 30)
                .attr("y2", 100 - 30)
                .attr("stroke", "#964B00")
                .attr("stroke-width", x.bandwidth())
                .attr("x1", 40)
                .attr("x2", 40);
        }

        // update y-axis
        const yAxis = svg.select(".y-axis")
            .transition()
            .call(d3.axisLeft(y).ticks(maxFrequency).tickFormat(d3.format("~s"))) 


        // Update bars
        const bars = svg.selectAll(".bar")
            .data(filledData, d => d.fellingDate); 

        // Exit
        bars.exit()
            .transition().duration(500)
            .attr("y", y(0))
            .attr("height", 0)
            .remove();

        // Update
        bars.transition().duration(500)
            .attr("x", d => x(d.fellingDate))
            .attr("y", d => y(d.frequency))
            .attr("height", d => y(0) - y(d.frequency))
            .attr("width", x.bandwidth());

        // Enter - Add bars for each fellingDate (if not there already)
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            // .attr("fill", "rgba(0, 0, 0, 0.65)")
            .attr("filter", "url(#glassmorphism)")
            .attr("x", d => x(d.fellingDate))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .transition().duration(500)
            .attr("y", d => y(d.frequency))
            .attr("height", d => y(0) - y(d.frequency));
        
        bars.on("mouseover", (event, d, nodes) => {
            d3.select(nodes[0]).attr("fill", "blue");
        })
        .on("mouseout", (event, d, nodes) => {
            d3.select(nodes[0]).attr("fill", "rgba(0, 0, 0, 0.65)");
        });


        svg.append("defs")
        .append("filter")
        .attr("id", "glassmorphism")
        .html(`
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feColorMatrix in="blur" type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.3 0" result="blurry"/>
            <feBlend in="SourceGraphic" in2="blurry" mode="normal"/>
        `);

        // Add overlay for click detection
       svg.append("rect")
            .attr("class", "click-overlay")
            .attr("x", marginLeft)
            .attr("y", 0)
            .attr("width", chartContainer.clientWidth - marginLeft)
            .attr("height", height)
            .style("fill", "transparent")
            .style("cursor", "pointer")
            .on("click", (event) => {
                timelineClicked = true;
                timelineRunning = false;
                const [mouseX] = d3.pointer(event);
                const years = x.domain();
                const closest = years.reduce((a, b) => {
                    const aDist = Math.abs(x(a) + x.bandwidth()/2 - mouseX);
                    const bDist = Math.abs(x(b) + x.bandwidth()/2 - mouseX);
                    return aDist < bDist ? a : b;
                });

                const xPos = x(closest) + x.bandwidth() / 2;
                svg.select(".timeline-line")
                    .transition()
                    .duration(300)
                    .attr("x1", xPos)
                    .attr("x2", xPos);

                currentYearTimeline = closest;
                timelineIndex = filledData.findIndex(d => d.fellingDate == closest);
            })
            .on("mousemove", (event) => {
                const [mouseX] = d3.pointer(event);
                const years = x.domain();
                const closest = years.reduce((a, b) => {
                const aDist = Math.abs(x(a) + x.bandwidth() / 2 - mouseX);
                const bDist = Math.abs(x(b) + x.bandwidth() / 2 - mouseX);
                return aDist < bDist ? a : b;
                });

                // Show or update tooltip with the year 'closest'
                showTooltip(event, closest);

                // Highlight the corresponding bar
                highlightBar(closest);

            })
            .on("mouseout", () => {
                hideTooltip();
            });


        // Append the SVG to the DOM (to the element with id 'timeline-container')
        chartContainer.appendChild(svg.node());
    };


    $: if (activeDataSets && chartContainer) {
        fellingDateFrequency = getFellingDateFrequency(activeDataSets);
        drawBarchart(fellingDateFrequency);
    }

    $: if(timelineClicked) {
        console.log("timeline clicked child", timelineClicked);
    }

    export let selectedMapType;
    let previousMapType;
    previousMapType = selectedMapType;

    $: if (selectedMapType) {
        console.log("selected maptype", selectedMapType);
        
        if (chartContainer) {
            chartContainer.classList.remove(previousMapType);
            chartContainer.classList.add(selectedMapType);
            previousMapType = selectedMapType;
        }
    }
</script>