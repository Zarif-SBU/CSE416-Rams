import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './DraggableItem';
import DropZone from './DropZone';
import 'leaflet/dist/leaflet.css';
import './App.css';

const centerLouisiana = [30.45097695746098, -91.18614391145893];
const centerNewJersey = [40.220596, -74.769913];

export default function App() {
  const [geojsonData1, setGeojsonData1] = useState(null);
  const [geojsonData2, setGeojsonData2] = useState(null);
  const [currentMap, setCurrentMap] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (currentMap === 'louisiana') {
      // Fetch the Louisiana GeoJSON file
      fetch('/la_gen_2022_prec.geojson')
        .then(response => response.json())
        .then(data => {
          setGeojsonData1(data);
          console.log('Louisiana GeoJSON loaded:', data); // Log Louisiana data
        })
        .catch(error => console.error('Error loading GeoJSON 1:', error));
    }
  }, [currentMap]);

  useEffect(() => {
    if (currentMap === 'newjersey') {
      // Fetch the New Jersey GeoJSON file
      fetch('/nj_race_2021_bg.geojson')
        .then(response => response.json())
        .then(data => {
          setGeojsonData2(data);
          console.log('New Jersey GeoJSON loaded:', data); // Log New Jersey data
        })
        .catch(error => console.error('Error loading GeoJSON 2:', error));
    }
  }, [currentMap]);

  // Define a style for the GeoJSON features
  const getFeatureStyle = () => ({
    color: '#3388ff', // Default color
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  });

  // Function to center the map on the selected state
  const centerMap = (center) => {
    if (mapRef.current) {
      mapRef.current.setView(center, 7, {
        animate: true,
        duration: 1.5,
      });
    }
  };

  const handleDrop = (item) => {
    if (item.name === 'Louisiana') {
      setCurrentMap('louisiana');
      centerMap(centerLouisiana);
    } else if (item.name === 'New Jersey') {
      setCurrentMap('newjersey');
      centerMap(centerNewJersey);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <div className="sidebar">
          <DraggableItem name="Louisiana" />
          <DraggableItem name="New Jersey" />
        </div>
        <DropZone onDrop={handleDrop} />
        {currentMap && (
          <MapContainer
            ref={mapRef}
            center={currentMap === 'louisiana' ? centerLouisiana : centerNewJersey}
            zoom={7}
            style={{ width: '80vw', height: '60vh' }} // Adjust the size here
          >
            {/* Render the appropriate GeoJSON based on the current map state */}
            {currentMap === 'louisiana' && geojsonData1 && (
              <GeoJSON data={geojsonData1} style={getFeatureStyle} />
            )}
            {currentMap === 'newjersey' && geojsonData2 && (
              <GeoJSON data={geojsonData2} style={getFeatureStyle} />
            )}
          </MapContainer>
        )}
      </div>
    </DndProvider>
  );
}
