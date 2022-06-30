/* eslint-disable no-tabs */
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

import CategorizationBox from './Components/CategorizationBox/CategorizationBox';
import CategoriesView from './Components/CategoriesView/CategoriesView';

import DataTable from './Components/DataTable/DataTable';

const brain = require('brain.js'); // import from is not supported by brain.js

function App() {
  const [file, setFile] = useState(); // CSV file to be uploaded
  const [data, setData] = useState(); // parsed data as json object from CSV file
  const [networkJson, setNetworkJson] = useState(undefined); // trained neural network
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [glowFeedbacks, setGlowFeedbacks] = useState([]);
  const [growFeedbacks, setGrowFeedbacks] = useState([]);
  const [categorization, setCategorization] = useState({});
  const [csvData, setCSVData] = useState([]);
  // console.log('glow: ', glowFeedbacks);
  // console.log('grow: ', growFeedbacks);
  // console.log('file: ', file);
  // console.log('data: ', data);
  // console.log('network: ', networkJson);
  // console.log('column: ', selectedColumn);
  // console.log('categorization: ', categorization);
  // console.log('csvData: ', csvData);
  // console.log('category: ', selectedCategory);

  // Create a dictionary of categories and feedbacks
  const categories = [
    'Course Experience',
    'Material',
    'Lecture',
    'Course Structure',
    'Peer Relations',
    'Administration',
    'Support',
    'Technical Topic',
  ];

  // Process parsed CSV
  //   useEffect(() => {
  //     if (data) {
  //       processData();
  //     }
  //   }, [data]);

  // Format categorization data for export
  useEffect(() => {
    const result = Object.entries(categorization).reduce(
      (previousValue, category) => {
        const key = category[0];
        const subArray = category[1];
        // If there is a value, then add the value to the array
        if (subArray.length) {
          // Do something
          const convertedArary = subArray.map((value) => ({ [key]: value }));

          return [...previousValue, ...convertedArary];
        }

        return previousValue;
      },
      []
    );

    setCSVData(result);

    // Object.keys(categorization).forEach((category) => {

    // 	categorization[category].forEach((feedback) => {
    // 		let obj = {};
    // 		obj[category] = feedback;
    // 		csvData.push(obj);
    //

    // 		setCSVData(csvData);
    // 	});
    // });
    // categorization[selectedCategory].forEach((feedback) => {
    // 	let obj = {};
    // 	obj[selectedCategory] = feedback;
    // 	csvExport.push(obj);
    // });
  }, [categorization]);

  const handleAddCategory = (category, feedback) => {
    let categorizedFeedbacks = categorization[category];

    if (
      categorizedFeedbacks.find((item) => {
        return feedback === item;
      })
    )
      return;
    categorizedFeedbacks.push(feedback);

    let newCategorization = {};
    newCategorization[category] = categorizedFeedbacks;

    setCategorization((prevState) => ({
      ...prevState,
      ...newCategorization,
    }));
  };

  const processData = () => {
    // // // Sample Network Training Process
    // const network = new brain.recurrent.LSTM(); // Init network
    // // Import data
    // const hardware_software = require("./data/hardware-software.json");
    // // Preprocess data
    // const trainingData = hardware_software.map((item) => ({
    //   input: item.text,
    //   output: item.category,
    // }));
    // // Train and store network json object as state
    // network.train(trainingData, {
    //   iterations: 10, // very fast but very poor performance
    // });
    // setNetworkJson(network.toJSON());
    // // INSTEAD OF TRAINING: Init new network and load from previous network
    // const newNetwork = new brain.recurrent.LSTM();
    // const preTrainedNetworkJson = require("./models/model.json");
    // if (preTrainedNetworkJson) {
    //   newNetwork.fromJSON(preTrainedNetworkJson);
    // }
    // // Predict
    // const testString = "I like PC.";
    // const output = newNetwork.run(testString);
    //
    //
    //
    // TODO: 1. Define categories for grouping feedbacks
    // 2. Create training data with categorized and non-category feedbacks
    // 3. Train and export network
    // 4. Make predictions on and label each feedback
    // 5. Create a calibration system for miscategorized feedbacks
    // 6. Repeat retraining and evaluating until categorization decently accurate
    // 7. Test on new dataset
  };

  //  TODO: Upload neural netowrk as json
  // const importNetwork = () => {
  // 	if (networkJson) {
  // 		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(networkJson))}`;
  // 		const link = document.createElement("a");
  // 		link.href = jsonString;
  // 		link.download = "model.json";
  // 		link.click();
  // 	}
  // };
  useEffect(() => {
    const obj = {};
    categories.forEach((category) => {
      obj[category] = [];
    });
    setCategorization(obj);
    if (data) {
      processData();
    }
  }, [data]);
  // Download importable neural network as json
  const exportNetwork = () => {
    if (networkJson) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(networkJson)
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'model.json';
      link.click();
    }
  };

  // Upload CSV file
  const fileReader = new FileReader();
  const handleOnChange = (e) => {
    console.log(e.target.file);
    setFile(e.target.files[0]);
  };

  // Parse CSV file
  const displayCSV = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvString = event.target.result;
        const data = Papa.parse(csvString).data;
        setData(data);
      };
      fileReader.readAsText(file);
    }
  };

  const handleOnClear = () => {
    setData(undefined);
    setSelectedCategory(undefined);
  };

  return (
    <>
      <div className="header">
        <h1 className="title">Feedback Analyzer</h1>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CsvController
                handleOnChange={handleOnChange}
                handleOnClear={handleOnClear}
                displayCSV={displayCSV}
                csvData={csvData}
              />
              <CategoriesView
                glowFeedbacks={glowFeedbacks}
                growFeedbacks={growFeedbacks}
                categorization={categorization}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
              <div className="network-input">
                <button type="button">Import Network</button>
                <button type="button" onClick={() => exportNetwork()}>
                  Export Network
                </button>
              </div>

              {data && selectedColumn && (
                <CategorizationBox
                  setSelectedColumn={setSelectedColumn}
                  selectedColumn={selectedColumn}
                  data={data}
                  categorization={categorization}
                  glowFeedbacks={glowFeedbacks}
                  setGlowFeedbacks={setGlowFeedbacks}
                  growFeedbacks={growFeedbacks}
                  setGrowFeedbacks={setGrowFeedbacks}
                  handleAddCategory={handleAddCategory}
                />
              )}
              <DataTable
                data={data}
                file={file}
                setSelectedColumn={setSelectedColumn}
              />
            </>
          }
        />
      </Routes>
    </>
  );
}

function CsvController({ handleOnChange, displayCSV, handleOnClear, csvData }) {
  return (
    <div className="csv-field">
      <h2>Import a CSV file to begin analysis</h2>
      <div className="csv-actions">
        <input
          className="custom-file-input"
          type="file"
          id="csvFileInput"
          accept=".csv"
          onChange={handleOnChange}
        />

        <button onClick={displayCSV}>Import CSV</button>
        <button onClick={handleOnClear}>Clear Data</button>
        <CSVLink data={csvData}>Export CSV</CSVLink>
      </div>
    </div>
  );
}

export default App;
