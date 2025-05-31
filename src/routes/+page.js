// +page.js
import { PUBLIC_ARCGIS_API_KEY } from '$env/static/public';

export function load() {
  return {
    arcgisApiKey: PUBLIC_ARCGIS_API_KEY
  };
}
