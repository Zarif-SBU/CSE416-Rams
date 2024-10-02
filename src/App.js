import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const centerLouisiana = [32.38592258905744, -92.76937811139156];
const centerNewJersey = [40.220596, -74.769913];
const centerDefault = [38.57500863746481, -99.81979025341272];

const defaultZoom = 4.5;
const stateZoom = 7;

export default function App() {
  const [geojsonData1, setGeojsonData1] = useState(null);
  const [geojsonData2, setGeojsonData2] = useState(null);
  const [geojsonData3, setGeojsonData3] = useState(null);
  const [geojsonData4, setGeojsonData4] = useState(null);
  const [currentMap, setCurrentMap] = useState('home');
  const [highlightedFeature, setHighlightedFeature] = useState(null);
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const mapRef = useRef();


  useEffect(() => {
    if (currentMap === 'louisiana') {
      fetch('/la_gen_2022_prec.geojson')
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
      fetch('/nj_race_2021_bg.geojson')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData2(data);
          console.log('New Jersey GeoJSON loaded:', data);
        })
        .catch((error) => console.error('Error loading GeoJSON 2:', error));
    }
  }, [currentMap]);

  useEffect(() => {
    if (currentMap === 'home') {
      fetch('/NJBoundary.json')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData3(data);
          console.log('New Jersey GeoJSON loaded:', data);
        })
        .catch((error) => console.error('Error loading GeoJSON 2:', error));
    }
  }, [currentMap]);

  useEffect(() => {
    if (currentMap === 'home') {
      fetch('/LABoundary.json')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData4(data);
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
            <li><button className="dropdownButtons" id="LAdiv" onClick={() => handleSelection('louisiana')}>Louisiana</button></li>
            <li><button className="dropdownButtons" id="NJdiv" onClick={() => handleSelection('newjersey')}>New Jersey</button></li>
          </ul>
        </div>
      </div>

      <div className='siteBody'>
        <div className="map-container">
          <div className='welcomeDiv'>
            Welcome! Click on a state to get started.
          </div>
          
          <MapContainer
            ref={mapRef}
            center={centerDefault}
            zoom={defaultZoom}
            style={{ width: '91.6vw', height: '100vh' }}
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

            {currentMap === 'home' && geojsonData3 && (
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
            )}
            <TileLayer
              url = "https://api.maptiler.com/maps/bright-v2/256/{z}/{x}/{y}.png?key=BfOpNGWVgiTaOlbblBv9"
              attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
