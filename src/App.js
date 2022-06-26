import "./App.css";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import Category from "./Category/Category";

const brain = require("brain.js"); // import from is not supported by brain.js

const App = () => {
  let [file, setFile] = useState(undefined); // CSV file to be uploaded
  let [data, setData] = useState(undefined); // parsed data as json object from CSV file
  let [networkJson, setNetworkJson] = useState(undefined); // trained neural network
  let [category, setCategory] = useState("");

  useEffect(() => {
    const setup = async () => {
      loadData();
    };
    setup();
  }, []);

  function loadData() {
    // const data = require("./data/feedbacks.json");
    // setData(data);
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
    // console.log("training iterations: ", 10);
    // console.log("testString: ", testString);
    // console.log("output: ", output);
  }

  // Download importable neural network as json
  const exportNetwork = () => {
    if (networkJson) {
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(networkJson)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "model.json";
      link.click();
    }
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

  // Upload CSV file
  const fileReader = new FileReader();
  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const csvString = event.target.result;
        const data = Papa.parse(csvString).data;
        // console.log("data: ", data);
        // console.log("data: ", data[0]);
        setData(data);
      };

      fileReader.readAsText(file);
    }
  };
  return (
    <main>
      <div className="header">
        <h1>Meta University Web 2022 Course Feedback Analysis</h1>
        <div className="csv-input">
          <form>
            <input
              type={"file"}
              id={"csvFileInput"}
              accept={".csv"}
              onChange={(e) => handleOnChange(e)}
            />

            <button
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              IMPORT CSV
            </button>
          </form>
        </div>
        <div className="network-input">
          <button type="button">Import Network</button>
          <button type="button" onClick={() => exportNetwork()}>
            Export Network
          </button>
        </div>
      </div>
      {category !== "" ? <Category category={category} data={data} /> : null}
      <br />
      <div className="data-table">
        <table>
          <tbody>
            {data &&
              data[0].map((row) => {
                return (
                  <td class="category" onClick={() => setCategory(row)}>
                    {row}
                  </td>
                );
              })}
            {data &&
              data.map((row, idx) =>
                idx === 0 ? null : (
                  <tr key={row}>
                    {row.map((col) => (
                      <td>{col}</td>
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
