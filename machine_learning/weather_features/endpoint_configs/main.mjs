import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import fs from "fs";

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});
const dbClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dbClient);

// Function to add one hour to a given timestamp
function addOneHour(timestamp) {
  const originalTime = new Date(timestamp);
  // Adding one hour (in milliseconds)
  const newTime = new Date(originalTime.getTime() + 60 * 60 * 1000);

  return newTime.toISOString();
}

//Calls endpoint and logs results
export async function invokeEndpoint(
  filename,
  timeStamp,
  endpointData,
  endpointName
) {
  // Create and send command with data
  const command = new InvokeEndpointCommand({
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json",
  });

  try {
    const response = await client.send(command);

    // Must install @types/node for this to work
    let predictions = JSON.parse(Buffer.from(response.Body).toString("utf8"));
    let timeStamps = [];
    let time = new Date(timeStamp); // Initialize time with the provided timeStamp
    time = time.getTime() + 100 * 60 * 60 * 1000;
    // Add 100 hours so the prediction starts from that point
    // time.setTime(time.getTime() + 100 * 60 * 60 * 1000);
    // time.toISOString();
    let predictionmain = predictions.predictions[0];
    for (let i = 0; i < predictionmain.mean.length; i++) {
      timeStamps.push(time);
      // Update time with the new timestamp after adding one hour
      time = addOneHour(time);
    }

    await uploadPrediction(
      filename,
      timeStamps,
      predictionmain.mean,
      predictionmain.quantiles["0.1"],
      predictionmain.quantiles["0.9"]
    );

    // Write prediction to a file
    fs.writeFileSync(
      `../predictions/${filename}_predictions.json`,
      JSON.stringify(predictions, null, 2)
    );
    console.log("Predictions written to predictions.json successfully.");
  } catch (error) {
    console.log(error);
  }
}

async function uploadPrediction(
  feature,
  timeStamps,
  mean,
  lowerPercentile,
  upperPercentile
) {
  const command = new PutCommand({
    TableName: "weather_predictions",
    Item: {
      weather_feature: feature,
      timeStamps: timeStamps,
      mean: mean,
      lowerPercentile: lowerPercentile,
      upperPercentile: upperPercentile,
    },
  });
  try {
    const response = await documentClient.send(command);
    console.log(response);
  } catch (err) {
    console.log("ERROR uploading weather data: " + JSON.stringify(err));
    throw err;
  }
}
