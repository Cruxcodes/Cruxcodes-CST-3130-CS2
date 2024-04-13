//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//Returns all of the connection IDs
export async function getConnectionIds() {
  const scanCommand = new ScanCommand({
    TableName: "WebSocketClients",
  });

  const response = await docClient.send(scanCommand);
  return response.Items;
}

//Deletes the specified connection ID
export async function deleteConnectionId(connectionId) {
  console.log("Deleting connection Id: " + connectionId);

  const deleteCommand = new DeleteCommand({
    TableName: "WebSocketClients",
    Key: {
      ConnectionId: connectionId,
    },
  });
  return docClient.send(deleteCommand);
}

//Returns structured data
export async function getData() {
  const weather = [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "wind_direction_10m",
  ];

  const finalData = {};

  for (let feature of weather) {
    finalData[feature] = await getWeatherFeature(feature);
  }

  return finalData;
}

//Get all the data from the dynamodb tables and structure them
async function getWeatherFeature(specificFeature) {
  console.log("Getting data for " + specificFeature);

  //This is to query data from the weather table
  const query = {
    TableName: "weather",
    Limit: 100,
    ScanIndexForward: false,
    KeyConditionExpression: "weather_feature = :wf",
    ExpressionAttributeValues: {
      ":wf": specificFeature,
    },
  };

  //This is to query the sentiment
  const sentimentQuery = {
    TableName: "news_sentiment",
    Limit: 100,
    ScanIndexForward: false,
    KeyConditionExpression: "weather_feature = :wf",
    ExpressionAttributeValues: {
      ":wf": specificFeature,
    },
  };

  const predictionsQuery = {
    TableName: "weather_predictions",
    Limit: 5,
    KeyConditionExpression: "weather_feature = :wf",
    ExpressionAttributeValues: {
      ":wf": specificFeature,
    },
  };

  const queryCommand = new QueryCommand(query);
  const sentimentCommand = new QueryCommand(sentimentQuery);
  const predictionsCommand = new QueryCommand(predictionsQuery);
  try {
    const data = await docClient.send(queryCommand);
    const sentimentData = await docClient.send(sentimentCommand);
    const predictionsData = await docClient.send(predictionsCommand);

    // Data structure
    const featureData = {
      actual: { times: [], values: [] },
      predictions: {
        mean: [],
        upperPercentile: [],
        lowerPercentile: [],
        timeStamp: [],
      },
      sentiment: { sentiment: [] },
    };
    featureData.actual.times = data.Items.map((item) => item.weather_timestamp);
    featureData.actual.values = data.Items.map((item) => item.feature_value);

    featureData.sentiment.sentiment = sentimentData.Items.map(
      (item) => item.sentiment
    );

    featureData.predictions.mean = predictionsData.Items[0].mean;
    featureData.predictions.upperPercentile =
      predictionsData.Items[0].upperPercentile;
    featureData.predictions.lowerPercentile =
      predictionsData.Items[0].lowerPercentile;
    featureData.predictions.timeStamp = predictionsData.Items[0].timeStamps;

    return featureData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
