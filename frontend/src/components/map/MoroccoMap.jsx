import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DisasterCard from './DisasterCard';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;

const createDotIcon = (type) => {
  const colors = {
    earthquake: '#EF4444', // Red
    flood: '#3B82F6',      // Blue
    wildfire: '#F97316'    // Orange
  };
  
  const color = colors[type] || '#888';
  
  return L.divIcon({
    className: 'custom-dot-icon',
    html: `
      <div style="
        width: 16px; 
        height: 16px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%;
        box-shadow: 0 0 15px ${color}88, 0 0 0 8px ${color}22;
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const categoryMap = {
  all: 'all',
  seismes: 'earthquake',
  inondations: 'flood',
  incendies: 'wildfire'
};

export default function MoroccoMap({ disasters, activeCategory }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Salah-Zkara/Morocco-GeoJson/master/Morocco-Regions.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading GeoJSON:", err));
  }, []);

  const moroccoCenter = [28.0, -8.0];
  const zoomLevel = 5;

  const regionStyle = {
    fillColor: '#C05D2E',
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.10,
  };

  const onEachRegion = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.15,
          weight: 2,
          fillColor: '#C05D2E',
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        e.target.setStyle(regionStyle);
      },
    });
    
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name, { sticky: true, className: 'region-tooltip' });
    }
  };

  const filteredDisasters = disasters.filter(d => 
    activeCategory === 'all' || d.type === categoryMap[activeCategory]
  );

  return (
    <div className="w-full h-full rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white bg-white">
      <MapContainer
        center={moroccoCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={regionStyle}
            onEachFeature={onEachRegion}
          />
        )}

        {filteredDisasters.map((disaster, i) => (
          <Marker 
            key={disaster.id || i} 
            position={[disaster.lat, disaster.lng]} 
            icon={createDotIcon(disaster.type)}
          >
            <Popup className="disaster-popup" minWidth={320}>
              <DisasterCard disaster={disaster} />
            </Popup>
          </Marker>
        ))}

        <ZoomControl position="bottomright" />
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 24px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .region-tooltip {
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #C05D2E;
          font-weight: 800;
          font-family: 'Manrope', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}} />
    </div>
  );
}

