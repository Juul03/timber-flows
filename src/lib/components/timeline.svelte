<div class="container">
    <div class="row">
        <div class="col">
            <h2>Timeline</h2>
            <div id="chart-container"></div>
        </div>
    </div>
</div>

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { getFellingDates } from '$lib/scripts/formatData.js';

    export let activeDataSets = [];

    // chart variables
    let chartContainer;
    let minYear;
    let maxYear;
    let svg;

    // Function to calculate the fellingDates frequencies
    const getFellingDateFrequency = (dataSets) => {
        const counts = {};

        dataSets.forEach(firstLevel => {
            if ('data' in firstLevel && Array.isArray(firstLevel.data)) {
                firstLevel.data.forEach(secondLevel => {
                    if ('data' in secondLevel && Array.isArray(secondLevel.data)) {
                        secondLevel.data.forEach(item => {
                            const fellingYears = getFellingDates([item]);
                            const year = fellingYears[0]; // get first/earliest
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
        // Convert fellingDate to Number to ensure consistency
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

    // Get fellingdDates frequency
    let fellingDateFrequency = getFellingDateFrequency(activeDataSets);
    console.log("Items per year:", fellingDateFrequency);


    onMount(() => {
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

        const fellingDateTicks = 10;

        const minYearAtLeast = 1400;
        const maxYearAtLeast = 1800;

        const allFrequencies = data.map(d => d.frequency);
        let maxFrequency = d3.max(allFrequencies);

        console.log("max frequency", maxFrequency)

        if(minYear === undefined || maxYear === undefined) {
            const allYears = data.map(d => d.fellingDate);
            const minAllYears = d3.min(allYears);
            const maxAllYears = d3.max(allYears);
            minYear = getMinYear(minYearAtLeast, minAllYears);
            maxYear = getMaxYear(maxYearAtLeast, maxAllYears);
        }

        // Fill in missing years
        const filledData = fillMissingYears(data, minYear, maxYear);

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
                .call(g => g.select(".domain").remove())  // Remove the axis line
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text("Frequency"));
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
            .attr("fill", "#D3D3D3")
            .attr("x", d => x(d.fellingDate))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .transition().duration(500)
            .attr("y", d => y(d.frequency))
            .attr("height", d => y(0) - y(d.frequency));
            
        // Append the SVG to the DOM (to the element with id 'chart-container')
        chartContainer.appendChild(svg.node());
    };

    $: if (activeDataSets && chartContainer) {
        fellingDateFrequency = getFellingDateFrequency(activeDataSets);
        drawBarchart(fellingDateFrequency);
    }
</script>