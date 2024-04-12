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


//Calls endpoint and logs results
export async function invokeEndpoint(filename, endpointData, endpointName) {
  //Create and send command with data
  const command = new InvokeEndpointCommand({
    EndpointName: endpointName,
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json",
  });
  try {
    const response = await client.send(command);

    //Must install @types/node for this to work
    let predictions = JSON.parse(Buffer.from(response.Body).toString("utf8"));

    // console.log(predictions.predictions[0].mean)
    let predictionmain = predictions.predictions[0];
    // console.log(predictionmain.mean);
    await uploadPrediction(
      filename,
      predictionmain.mean,
      predictionmain.quantiles["0.1"],
      predictionmain.quantiles["0.9"]
    );

    //Write prediction to a file
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
  mean,
  lowerPercentile,
  upperPercentile
) {
  const command = new PutCommand({
    TableName: "weather_predictions",
    Item: {
      weather_feature: feature,
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
