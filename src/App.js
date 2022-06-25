import "./App.css";
import { useState, useEffect } from "react";
const brain = require("brain.js"); // import from is not supported by brain.js

const App = () => {
	let [data, setData] = useState(undefined);
	let [networkJson, setNetworkJson] = useState(undefined);

	useEffect(() => {
		const setup = async () => {
			loadData();
		};
		setup();
	}, []);

	function loadData() {
		const data = require("./data/feedbacks.json").feedbacks;
		setData(data);
	}

	useEffect(() => {
		if (data) {
			processData();
		}
	}, [data]);

	function processData() {
		// // // Sample Network Training Process
		// const network = new brain.recurrent.LSTM(); // Init network

		// // Import data
		// const hardware_software = require("./data/hardware-software.json");

		// // Preprocess data
		// const trainingData = hardware_software.map((item) => ({
		// 	input: item.text,
		// 	output: item.category,
		// }));

		// // Train and store network json object as state
		// network.train(trainingData, {
		// 	iterations: 10, // very fast but very poor performance
		// });
		// setNetworkJson(network.toJSON());

		// INSTEAD OF TRAINING: Init new network and load from previous network
		const newNetwork = new brain.recurrent.LSTM();
		const preTrainedNetworkJson = require("./models/model.json");
		if (preTrainedNetworkJson) {
			newNetwork.fromJSON(preTrainedNetworkJson);
		}

		// Predict
		const testString = "I'm running out of memory.";
		const output = newNetwork.run(testString);
		console.log("training iterations: ", 10);
		console.log("testString: ", testString);
		console.log("output: ", output);

		// Student Feedback Data > Best Part of Today (Text) vs Enjoyableness Rating (Numeric)
		const dailyBestPart_enjoyablenessRating = data
			.map((feedback) => {
				if (feedback.dailyBestPart != "") {
					return {
						input: feedback.dailyBestPart,
						output: feedback.enjoyablenessRating > 5 ? "Positive" : "Negative",
					};
				}
			})
			.filter((feedback) => feedback);

		// Training and Test data
		const d_e_train = [...[], dailyBestPart_enjoyablenessRating[12], dailyBestPart_enjoyablenessRating[33], dailyBestPart_enjoyablenessRating[21], dailyBestPart_enjoyablenessRating[40]];
		const d_e_test = "I had a really hard time catching up.";
	}

	// Downloads importable network json file
	const exportData = () => {
		if (networkJson) {
			const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(networkJson))}`;
			const link = document.createElement("a");
			link.href = jsonString;
			link.download = "model.json";
			link.click();
		}
		return;
	};
	return (
		<main>
			<div className="header">
				<h1>Meta University Web 2022 Course Feedback Analysis</h1>
				<button type="button" onClick={() => exportData()}>
					Export Network
				</button>
			</div>
			<div className="data-table">
				<table>
					<tbody>
						<tr>
							<th>Object ID</th>
							<th>Timestamp</th>
							<th>Date</th>
							<th>Your TA</th>
							<th>How enjoyable was today's session?</th>
							<th>The pace was</th>
							<th>How would you rate your TA’s support?</th>
							<th>I was in my </th>
							<th>What was the best part of today's class?</th>
							<th>How could we have made today's class more enjoyable for you?</th>
							<th>Anything else you'd like us to know? </th>
							<th>How could your TA have supported you better?</th>
						</tr>
						{data &&
							data.map((item) => (
								<tr key={item.objectId}>
									<td>{item.objectId}</td>
									<td>{item.timestamp}</td>
									<td>{item.date}</td>
									<td>{item.teachingAssistant}</td>
									<td>{item.enjoyablenessRating}</td>
									<td>{item.paceRating}</td>
									<td>{item.supportRating}</td>
									<td>{item.learningZone}</td>
									<td>{item.dailyBestPart}</td>
									<td>{item.enjoyablenessSuggestion}</td>
									<td>{item.anyFeedback}</td>
									<td>{item.supportSuggestion}</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</main>
	);
};

export default App;
