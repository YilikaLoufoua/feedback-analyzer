import './App.css';
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
	const [trainingData, setTrainingData] = useState([]);

	useEffect(() => {
		const obj = {};
		categories.forEach((category) => {
			obj[category] = [];
		});
		setCategorization(obj);
	}, [data]);

	useEffect(() => {
		// Format categorization data for export
		const result = Object.entries(categorization).reduce((previousValue, category) => {
			const key = category[0];
			const subArray = category[1];
			// If there is a value, then add the value to the array
			if (subArray.length) {
				// Do something
				const convertedArary = subArray.map((value) => ({ [key]: value }));
				return [...previousValue, ...convertedArary];
			}
			return previousValue;
		}, []);
		setCSVData(result);

		// Format categorization data for generating neural network training data
		Object.keys(categorization).forEach((key) => {
			if (categorization[key].length > 0) {
				for (let value of categorization[key]) {
					let obj = {};
					obj.input = value;
					obj.output = key;
					setTrainingData((prev) => [...prev, obj]);
				}
			}
		});
	}, [categorization]);

	// Upload CSV file
	const fileReader = new FileReader();
	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};

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

	const addGlow = (item) => {
		if (glowFeedbacks.includes(item)) return;
		if (growFeedbacks.includes(item)) {
			setGrowFeedbacks(growFeedbacks.filter((item2) => item2 != item));
		}
		setGlowFeedbacks((prev) => [...prev, item]);
	};
	const addGrow = (item) => {
		if (growFeedbacks.includes(item)) return;
		if (glowFeedbacks.includes(item)) {
			setGlowFeedbacks(glowFeedbacks.filter((item2) => item2 != item));
		}
		setGrowFeedbacks((prev) => [...prev, item]);
	};

	const exportTrainingData = () => {
		if (trainingData) {
			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
				JSON.stringify(trainingData)
			)}`;
			const link = document.createElement('a');
			link.href = jsonString;
			link.download = 'trainingData.json';
			link.click();
		}
	};

	const trainNetwork = () => {
		// // Sample Network Training Process
		// const network = new brain.recurrent.LSTM(); // Init network
		// Train and store network json object as state
		// network.train(trainingData, {
		// 	iterations: 100,
		// 	log: true,
		// });
		// setNetworkJson(network.toJSON());

		// INSTEAD OF TRAINING: Init new network and load from previous network
		const network = new brain.recurrent.LSTM();
		const preTrainedNetworkJson = require('./models/model.json');
		if (preTrainedNetworkJson) {
			network.fromJSON(preTrainedNetworkJson);
		}
		// Predict
		const test1 = 'I liked the project';
		let output = network.run(test1);
		console.log('test1: ', test1);
		console.log('output: ', output);
		let test2 = 'I liked working in groups';
		output = network.run(test2);
		console.log('test2: ', test2);
		console.log('output: ', output);
		let test3 = 'I liked working on the project in groups';
		output = network.run(test3);
		console.log('test3: ', test3);
		console.log('output: ', output);
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

	const handleOnClear = () => {
		setData(undefined);
		setSelectedCategory(undefined);
	};
	return (
		<>
			<div className='header'>
				<h1 className='title'>Feedback Analyzer</h1>
			</div>
			<CsvController
				handleOnChange={handleOnChange}
				handleOnClear={handleOnClear}
				displayCSV={displayCSV}
				csvData={csvData}
				trainNetwork={trainNetwork}
			/>
			<CategoriesView
				glowFeedbacks={glowFeedbacks}
				growFeedbacks={growFeedbacks}
				categorization={categorization}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>
			<div className='network-input'>
				<button type='button'>Import Network</button>
				<button type='button' onClick={() => exportNetwork()}>
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
					addGrow={addGrow}
					addGlow={addGlow}
					handleAddCategory={handleAddCategory}
					exportTrainingData={exportTrainingData}
				/>
			)}
			<DataTable data={data} file={file} setSelectedColumn={setSelectedColumn} />
		</>
	);
}

function CsvController({
	handleOnChange,
	displayCSV,
	handleOnClear,
	csvData,
	trainNetwork,
	exportTrainingData,
}) {
	return (
		<div className='csv-field'>
			<h2>Import a CSV file to begin analysis</h2>
			<div className='csv-actions'>
				<input
					className='custom-file-input'
					type='file'
					id='csvFileInput'
					accept='.csv'
					onChange={handleOnChange}
				/>

				<button onClick={displayCSV}>Import CSV</button>
				<button onClick={handleOnClear}>Clear Data</button>
				<CSVLink data={csvData}>Export CSV</CSVLink>
				<button onClick={trainNetwork}>Train Network</button>
				<button onClick={exportTrainingData}>Export Training Data</button>
			</div>
		</div>
	);
}

export default App;
