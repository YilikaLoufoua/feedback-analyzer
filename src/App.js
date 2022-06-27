import "./App.css";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import CategorizationBox from "./CategorizationBox/CategorizationBox";
import CategoriesView from "./CategoriesView/CategoriesView";
import { CSVLink } from "react-csv";

const brain = require("brain.js");

const App = () => {
	let [file, setFile] = useState(undefined); // CSV file to be uploaded
	let [data, setData] = useState(undefined); // parsed data as json object from CSV file
	let [networkJson, setNetworkJson] = useState(undefined); // trained neural network
	let [selectedColumn, setSelectedColumn] = useState("");
	let [selectedCategory, setSelectedCategory] = useState("");
	let [categorization, setCategorization] = useState({});
	let [csvData, setCSVData] = useState("");

	// Create a dictionary of categories and feedbacks
	const categories = ["Course Experience", "Material", "Lecture", "Course Structure", "Peer Relations", "Administration", "Support", "Technical Topic"];
	useEffect(() => {
		let obj = {};
		categories.forEach((category) => (obj[category] = []));
		setCategorization(obj);
	}, [data]);

	// Process parsed CSV
	useEffect(() => {
		if (data) {
			processData();
		}
	}, [data]);

	// Format categorization data for export
	useEffect(() => {
		if (selectedCategory) {
			let csvExport = [];
			categorization[selectedCategory].forEach((feedback) => {
				let obj = {};
				obj[selectedCategory] = feedback;
				csvExport.push(obj);
			});
			setCSVData(csvExport);
		}
	}, [selectedCategory]);
	console.log("selectedCategory: ", selectedCategory);

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

	// Download importable neural network as json
	const exportNetwork = () => {
		if (networkJson) {
			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(networkJson))}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = "model.json";
			link.click();
		}
	};

	// Upload CSV file
	const fileReader = new FileReader();
	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
	};

	// Parse CSV file
	const handleOnSubmit = (e) => {
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
		setFile(undefined);
		setData(undefined);
	};

	return (
		<main>
			<div className="header">
				<h1>Feedback Analyzer</h1>
			</div>
			<div className="csv-input">
				<input className="custom-file-input" type={"file"} id={"csvFileInput"} accept={".csv"} onChange={(e) => handleOnChange(e)} />
				<button
					onClick={(e) => {
						handleOnSubmit(e);
					}}
				>
					Import CSV
				</button>
				<button
					onClick={() => {
						handleOnClear();
					}}
				>
					Clear Data
				</button>
				<CSVLink data={csvData}>Export CSV</CSVLink>
			</div>
			<CategoriesView categorization={categorization} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
			{/* <div className="network-input">
					<button type="button">Import Network</button>
					<button type="button" onClick={() => exportNetwork()}>
						Export Network
					</button>
				</div> */}
			{data && selectedColumn && <CategorizationBox selectedColumn={selectedColumn} data={data} categorization={categorization} handleAddCategory={handleAddCategory} />}
			<h2> {data && file.name}</h2>
			<div className="data-table">
				<table>
					<tbody>
						<tr>
							{data &&
								data[0].map((col) => {
									return (
										<th key={col} className="col" onClick={() => setSelectedColumn(col)}>
											{col}
										</th>
									);
								})}
						</tr>
						{data &&
							data.map((row, idx) =>
								idx === 0 ? null : (
									<tr key={row}>
										{row.map((col, idx) => (
											<td key={idx}>{col}</td>
										))}
									</tr>
								)
							)}
					</tbody>
				</table>
			</div>
		</main>
	);
};

export default App;
