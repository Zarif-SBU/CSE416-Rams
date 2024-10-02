import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON} from 'react-leaflet';
import {statesData} from "./data"
import 'leaflet/dist/leaflet.css';
import './App.css';

const centerLouisiana = [32.38592258905744, -92.76937811139156];
const centerNewJersey = [40.220596, -74.769913];
const centerDefault = [41.697719608746134, -95.99299027955271];

const defaultZoom = 4.5;
const stateZoom = 7;

export default function App() {
  const [geojsonData1, setGeojsonData1] = useState(null);
  const [geojsonData2, setGeojsonData2] = useState(null);
  const [currentMap, setCurrentMap] = useState('home');
  const [highlightedFeature, setHighlightedFeature] = useState(null);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const mapRef = useRef();


  useEffect(() => {
    if (currentMap === 'louisiana') {
      fetch('/LAPrecincts2.json')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData1(data);
          console.log('Louisiana GeoJSON loaded:', data);
        })
        .catch((error) => console.error('Error loading GeoJSON 1:', error));
    }
  }, [currentMap]);


  useEffect(() => {
    if (currentMap === 'newjersey') {
      fetch('/NJPrecincts2.geojson')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData2(data);
          console.log('New Jersey GeoJSON loaded:', data);
        })
        .catch((error) => console.error('Error loading GeoJSON 2:', error));
    }
  }, [currentMap]);

  const getFeatureStyle = (feature) => ({
    color: highlightedFeature === feature ? 'red' : '#3388ff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  });

  const defaultStateStyle = {
    fillColor: '#ffffff',
    color: '#000000',
    weight: 3,
    opacity: 1,
    fillOpacity: 1,
  };


  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => {
        setHighlightedFeature(feature);
      },
      mouseout: () => {
        setHighlightedFeature(null);
      },
    });
  };

  const getLAFeature = (data) => {
    return data.features.find(
      (feature) => feature.properties.name === 'Louisiana'
    );
  };
  
  const LAFeature = getLAFeature(statesData);
  

  const LAStyle = {
    fillColor: '#FF0000',
    color: '#000000',
    weight: 2,
    opacity: 1,
    fillOpacity: 1,
  };

  const getNewJerseyFeature = (data) => {
    return data.features.find(
      (feature) => feature.properties.name === 'New Jersey'
    );
  };
  
  const newJerseyFeature = getNewJerseyFeature(statesData);
  

  const newJerseyStyle = {
    fillColor: '#0000ff',
    color: '#000000',
    weight: 2,
    opacity: 1,
    fillOpacity: 1,
  };

  const centerMap = (center, zoom) => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom, {
        animate: true,
        duration: 3,
      });
    }
  };


  const handleSelection = (selection) => {
    if (selection === 'louisiana') {
      setCurrentMap('louisiana');
      centerMap(centerLouisiana, stateZoom);
    } else if (selection === 'newjersey') {
      setCurrentMap('newjersey');
      centerMap(centerNewJersey, stateZoom);
    } else {
      setCurrentMap('home'); 
      centerMap(centerDefault, defaultZoom);
    }
  };

  useEffect(() => {
    const acc = document.getElementsByClassName("accordion")[0];
    const panel = document.getElementsByClassName("panel")[0];


    if (acc && panel) {
      const togglePanel = () => {
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      };

      acc.addEventListener("click", togglePanel);


      return () => {
        acc.removeEventListener("click", togglePanel);
      };
    }
  }, []);

  const toggleAccordion = () => {
    setAccordionOpen((prev) => !prev);
  };


  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 0);
    }
  }, [currentMap]); 

  return (
    <div className="app-container">
      <div className="sidebar">
        <div>
          <button className="Homebutton" onClick={() => handleSelection(null)}>Home</button>
        </div>
        <div className="dropdown">
          <button className="accordion" onClick={toggleAccordion}>States
          <span className="right-icon" style={{ transform: isAccordionOpen ? 'rotate(135deg)' : 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
          <span className="left-icon" style={{ transform: isAccordionOpen ? 'rotate(-135deg)' : 'rotate(-45deg)', transition: 'transform 0.3s' }}></span>
          </button>
          <ul className="panel">
            <li><button className="dropdownButtons" id="LAdiv" onClick={() => handleSelection('louisiana')}>Louisiana</button></li>
            <li><button className="dropdownButtons" id="NJdiv" onClick={() => handleSelection('newjersey')}>New Jersey</button></li>
          </ul>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          ref={mapRef}
          center={centerDefault}
          zoom={defaultZoom}
          style={{ width: '91.6vw', height: '100vh' }}
          dragging={false}
          zoomControl={false}
          id = 'my-leaflet-map'
        >
          {currentMap === 'louisiana' && geojsonData1 && (
            <GeoJSON
              data={geojsonData1}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )}
          {currentMap === 'newjersey' && geojsonData2 && (
            <GeoJSON
              data={geojsonData2}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )}

          <GeoJSON data={statesData.features} style={defaultStateStyle} />

          {newJerseyFeature && (
            <GeoJSON
              data={newJerseyFeature}
              style={newJerseyStyle}
            />
          )}

          {LAFeature && (
            <GeoJSON
              data={LAFeature}
              style={LAStyle}
            />
          )}

          {/* {currentMap === 'home' && geojsonData3 && (
            <GeoJSON
              data={geojsonData3}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {currentMap === 'home' && geojsonData3 && (
            <GeoJSON
              data={geojsonData4}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )} */}
          {/* <TileLayer
            url = "https://api.maptiler.com/maps/toner-v2/256/{z}/{x}/{y}.png?key=BfOpNGWVgiTaOlbblBv9"
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a></a>'
          /> */}
        </MapContainer>
      </div>
    </div>
  );
}
