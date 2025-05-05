<div class="row align-items-center">
    <div class="col-11">
        <div id="chart-container"></div>
    </div>
    <div class="col-1 d-flex justify-content-end gap-1">
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

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { getFellingDates } from '$lib/scripts/formatData.js';

    export let activeDataSets = [];

    // exported variables from this component
    export let currentYearTimeline;

    // chart variables
    let chartContainer;
    let minYear;
    let maxYear;
    let svg;
    let filledData;

    // timeline variables
    let stepDuration;
    let timelineLine;
    let xScaleTimeline;
    let timelineIndex = 0;
    let timelineRunning = false;

    // variables
    let fellingDateFrequency

    // Function to calculate the fellingDates frequencies
    const getFellingDateFrequency = (dataSets) => {
        const counts = {};

        dataSets.forEach(firstLevel => {
            if ('data' in firstLevel && Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if ('data' in secondLevel && Array.isArray(secondLevel.data)) {
                        secondLevel.data.forEach(item => {
                            const fellingYears = getFellingDates([item]);
                            const year = fellingYears[0];
                            if (year) {
                                counts[year] = (counts[year] || 0) + 1;
                            }
                        });
                    } else {
                        const fellingYears = getFellingDates([secondLevel]);
                        const year = fellingYears[0];
                        if (year) {
                            counts[year] = (counts[year] || 0) + 1;
                        }
                    }
                });
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
            .attr("x1", x)
            .attr("x2", x);

        currentYearTimeline = year;
        timelineIndex++;

        setTimeout(animateTimeline, stepDuration);
    };

    // Animate timeline
    const startTimelineAnimation = () => {
        if (!svg || filledData.length === 0) return;

        xScaleTimeline = d3.scaleBand()
            .domain(filledData.map(d => d.fellingDate))
            .range([40, chartContainer.clientWidth])
            .padding(0);

        const duration = 5000;
        const totalSteps = filledData.length;
        stepDuration = duration / totalSteps;

        // If it's already at the end, reset to the beginning
        if (timelineIndex >= filledData.length) {
            timelineIndex = 0;
        }

        if (!timelineRunning) {
            timelineRunning = true;
            animateTimeline();
        } else {
            // If it's running, stop it
            timelineRunning = false;
        }
    };

    // Show timeline events
    const openTimelineEvents = () => {
        console.log("open timeline events");
    }


    // onMount
    onMount(() => {
        fellingDateFrequency = getFellingDateFrequency(activeDataSets);
        drawBarchart(fellingDateFrequency);
    });

    // Function to draw the bar chart
    const drawBarchart = (data) => {

        chartContainer = document.getElementById("chart-container");

        // Chart dimensions and margins
        const width = 1000;
        const height = 100;
        const marginTop = 30;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const containerWidth = (chartContainer.clientWidth || width) - marginLeft;

        const minYearAtLeast = 1400;
        const maxYearAtLeast = 1800;

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
                .attr("stroke", "red")
                .attr("stroke-width", 2)
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
            .attr("fill", "rgba(0, 0, 0, 0.65)")
            .attr("filter", "url(#glassmorphism)")
            .attr("x", d => x(d.fellingDate))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .transition().duration(500)
            .attr("y", d => y(d.frequency))
            .attr("height", d => y(0) - y(d.frequency));

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
            });

        // Append the SVG to the DOM (to the element with id 'chart-container')
        chartContainer.appendChild(svg.node());
    };

    $: if (activeDataSets && chartContainer) {
        fellingDateFrequency = getFellingDateFrequency(activeDataSets);
        drawBarchart(fellingDateFrequency);
    }
</script>