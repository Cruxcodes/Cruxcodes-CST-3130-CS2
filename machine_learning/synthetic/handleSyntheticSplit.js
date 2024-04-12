// const fs = require("fs");
// const axios = require("axios");

// async function pullAndSaveData(
//   url,
//   trainFile,
//   testFile,
//   trainRatio = 0.85,
//   mainFile = "synthetic.json"
// ) {
//   try {
//     // Pull data from the web service
//     const response = await axios.get(url);

//     const data = response.data;
//     const totalData = data.target.length;
//     console.log(totalData);

//     const trainSize = Math.ceil(totalData * trainRatio);

//     const trainData = data.target.slice(0, trainSize);

//     const testData = data.target.slice(trainSize);

//     // Save train data to train.json

//     fs.writeFileSync(mainFile, JSON.stringify(data, null, 4));
//     fs.writeFileSync(
//       trainFile,
//       JSON.stringify({ ...data, target: trainData }, null, 4)
//     );

//     // Save test data to test.json
//     fs.writeFileSync(
//       testFile,
//       JSON.stringify({ ...data, target: testData }, null, 4)
//     );

//     console.log("Data has been successfully saved.");
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// // Example usage:
// const url =
//   "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/M00949038";
// const trainFile = "synthetic_train.json";
// const testFile = "synthetic_test.json";
// // pullAndSaveData(url, trainFile, testFile);

// // const fs = require("fs");

// function extract100(){
// // Load the JSON file
// const fs = require("fs");

// // Load the JSON file
// const rawData = fs.readFileSync("synthetic_train.json");
// const data = JSON.parse(rawData);

// // Extract the first 100 points
// const points = data.target.slice(0, 100);

// // Write points to query.jsonl
// fs.writeFileSync(
//   "query.jsonl",
//   points
//     .map((point) => JSON.stringify({ start: data.start, target: point }))
//     .join("\n")
// );

// console.log("Points have been successfully written to query.jsonl");
// }

// extract100()

const fs = require("fs");
const axios = require("axios");

async function pullAndSaveData(
  url,
  trainFile,
  testFile,
  trainRatio = 0.85,
  mainFile = "synthetic.json",
  queryFile = "query.jsonl"
) {
  try {
    // Pull data from the web service
    const response = await axios.get(url);

    const data = response.data;
    const totalData = data.target.length;

    const trainSize = Math.ceil(totalData * trainRatio);

    const trainData = data.target.slice(0, trainSize);

    // Save train data to train.json
    fs.writeFileSync(
      trainFile,
      JSON.stringify({ start: data.start, target: trainData }, null, 4)
    );

    // Write the last 100 points into query.jsonl
    const queryData = { start: data.start, target: data.target.slice(-100) };
    fs.writeFileSync(queryFile, JSON.stringify(queryData) + "\n", {
      flag: "a",
    });

    console.log("Data has been successfully saved.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example usage:
const url =
  "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/M00949038";
const trainFile = "synthetic_train.json";
const testFile = "synthetic_test.json";
const queryFile = "query.jsonl";
pullAndSaveData(url, trainFile, testFile, 0.85, undefined, queryFile);
