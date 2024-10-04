import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, TileLayer} from 'react-leaflet';
import {statesData} from "./data"
import 'leaflet/dist/leaflet.css';
import './App.css';
import InfoPanel from './InfoPanel';
import Tab from './Tab';
import Legend from './Legend';
import Papa from 'papaparse';

const centerLouisiana = [30.38592258905744, -84.96937811139156];
const centerNewJersey = [40.220596, -71.369913];
const centerDefault = [38.697719608746134, -91.89299027955271];

const zoomLevels = {
  louisiana: 7,
  newjersey: 8.4,
  default: 4.5,
};

let allVoteData = [];
// let allVoteData2 = [];

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
  const [isMinimized, setMinimizeSidebar] = useState(false);
  const [currArea, setCurrArea] = useState(null);
  const [fakecurrArea, setFakeCurrArea] = useState(null)
  const[isLegendVisible, setLegendVisible] = useState(false);
  const [allVoteData2, setAllVoteData2] = useState([]);
  const [minorityDensityDataLA, setMinorityDensityDataLA] = useState([]);
  const[isIncomeLegend, setIncomeLegend]=useState("voting");
  const [isAllIncomeData, setisAllIncomeData] = useState([]);
  const [isAllIncomeData2, setisAllIncomeData2] = useState([]);
  const [minorityDensityDataNJ, setMinorityDensityDataNJ] = useState([]);

  let allVoteData = [];
  let allIncomeData=[];
  
  const changeLegendColorIncome =()=>{
      setIncomeLegend("income");
  };

  const changeLegendColorVoting=()=>{
      setIncomeLegend('voting');
  };

  const changeLegendColorRace=()=>{
      setIncomeLegend("race")
  }

  const mapRef = useRef();

  const loadDataLAIncome = () => {
    const csvFilePath = 'LA_District_income_2020_data_2.csv';

    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
          const incomeData = result.data.map(row => ({
            district: row['Geography'],
            houseHoldIncomeRange: parseFloat(row['ID Household Income Bucket']),
          }));
          resolve(incomeData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const loadDataNJIncome = () => {
    const csvFilePath = 'NJ_District_income_2020_data_2.csv';

    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
          const incomeData = result.data.map(row => ({
            district: row['Geography'],
            houseHoldIncomeRange: parseFloat(row['ID Household Income Bucket']),
          }));
          resolve(incomeData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  const loadData = () => {
    const csvFilePath = 'LA_Precinct_Voting_Data.csv';
  
    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
  
          const voteData = result.data.map(row => ({
            precinct: row['Precinct'],
            bidenVote: parseFloat(row['BIDEN']),
            trumpVote: parseFloat(row['TRUMP'])
          }));
  

          resolve(voteData);
        },
        error: (error) => {

          reject(error);
        }
      });
    });
  };

  const loadData2 = () => {
    const csvFilePath = 'NJ_Precinct_Voting_Data.csv';
  
    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
  
          const voteData2 = result.data.map(row => ({
            mun_name: row['MUN_NAME'],
            ward_code: row['WARD_CODE'],
            elecd_code: row['ELECD_CODE'],
            bidenVote: parseFloat(row['BIDEN']),
            trumpVote: parseFloat(row['TRUMP'])
          }));
  
          // console.log(allVoteData2)
          resolve(voteData2);
        },
        error: (error) => {

          reject(error);
        }
      });
    });
  };

  loadDataLAIncome()
  .then(incomeData => {
    // allIncomeData = incomeData;
    setisAllIncomeData(incomeData)
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

  loadDataNJIncome()
  .then(incomeData2 => {
    // allIncomeData = incomeData;
    setisAllIncomeData2(incomeData2)
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
  const loadData_Minority_LA = () => {
    const csvFilePath = 'LA_District_Minority_Density.csv';
  
    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
  
          const minorityData = result.data.map(row => ({
            district: row['Location'],
            minorityPercent: parseFloat(row['Minority Density']),
          }));
  

          resolve(minorityData);
        },
        error: (error) => {

          reject(error);
        }
      });
    });
  };

  const loadData_Minority_NJ = () => {
    const csvFilePath = 'NJ_District_Minority_Density.csv';
  
    return new Promise((resolve, reject) => {
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
  
          const minorityData = result.data.map(row => ({
            district: row['Location'],
            minorityPercent: parseFloat(row['Minority Density']),
          }));
  

          resolve(minorityData);
        },
        error: (error) => {

          reject(error);
        }
      });
    });
  };

  loadData()
  .then(voteData => {
    allVoteData = voteData;
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

  loadData2()
  .then(voteData2 => {
    // console.log(allVoteData2)
    setAllVoteData2(voteData2)
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

  loadData_Minority_LA()
  .then(minorityData => {
    setMinorityDensityDataLA(minorityData);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

  loadData_Minority_NJ()
  .then(minorityData => {
    setMinorityDensityDataNJ(minorityData);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

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

  const handleArrowClick = (isMinimized) => {
    if (isMinimized) {
      if (selectedState === 'Louisiana') {
        centerMap([30.98592258905744, -90.96937811139156], 8);
      } else if (selectedState === 'New Jersey') {
        centerMap([40.220596, -74.369913], 8.4);
      }
    } else {

      if (selectedState === 'Louisiana') {
        centerMap(centerLouisiana, zoomLevels.louisiana);
      } else if (selectedState === 'New Jersey') {
        centerMap(centerNewJersey, zoomLevels.newjersey);
      }
      else{
        centerMap(centerDefault, zoomLevels.default)
      }
    }
  };

  const fetchLAPrecinctsData = () => {
    fetch('la_gen_2022_prec.geojson')
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

  const getDistrictLAStyleIncome = (feature) => {
    let districtName = feature.properties.name;
    let color="";
    
    isAllIncomeData.forEach(data => {
      // console.log(`district: ${data.district}, Range: ${data.houseHoldIncomeRange}`);
        if (districtName === (data.district)) {

        if (data.houseHoldIncomeRange < 2) {
            color = "a";
        } else if (data.houseHoldIncomeRange < 5) {
            color = "b";
        } else if (data.houseHoldIncomeRange < 8) {
            color = "c";
        } else if (data.houseHoldIncomeRange < 11) {
            color = 'd';
        } else if (data.houseHoldIncomeRange < 14) {
            color = 'e';
        } else if (data.houseHoldIncomeRange > 14) {
            color = 'f';
        }

        }
    });

    return {
        fillColor: color === 'a' ? '#99ccff' : color === 'b' ? '#6699ff' : 
        color === 'c' ? '#3366ff' : 
        color === 'd' ? '#3333ff' : 
        color === 'e' ? '#000066' : 
        color === 'f' ? '#00001a' : 'white',
        color: '#000000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.6,
    };
  }

  const getDistrictNJStyleIncome =(feature) =>{
    let districtName = feature.properties.DISTRICT;
    let color="";
    
    isAllIncomeData2.forEach(data => {
        if (("District "+districtName) === (data.district)) {

        if (data.houseHoldIncomeRange < 2) {
            color = "a";
        } else if (data.houseHoldIncomeRange < 5) {
            color = "b";
        } else if (data.houseHoldIncomeRange < 8) {
            color = "c";
        } else if (data.houseHoldIncomeRange < 11) {
            color = 'd';
        } else if (data.houseHoldIncomeRange < 14) {
            color = 'e';
        } else if (data.houseHoldIncomeRange > 14) {
            color = 'f';
        }

        }
    });

    return {
        fillColor: color === 'a' ? '#99ccff' : color === 'b' ? '#6699ff' : 
        color === 'c' ? '#3366ff' : 
        color === 'd' ? '#3333ff' : 
        color === 'e' ? '#000066' : 
        color === 'f' ? '#00001a' : 'white',
        color: '#000000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.6,
    };
  }
  //RACE COLORING FOR LA
  const getFeatureStyle_Race_Heat_Map_LA = (feature) => {
    let districtName = feature.properties.name;
    let color = "";
    // console.log(districtName);
    minorityDensityDataLA.forEach(data => {
      if(districtName === data.district){
        //console.log("MARIOOOOOOOOOOOOOOOOO");
        if(data.minorityPercent > 91)
        {
          color = "A";
        }
        else if(data.minorityPercent > 81)
        {
            color = "B";
        }
        else if(data.minorityPercent > 71)
        {
          color = "C";
        }
        else if(data.minorityPercent > 61)
        {
          color = "D";
        }
        else if(data.minorityPercent > 51)
        {
          color = "E";
        }
        else if(data.minorityPercent > 41)
        {
          color = "F";
        }
        else if(data.minorityPercent > 31)
        {
          color = "G";
        }
        else if(data.minorityPercent > 21)
        {
          color = "H";
        }
        else if(data.minorityPercent > 11)
        {
          color = "I";
        }
        else{
          color = "J";
        }
        return; 
      }
    });
  
    return {
      fillColor: color === 'A' ? '#B33D00' : color === 'B' ? '#CC4D00' : color === 'C' ? '#E65C00' 
      : color === 'D' ? '#FF6A00' : color === 'E' ? '#FF7800' : color === 'F' ? '#FF8F1C' : color === 'G' ? '#FFA84C'
      : color === 'H' ? '#FFC07F' : color === 'I' ? '#FFD194' : color === 'J' ? '#FFE5B4' : '#ffffff',

      color: '#000000',
      weight: 0.5,
      opacity: 1,
      fillOpacity: highlightedFeature === feature ? 0.7 : 0.5,
    };
  };

  const getFeatureStyle_Race_Heat_Map_NJ = (feature) => {
    let districtName = feature.properties.DIST_LABEL;
    let color = "";
    //console.log(districtName);
    //console.log(minorityDensityDataNJ);
    minorityDensityDataNJ.forEach(data => {
      if(districtName === data.district){
        //console.log("MARIOOOOOOOOOOOOOOOOO");
        if(data.minorityPercent > 91)
        {
          color = "A";
        }
        else if(data.minorityPercent > 81)
        {
            color = "B";
        }
        else if(data.minorityPercent > 71)
        {
          color = "C";
        }
        else if(data.minorityPercent > 61)
        {
          color = "D";
        }
        else if(data.minorityPercent > 51)
        {
          color = "E";
        }
        else if(data.minorityPercent > 41)
        {
          color = "F";
        }
        else if(data.minorityPercent > 31)
        {
          color = "G";
        }
        else if(data.minorityPercent > 21)
        {
          color = "H";
        }
        else if(data.minorityPercent > 11)
        {
          color = "I";
        }
        else{
          color = "J";
        }
        return; 
      }
    });
  
    return {
      fillColor: color === 'A' ? '#B33D00' : color === 'B' ? '#CC4D00' : color === 'C' ? '#E65C00' 
      : color === 'D' ? '#FF6A00' : color === 'E' ? '#FF7800' : color === 'F' ? '#FF8F1C' : color === 'G' ? '#FFA84C'
      : color === 'H' ? '#FFC07F' : color === 'I' ? '#FFD194' : color === 'J' ? '#FFE5B4' : '#ffffff', color: '#000000',

      weight: 0.5,
      opacity: 1,
      fillOpacity: highlightedFeature === feature ? 0.7 : 0.5,
    };
  };

  const getPrecinctStyle = (feature) => {
    let precinctname = feature.properties.Parish + " " + feature.properties.Precinct;
    let name = " ";

    // console.log(precinctname)

    allVoteData.forEach(data => {
      // console.log(`Precinct: ${data.precinct}, Biden Votes: ${data.bidenVote}, Trump Votes: ${data.trumpVote}`);

      if(precinctname === data.precinct){
        if(data.bidenVote > data.trumpVote)
        {
          name = "Biden";
        }
        else
        {
          name = "Trump"
        }
        return; 
      }
    });

    // console.log(allVoteData)

    // console.log(name)

    return {
      fillColor: name === 'Trump' ? 'red' : name === 'Biden' ? 'blue' : '#ffffff',
      color: '#000000',
      weight: 0.5,
      opacity: 1,
      fillOpacity: highlightedFeature === feature ? 0.7 : 0.5,
    };
  }

  const getPrecinctStyle2 = (feature) => {
    let precinctname = feature.properties.MUN_NAME + " " + feature.properties.WARD_CODE + " " + feature.properties.ELECD_CODE;
    let name = " ";

    // console.log(precinctname)
    // console.log(allVoteData2)

    allVoteData2.forEach(data => {
      // console.log(`Precinct: ${data.precinct}, Biden Votes: ${data.bidenVote}, Trump Votes: ${data.trumpVote}`);
      // console.log()
      let testname = data.mun_name + " " + data.ward_code + " " + data.elecd_code;
      if(precinctname === testname){
        if(data.bidenVote > data.trumpVote)
        {
          name = "Biden";
        }
        else
        {
          name = "Trump"
        }
        return; 
      }
    });

    // console.log(allVoteData)

    // console.log(name)

    return {
      fillColor: name === 'Trump' ? 'red' : name === 'Biden' ? 'blue' : '#ffffff',
      color: '#000000',
      weight: 0.5,
      opacity: 1,
      fillOpacity: highlightedFeature === feature ? 0.7 : 0.5,
    };
  }

  const defaultStateStyle = (feature) => ({
    fillColor: '#ffffff',
    color: '#ffffff',
    weight: 3,
    opacity: 1,
    fillOpacity: 0,
  });


  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: () => {
        setHighlightedFeature(feature);
        
        if (feature.properties.DISTRICT) {
          setFakeCurrArea('District ' + feature.properties.DISTRICT);
        } 
        if (feature.properties.name) {
          setFakeCurrArea(feature.properties.name.replace("Congressional", "").trim());
        }
      },
      mouseout: () => {
        setHighlightedFeature(null);
        setFakeCurrArea('')
      },
      click: () => {
        console.log("test");
        const stateName = feature.properties.NAME20;
        const stateNameNJ = feature.properties.NAME;
        if (stateName === 'Louisiana' || stateNameNJ === 'Louisiana') {
          handleSelection('louisiana');
        } else if (stateNameNJ === 'New Jersey' || stateName === 'New Jersey') {
          handleSelection('newjersey');
        }

        if (feature.properties.DISTRICT) {
          setCurrArea('District ' + feature.properties.DISTRICT);
        } 
        if (feature.properties.name) {
          setCurrArea(feature.properties.name.replace("Congressional", "").trim());
        }

        if (feature.properties.DISTRICT) {
          setCurrArea('District ' + feature.properties.DISTRICT);
        }
        if (feature.properties.name) {
          setCurrArea(feature.properties.name.replace("Congressional", "").trim());
        }
      },
    });
  
    // Tooltip bindings remain the same
    if (feature.properties.DISTRICT) {
      layer.bindTooltip("District " + feature.properties.DISTRICT, {
        permanent: false,
        direction: 'top',
      });
    } else if (feature.properties.name) {
      layer.bindTooltip(feature.properties.name.replace("Congressional", "").trim(), {
        permanent: false,
        direction: 'top',
      });
    }
  };
  

const onEachStateFeature = (feature, layer) => {
  const handleClick = () => {
    if (selectedState) {
      return;
    }

    console.log(`${feature.properties.name} was clicked.`);
    const stateName = feature.properties.name;

    if (stateName === 'Louisiana') {
      handleSelection('louisiana');
    } else if (stateName === 'New Jersey') {
      handleSelection('newjersey');
    }

    layer.off('click', handleClick);
  };

  layer.on({
    mouseover: () => {
      setHighlightedFeature(feature);
    },
    mouseout: () => {
      setHighlightedFeature(null);
    },
    click: handleClick,
  });

  layer._handleClick = handleClick;
};

const resetStateClickHandlers = () => {

  if (mapRef.current) {
    mapRef.current.eachLayer((layer) => {

      if (layer._handleClick) {
        layer.on('click', layer._handleClick);
      }
    });
  }
};

const onEachPrecinctFeature = (feature, layer) => {
  layer.on({
      mouseover: () => {
          setHighlightedFeature(feature);
          if(feature.properties.MUN_NAME){
            setFakeCurrArea(feature.properties.MUN_NAME + " " + feature.properties.WARD_CODE + " " + feature.properties.ELECD_CODE);
          }
          else if(feature.properties.Precinct){
            setFakeCurrArea(feature.properties.Parish + " " + feature.properties.Precinct);
          }
      },
      mouseout: () => {
        setHighlightedFeature(null);
        setFakeCurrArea('')
      },
      click: () => {
        console.log(selectedState)
        if(feature.properties.MUN_NAME){
          setCurrArea(feature.properties.MUN_NAME + " " + feature.properties.WARD_CODE + " " + feature.properties.ELECD_CODE);
        } 
        else if(feature.properties.Precinct){
          setCurrArea(feature.properties.Parish + " " + feature.properties.Precinct);
        }
      },
  });
  if (feature.properties && feature.properties.MUN_NAME) {
    layer.bindTooltip(feature.properties.MUN_NAME + " " + feature.properties.WARD_CODE + " " + feature.properties.ELECD_CODE, {
      permanent: false,
      direction: 'top',
      interactive: false,
    });
  } 
  else if(feature.properties.Precinct){
    layer.bindTooltip(feature.properties.Parish + " " + feature.properties.Precinct, {
      permanent: false,
      direction: 'top',
      interactive: false,
    });
  }
  
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
        duration: 0,
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
      setMinimizeSidebar(true);

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
      setMinimizeSidebar(true);

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
      setMinimizeSidebar(false);
      setLegendVisible(false);
      setPrecinctsDataLA(null);
      setPrecinctsDataNJ(null);
      setShowPrecinctsLA(false);
      setShowPrecinctsNJ(false);
      setIsPrecinctsActive(false);
      setShowDistrictsLA(false);
      setShowDistrictsNJ(false);
      resetStateClickHandlers();
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
      <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>

        <div className={`logoDiv ${isMinimized ? 'minimized' : ''}`}>
          <img src="/la_rams_logo.jpeg" alt="la rams logo" class="ramsLogo"/>
        </div>

        <div className={`homeButtonDiv ${isMinimized ? 'minimized' : ''}`}>
          <button className={`Homebutton ${isMinimized ? 'minimized' : ''}`} onClick={() => handleSelection(null)}>
            <div className={`homeButtonIconDiv ${isMinimized ? 'minimized' : ''}`}>
            <img
              src="/home_icon.png"
              alt="home icon"
              className={`homeIcon ${isMinimized ? 'minimized' : ''}`}
              onClick={() => handleSelection(null)}
            />
            </div>
            {!isMinimized && (
              <span>Home</span>
              )}
            </button>
        </div>

        <div className={`dropdown ${isMinimized ? 'minimized' : ''}`}>
          <button className={`accordion ${isMinimized ? 'minimized' : ''}`} onClick={toggleAccordion}>
            <span className={`right-icon ${isMinimized ? 'minimized' : ''}`} style={{ transform: isAccordionOpen ? 'rotate(-135deg)' : 'rotate(-45deg)', transition: 'transform 0.3s' }}></span>
            <span className={`left-icon ${isMinimized ? 'minimized' : ''}`} style={{ transform: isAccordionOpen ? 'rotate(135deg)' : 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
            {!isMinimized && (
              <span>States</span>
            )}
          </button>
          <ul className={`panel ${isMinimized ? 'minimized' : ''}`}>
            <li>
              <button className={`dropdownButtons louisiana-button${isMinimized ? 'minimized' : ''}`} onClick={() => handleSelection('louisiana')}>
                {!isMinimized && (
                <span>Louisiana</span>
                )}
                {isMinimized && (
                <span>LA</span>
                )}
              </button>
            </li>
            <li>
              <button className={`dropdownButtons newjersey-button${isMinimized ? 'minimized' : ''}`} onClick={() => handleSelection('newjersey')}>
                {!isMinimized && (
                <span>New Jersey</span>
                )}
                {isMinimized && (
                <span>NJ</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isInfoVisible && (
        <InfoPanel stateName={selectedState}
        currArea={currArea}
        currState={selectedState}
        handleArrowClick={handleArrowClick}
        legendColorBtn={changeLegendColorIncome}/>

      )}
      
      <Tab 
        isVisible={isTabVisible} 
        stateName={selectedState} 
        onPrecinctsClickLA={handlePrecinctsClickLA}
        onPrecinctsClickNJ={handlePrecinctsClickNJ}
        onDistrictsClick={handleDistrictsClick}
        fakecurrArea={fakecurrArea}
        changeLegendIncome={changeLegendColorIncome}
        changeVotingColor={changeLegendColorVoting}
        changeLegendColor={changeLegendColorRace}
      />

      <Legend isVisible={isLegendVisible}
      legendColor={isIncomeLegend} />

      <div className={`siteBody ${isInfoVisible ? 'siteBody-shrink' : ''}`}>
      <div className='map-container'>
        
      {showWelcome && (
            <div className='welcomeDiv'>
              Welcome! Click on a state to get started.
            </div>
          )}
        <MapContainer
          /*key={`${showDistrictsLA}-${showDistrictsNJ}`}*/
          ref={mapRef}
          center={centerDefault}
          zoom={defaultZoom}
          style={{ width: '100vw', height: '100vh' }}
          dragging={true}
          zoomControl={false}
          doubleClickZoom = {false}
          scrollWheelZoom = {true}
          id = 'my-leaflet-map'
        >

          {showDistrictsLA && geojsonData1 && (
            <GeoJSON data={geojsonData1} style={isIncomeLegend === "income" ? getDistrictLAStyleIncome :
              isIncomeLegend === "voting" ? getFeatureStyle :
              isIncomeLegend === "race" ? getFeatureStyle_Race_Heat_Map_LA : null} onEachFeature={onEachFeature} />
          )}



          {showDistrictsNJ && geojsonData2 && (
            <GeoJSON data={geojsonData2} style={isIncomeLegend === "income" ? getDistrictNJStyleIncome :
              isIncomeLegend === "voting" ? getFeatureStyle :
              isIncomeLegend === "race" ? getFeatureStyle_Race_Heat_Map_NJ : null} onEachFeature={onEachFeature} />
          )}

          {showPrecinctsLA && precinctsDataLA && (
          <GeoJSON data={precinctsDataLA} style={getPrecinctStyle} onEachFeature={onEachPrecinctFeature} />
          )}
          {showPrecinctsNJ && precinctsDataNJ && (
          <GeoJSON data={precinctsDataNJ} style={getPrecinctStyle2} onEachFeature={onEachPrecinctFeature} />
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
