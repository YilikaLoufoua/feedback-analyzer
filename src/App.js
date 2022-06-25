import "./App.css";
import React, { useState } from "react";

const App = () => {
	const data = require("./data/feedbacks.json").feedbacks;
	console.log("data: ", data);

	return (
		<main>
			<div className="header">
				<h1>Meta University Web 2022 Course Feedback Analysis</h1>
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
						{data.map((item) => (
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
