// Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import fs from 'fs';

// Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

// Send command and output results
async function getWeatherData(specificTeam) {
  console.log("Getting data for " + specificTeam);

  // Construct a query to fetch data for the specific team from DynamoDB
  const query = {
    TableName: "weather",
    Limit: 500,
    KeyConditionExpression: "weather_feature = :t",
    ExpressionAttributeValues: {
      ":t": specificTeam,
    },
  };
  const queryCommand = new QueryCommand(query);

  try {
    // Send the query command to DynamoDB and await the response
    const data = (await documentClient.send(queryCommand)).Items;
    const feature_value = [];
    const timestamp = [];

    const features = data.Items;

    // Function to format timestamp
    // function formatDate(timestampInput) {
    //   const timestamp = Number(timestampInput);
    //   const date = new Date(timestamp);

    //   const day = date.getDate().toString().padStart(2, "0");
    //   const month = (date.getMonth() + 1).toString().padStart(2, "0");
    //   const year = date.getFullYear();

    //   return `${day}-${month}-${year}`;
    // }

    // Extract score main points and format timestamps
    for (let i = 0; i < data.length; i++) {
      feature_value[i] = data[i].feature_value;
      timestamp[i] = data[i].weather_timestamp;
    }


    
    // // Construct formatted data object
    const formatedData = {
      weather_feature: data[0].weather_feature,
      weather_timestamps: timestamp,
      feature_values: feature_value,
    };

    // console.log(formatedData.weather_timestamps[499]);

    // return data;
    return formatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Function to save data into a JSON file
function saveFile(fileName, data) {
  try {
    fs.writeFileSync(`./data/${fileName}`, JSON.stringify(data));
    console.log(`Data saved to ${fileName}`);
  } catch (err) {
    console.log("There was a error saving the file: " + err);
  }
}

// Function to remove last 100 elements from an array the target array for training
function removeLast100FromTarget(data) {
  let newData = [...data];
  newData = newData.slice(0, -100);
  return newData;
}

//This function slices the data array for the last 100 values
function dataTesting(data) {
  return data.slice(-100);
}
// Execute scan function with the desired weather feature value
// scan("temperature_2m");

function saveDataAsFile(data) {
  try {
    const fullData = {
      start: "",
      target: [],
    };

    const trainingData = {
      start: "",
      target: [],
    };

    const testData = {
      start: "",
      target: [],
    };

    fullData.start = data.weather_timestamps[0];
    fullData.target = data.feature_values;

    trainingData.start = data.weather_timestamps[0];
    trainingData.target = removeLast100FromTarget(data.feature_values);

    testData.start = data.weather_timestamps[400];
    testData.target = dataTesting(data.feature_values);

    const lowerSavingName = data.weather_feature.toLowerCase();

    //This section saves all the data into files
    saveFile(`${lowerSavingName}.json`, fullData);
    saveFile(`${lowerSavingName}_train.json`, trainingData);
    saveFile(`${lowerSavingName}_testing.json`, testData);
  } catch (error) {}
}

let feature_lists = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
];

for (let i = 0; i < feature_lists.length; i++) {
  const result = await getWeatherData(feature_lists[i]);
  saveDataAsFile(result);
}
