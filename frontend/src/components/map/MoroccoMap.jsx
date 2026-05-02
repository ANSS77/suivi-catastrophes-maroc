import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MoroccoMap() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetching a public GeoJSON for Morocco regions
    // This is a placeholder URL - for production, you should host your own GeoJSON
    fetch('https://raw.githubusercontent.com/isat-ma/morocco-geojson/master/regions.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading GeoJSON:", err));
  }, []);

  const moroccoCenter = [31.7917, -7.0926];
  const zoomLevel = 6;

  const regionStyle = {
    fillColor: '#C05D2E',
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.1,
  };

  const onEachRegion = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.4,
          weight: 2,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(regionStyle);
      },
    });
    
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { sticky: true });
    }
  };

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
      <MapContainer
        center={moroccoCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={regionStyle}
            onEachFeature={onEachRegion}
          />
        )}

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}
