// src/lib/data/datafiles/index.js
export const datafiles = {
  'half-models.json': () => import('./half-models.json'),
  'panelPaintings.json': () => import('./panelPaintings.json'),
  'sculptures.json': () => import('./sculptures.json'),
  'constructions.json': () => import('./constructions.json'),
  'shipwrecks.json': () => import('./shipwrecks.json'),
  'shipwreckBatavia.json': () => import('./shipwreckBatavia.json'),
  'archeology.json': () => import('./archeology.json'),
  'buildings.json': () => import('./buildings.json'),
  'staves.json': () => import('./staves.json'),
  'furniture.json': () => import('./furniture.json'),
};