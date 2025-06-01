<div id="barchart-container"></div>

<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let activeDataSets = [];

    const getProvenanceFrequency = (dataSets) => {
        const counts = {};
        dataSets.forEach(ds => {
            if (ds.data) {
                ds.data.forEach(group => {
                    const items = Array.isArray(group.data) ? group.data : [group];
                    items.forEach(item => {
                        const prov = item.provenance || 'Unknown';
                        counts[prov] = (counts[prov] || 0) + 1;
                    });
                });
            }
        });

        return Object.entries(counts).map(([provenance, frequency]) => ({ provenance, frequency }));
    };

    const drawBarchart = (data) => {
        const container = document.getElementById("barchart-container");
        const width = 800;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 50, left: 40 };
        
        // Sort data by frequency (descending)
        data.sort((a, b) => b.frequency - a.frequency);

        d3.select(container).selectAll("*").remove(); // Clear previous

        const svg = d3.select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleBand()
            .domain(data.map(d => d.provenance))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.provenance))
            .attr("y", d => y(d.frequency))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.frequency))
            .attr("fill", "steelblue");
    };

    onMount(() => {
        const data = getProvenanceFrequency(activeDataSets);
        drawBarchart(data);
    });

    $: if (activeDataSets) {
        const data = getProvenanceFrequency(activeDataSets);
        drawBarchart(data);
        console.log("active datasets", activeDataSets)
    }
</script>
