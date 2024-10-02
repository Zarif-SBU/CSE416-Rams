import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, TileLayer} from 'react-leaflet';
import {statesData} from "./data"
import 'leaflet/dist/leaflet.css';
import './App.css';
import InfoPanel from './InfoPanel';


const centerLouisiana = [30.38592258905744, -86.76937811139156];
const centerNewJersey = [40.220596, -71.769913];
const centerDefault = [38.697719608746134, -93.89299027955271];

const zoomLevels = {
  louisiana: 7,
  newjersey: 8.3,
  default: 4.5,
};

const defaultZoom = 4.5

export default function App() {
  const [geojsonData1, setGeojsonData1] = useState(null);
  const [geojsonData2, setGeojsonData2] = useState(null);
  const [currentMap, setCurrentMap] = useState('home');
  const [highlightedFeature, setHighlightedFeature] = useState(null);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [showTileLayer, setShowTileLayer] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const mapRef = useRef();

  useEffect(() => {
    if (currentMap === 'louisiana') {
      fetch('/LADistricts.json')
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
      fetch('/NJDistricts.geojson')
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
    fillOpacity: highlightedFeature === feature ? 0.7 : 0.5
  });

  const defaultStateStyle = {
    fillColor: '#ffffff',
    color: '#ffffff',
    weight: 3,
    opacity: 1,
    fillOpacity: 0,
  };


  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => {
        setHighlightedFeature(feature);
      },
      mouseout: () => {
        setHighlightedFeature(null);
      },
      click: ()=>{
        console.log("test");
        const stateName = feature.properties.NAME20;
        const stateNameNJ= feature.properties.NAME
        console.log(feature);
        if (stateName === 'Louisiana' || stateNameNJ === 'Louisiana') {
          handleSelection('louisiana');
        } else if (stateNameNJ === 'New Jersey' || stateName === 'New Jersey') {
          handleSelection('newjersey');
        }
      },
    });
  };

  const onEachStateFeature = (feature, layer) => {
    layer.on({
        mouseover: () => {
            setHighlightedFeature(feature);
        },
        mouseout: () => {
            setHighlightedFeature(null);
        },
        click: () => {
            console.log(`${feature.properties.name} was clicked.`);
            const stateName = feature.properties.name; 
            if (stateName === 'Louisiana') {
                handleSelection('louisiana');
            } else if (stateName === 'New Jersey') {
                handleSelection('newjersey');
            }
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
    fillColor:'#FF0000',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: selectedState === 'Louisiana' ? 0 : 1,
  };

  const getNewJerseyFeature = (data) => {
    return data.features.find(
      (feature) => feature.properties.name === 'New Jersey'
    );
  };
  
  const newJerseyFeature = getNewJerseyFeature(statesData);
  

  const newJerseyStyle = {
    fillColor:'#0000ff',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: selectedState === 'New Jersey' ? 0 : 1,
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
      setSelectedState("Louisiana");
      centerMap(centerLouisiana, zoomLevels.louisiana);
      setShowTileLayer(true);
      setIsInfoVisible(true);
    } else if (selection === 'newjersey') {
      setCurrentMap('newjersey');
      setSelectedState("New Jersey");
      centerMap(centerNewJersey, zoomLevels.newjersey);
      setShowTileLayer(true);
      setIsInfoVisible(true);
    } else {
      setCurrentMap('home');
      setSelectedState('');
      centerMap(centerDefault, zoomLevels.default);
      setShowTileLayer(false);
      setIsInfoVisible(false);
    }
  };

  useEffect(() => {
    const acc = document.getElementsByClassName('accordion')[0];
    const panel = document.getElementsByClassName('panel')[0];

    if (acc && panel) {
      const togglePanel = () => {
        if (panel.style.display === 'block') {
          panel.style.display = 'none';
        } else {
          panel.style.display = 'block';
        }
      };

      acc.addEventListener('click', togglePanel);

      return () => {
        acc.removeEventListener('click', togglePanel);
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

        <div className='logoDiv'>
          <img src="/la_rams_logo.jpeg" alt="la rams logo" class="ramsLogo"/>
        </div>

        <div className="homeButtonDiv">
          <button className="Homebutton" onClick={() => handleSelection(null)}>Home</button>
        </div>

        <div className="dropdown">
          <button className="accordion" onClick={toggleAccordion}>
            <span className="right-icon" style={{ transform: isAccordionOpen ? 'rotate(-135deg)' : 'rotate(-45deg)', transition: 'transform 0.3s' }}></span>
            <span className="left-icon" style={{ transform: isAccordionOpen ? 'rotate(135deg)' : 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
            States
          </button>
          <ul className="panel">
            <li>
              <button className="dropdownButtons" onClick={() => handleSelection('louisiana')}>
                Louisiana
              </button>
            </li>
            <li>
              <button className="dropdownButtons" onClick={() => handleSelection('newjersey')}>
                New Jersey
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isInfoVisible && (
        <InfoPanel stateName={selectedState}/>
      )}

      <div className='siteBody'>
      <div className={`map-container ${isInfoVisible ? 'map-shrink' : ''}`}>
        <div className='welcomeDiv'>
            Welcome! Click on a state to get started.
        </div>
        <MapContainer
          ref={mapRef}
          center={centerDefault}
          zoom={defaultZoom}
          style={{ width: '91.6vw', height: '100vh' }}
          dragging={false}
          zoomControl={false}
          doubleClickZoom = {false}
          scrollWheelZoom = {false}
          id = 'my-leaflet-map'
        >
          {currentMap === 'louisiana' && geojsonData1 && (
            <GeoJSON data={geojsonData1} style={getFeatureStyle} onEachFeature={onEachFeature} />
          )}
          {currentMap === 'newjersey' && geojsonData2 && (
            <GeoJSON data={geojsonData2} style={getFeatureStyle} onEachFeature={onEachFeature} />
          )}

          <GeoJSON data={statesData.features} style={defaultStateStyle} onEachFeature={onEachStateFeature} />

          {newJerseyFeature && (
            <GeoJSON
              data={newJerseyFeature}
              style={newJerseyStyle}
              onEachFeature={onEachStateFeature}
            />
          )}

          {LAFeature && (
            <GeoJSON
              data={LAFeature}
              style={LAStyle}
              onEachFeature={onEachStateFeature}
            />
          )}

          {showTileLayer && (
            <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=BfOpNGWVgiTaOlbblBv9" attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
              />
          )}
        </MapContainer>
        </div>
      </div>
    </div>
  );
}
