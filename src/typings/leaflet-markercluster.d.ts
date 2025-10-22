import * as L from 'leaflet';

declare module 'leaflet' {

  interface MarkerClusterGroup extends L.FeatureGroup {
    addLayer(layer: L.Layer): this;
    removeLayer(layer: L.Layer): this;
    clearLayers(): this;
    getLayers(): L.Layer[];
  }

  
  function markerClusterGroup(options?: any): MarkerClusterGroup;
}
