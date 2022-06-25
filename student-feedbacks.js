const fs = require("fs");
const csv = require("csvtojson");
const brain = require("brain.js");
const { Parser } = require("json2csv");

const network = new brain.recurrent.LSTM();

let allFeedbacks = [];

// Load student feedback data
(async () => {
  allFeedbacks = await csv().fromFile("all_feedbacks.csv");
  const testFeedbacks = allFeedbacks.slice(0, 3);
  console.log("testFeedbacks: ", testFeedbacks);
})();

const trainingData = allFeedbacks.map((feedback) => ({
  input: {
    q2: feedback["The pace was\n(Select 5 for just right)"],
    q3: feedback["How would you rate\nyour TA’s support?"],
    q4: feedback["I was in my"],
  },
  output: feedback["How enjoyable\nwas today's session?"],
}));

console.log("trainingData: ", trainingData);
// network.train(trainingData, {
//   iterations: 2000
// });

// const output = network.run('The code has some bugs');

// console.log(`Category: ${output}`);
