<div class="container">
    <div class="row">
        <div class="col">
            <h2>Dataviz</h2>
            <div id="chart-container"></div>
        </div>
    </div>
</div>

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let activeDataSets = [];

    // Function to calculate the provenance frequencies
    const getProvenanceFrequencies = (dataSets) => {
        const counts = {};

        dataSets.forEach(dataSet => {
            dataSet.forEach(data => {
                data.forEach(item => {
                    const provenance = item.provenance;
                    if (provenance) {
                        counts[provenance] = (counts[provenance] || 0) + 1;
                    }
                })
            });
        });

        // Return the frequencies as an array of objects
        return Object.entries(counts).map(([provenance, frequency]) => ({
            provenance,
            frequency
        }));
    };

    // Compute provenance frequencies from the active data
    let provenanceFrequency = getProvenanceFrequencies(activeDataSets);
    console.log("Provenance Frequency Data:", provenanceFrequency);

    onMount(() => {
        drawBarchart(provenanceFrequency);
    });

    // Function to draw the bar chart
    const drawBarchart = (data) => {
        console.log("data in char", provenanceFrequency);

        const chartContainer = document.getElementById("chart-container");
        chartContainer.innerHTML = "";

        // Chart dimensions and margins
        const width = 928;
        const height = 500;
        const marginTop = 30;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        // X scale: Position of the bars (based on provenance)
        const x = d3.scaleBand()
            .domain(d3.groupSort(data, ([d]) => -d.frequency, (d) => d.provenance))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        // Y scale: Frequency values (based on the count)
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.frequency)])  // Set domain to max frequency
            .range([height - marginBottom, marginTop]);

        // Create SVG container
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Add bars for each provenance
        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.provenance))
            .attr("y", (d) => y(d.frequency))
            .attr("height", (d) => y(0) - y(d.frequency))
            .attr("width", x.bandwidth());

        // Add x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add y-axis
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format("~s")))  // Format numbers (e.g., 1k, 1M)
            .call(g => g.select(".domain").remove())  // Remove the axis line
            .call(g => g.append("text")  // Add a label to the y-axis
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Frequency"));

        // Append the SVG to the DOM (to the element with id 'chart-container')
        chartContainer.appendChild(svg.node());
    };
</script>