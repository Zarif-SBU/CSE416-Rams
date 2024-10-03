import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, TileLayer} from 'react-leaflet';
import {statesData} from "./data"
import 'leaflet/dist/leaflet.css';
import './App.css';
import InfoPanel from './InfoPanel';
import Tab from './Tab';
import Legend from './Legend';


const centerLouisiana = [30.38592258905744, -84.96937811139156];
const centerNewJersey = [40.220596, -71.369913];
const centerDefault = [38.697719608746134, -91.89299027955271];

const zoomLevels = {
  louisiana: 7,
  newjersey: 8.4,
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [precinctsDataLA, setPrecinctsDataLA] = useState(null);
  const [precinctsDataNJ, setPrecinctsDataNJ] = useState(null);
  const [showPrecinctsLA, setShowPrecinctsLA] = useState(false); 
  const [showPrecinctsNJ, setShowPrecinctsNJ] = useState(false);
  const [isPrecinctsActive, setIsPrecinctsActive] = useState(false);
  const [showDistrictsLA, setShowDistrictsLA] = useState(false);
  const [showDistrictsNJ, setShowDistrictsNJ] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [currArea, setCurrArea] = useState(null);
  const[isLegendVisible, setLegendVisible] = useState(false);

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

  const handleDistrictsClick = () => {
    if (selectedState === 'Louisiana') {
      setShowDistrictsLA(true);
      setShowDistrictsNJ(false);
      setShowPrecinctsLA(false);
    } else if (selectedState === 'New Jersey') {
      setShowDistrictsNJ(true);
      setShowDistrictsLA(false);
      setShowPrecinctsNJ(false);
    }
  };

  const fetchLAPrecinctsData = () => {
    fetch('LAPrecincts2.json')
      .then((response) => response.json())
      .then((data) => {
        setPrecinctsDataLA(data);
        setPrecinctsDataNJ(null);
        console.log('Louisiana Precincts GeoJSON loaded:', data);
      })
      .catch((error) => console.error('Error loading Louisiana precincts GeoJSON:', error));
  };

  const handlePrecinctsClickLA = () => {
    if (!showPrecinctsLA) {
        fetchLAPrecinctsData();
    }
    setShowPrecinctsLA(true);
    setIsPrecinctsActive(true);  
    setShowDistrictsLA(false);
};

const handlePrecinctsClickNJ = () => {
  if (!showPrecinctsNJ) {
      fetchNJPrecinctsData();
  }
  setShowPrecinctsNJ(true);
  setIsPrecinctsActive(true);
  setShowDistrictsNJ(false);
};
  
  const fetchNJPrecinctsData = () => {
    fetch('NJPrecincts2.geojson')
      .then((response) => response.json())
      .then((data) => {
        setPrecinctsDataNJ(data);
        setPrecinctsDataLA(null);
        console.log('New Jersey Precincts GeoJSON loaded:', data);
      })
      .catch((error) => console.error('Error loading New Jersey precincts GeoJSON:', error));
  };

  const getFeatureStyle = (feature) => {
    const party = feature.properties.party;
  
    return {
      fillColor: party === 'Republican' ? 'red' : party === 'Democrat' ? 'blue' : '#ffffff',
      color: '#000000',
      weight: 0.5,
      opacity: 1,
      fillOpacity: highlightedFeature === feature ? 0.7 : 0.5,
    };
  };

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
        if (feature.properties && feature.properties.MUN_NAME) {
          setCurrArea(feature.properties.MUN_NAME)
        }
      },
    });
    if (feature.properties && feature.properties.MUN_NAME) {
      layer.bindTooltip(feature.properties.MUN_NAME, {
        permanent: false,
        direction: 'top',
        interactive: false,
      });
    } else if(feature.properties.DISTRICT) {
      layer.bindTooltip("District " + feature.properties.DISTRICT, {
        permanent: false,
        direction: 'top',
        interactive: false,
      });
    }
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

const onEachPrecinctFeature = (feature, layer) => {
  layer.on({
      mouseover: () => {
          setHighlightedFeature(feature);
      },
      mouseout: () => {
          setHighlightedFeature(null);
      },
      click: () => {
          console.log(`${feature.properties.COUNTY} precinct was clicked.`);
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
      setCurrArea("Louisiana")
      centerMap(centerLouisiana, zoomLevels.louisiana);
      setShowTileLayer(true);
      setIsInfoVisible(true);
      setShowWelcome(false);
      setIsTabVisible(true);

      setLegendVisible(true);

      setShowPrecinctsLA(false);
      setShowPrecinctsNJ(false);
      setIsPrecinctsActive(false);
      setShowDistrictsLA(true);

    } else if (selection === 'newjersey') {
      setCurrentMap('newjersey');
      setSelectedState("New Jersey");
      setCurrArea("New Jersey")
      centerMap(centerNewJersey, zoomLevels.newjersey);
      setShowTileLayer(true);
      setIsInfoVisible(true);
      setShowWelcome(false);
      setIsTabVisible(true);

      setLegendVisible(true);

      setShowPrecinctsLA(false);
      setShowPrecinctsNJ(false);
      setIsPrecinctsActive(false);
      setShowDistrictsNJ(true);

    } else {
      setCurrentMap('home');
      setSelectedState('');
      centerMap(centerDefault, zoomLevels.default);
      setShowTileLayer(false);
      setIsInfoVisible(false);
      setShowWelcome(true);
      setIsTabVisible(false);

      setLegendVisible(false);

      setPrecinctsDataLA(null);
      setPrecinctsDataNJ(null);
      setShowPrecinctsLA(false);
      setShowPrecinctsNJ(false);
      setIsPrecinctsActive(false);
      setShowDistrictsLA(false);
      setShowDistrictsNJ(false);
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
        <InfoPanel stateName={selectedState} currArea={currArea}/>
      )}
      
      <Tab 
        isVisible={isTabVisible} 
        stateName={selectedState} 
        onPrecinctsClickLA={handlePrecinctsClickLA}
        onPrecinctsClickNJ={handlePrecinctsClickNJ}
        onDistrictsClick={handleDistrictsClick}
      />

      <Legend isVisible={isLegendVisible} />

      <div className={`siteBody ${isInfoVisible ? 'siteBody-shrink' : ''}`}>
      <div className='map-container'>
        
      {showWelcome && (
            <div className='welcomeDiv'>
              Welcome! Click on a state to get started.
            </div>
          )}
        <MapContainer
          ref={mapRef}
          center={centerDefault}
          zoom={defaultZoom}
          style={{ width: '100vw', height: '100vh' }}
          dragging={isMapDraggable}
          zoomControl={false}
          doubleClickZoom = {false}
          scrollWheelZoom = {false}
          id = 'my-leaflet-map'
        >

          {showDistrictsLA && geojsonData1 && (
            <GeoJSON data={geojsonData1} style={getFeatureStyle} onEachFeature={onEachFeature} />
          )}


          {showDistrictsNJ && geojsonData2 && (
            <GeoJSON data={geojsonData2} style={getFeatureStyle} onEachFeature={onEachFeature} />
          )}

          {showPrecinctsLA && precinctsDataLA && (
          <GeoJSON data={precinctsDataLA} style={getFeatureStyle} onEachFeature={onEachPrecinctFeature} />
          )}
          {showPrecinctsNJ && precinctsDataNJ && (
          <GeoJSON data={precinctsDataNJ} style={getFeatureStyle} onEachFeature={onEachPrecinctFeature} />
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
