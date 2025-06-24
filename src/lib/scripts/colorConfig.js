import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

export const objectTypes = [
    "halfModels", 
    "panelPaintings", 
    "sculptures",
    "constructions",
    "shipwrecks",
    "shipwreckBatavia",
    "archeology",
    "buildings",
    "staves",
    "furniture",
];

export const subtypeMap = {
    halfModels: "halfModels",
    panelPaintings: "panelPaintings",
    sculptures: "sculptures",
    constructions: "constructions",
    Shipwrecks: "shipwrecks",
    shipwreckBatavia: "shipwreckBatavia",
    archeology: "archeology",
    Buildings: "buildings",
    staves: "staves",
    furniture: "furniture",
};

export const colorScale = scaleOrdinal()
    .domain(objectTypes)
    .range(schemeCategory10);