import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

export const objectTypes = ["constructions", "artworks", "furniture"];

export const subtypeMap = {
    halfModels: "artworks",
    constructions: "constructions",
    Buildings: "constructions",
    "Churches in Buildings": "constructions",
    "Houses in Buildings": "constructions",
    "Superimposed tiebeam in Buildings": "constructions",
    "Truss legs in Buildings": "constructions",
    "Corbels in Buildings": "constructions",
    Shipwrecks: "constructions",
    "shipwrecksBatavia": "constructions",
    archeology: "constructions",
    panelPaintings: "artworks",
    sculptures: "artworks",
    buildings: "constructions",
    shipwrecks: "constructions",
    staves: "constructions",
};

export const colorScale = scaleOrdinal()
    .domain(objectTypes)
    .range(schemeCategory10);