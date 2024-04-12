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

  console.log(JSON.stringify(finalData));

  return finalData;
}

async function getWeatherFeature(specificFeature) {
  console.log("Getting data for " + specificFeature);
  const query = {
    TableName: "weather",
    Limit: 100,
    ScanIndexForward: false,
    KeyConditionExpression: "weather_feature = :wf",
    ExpressionAttributeValues: {
      ":wf": specificFeature,
    },
  };

  // const query2 = {
  //     TableName: "News_sentiment",
  //     Limit: 100,
  //     ScanIndexForward: false,
  //     KeyConditionExpression: "teamName = :t",
  //     ExpressionAttributeValues: {
  //         ":t": specificFeature
  //     }
  // };

  // const query3 = {
  //   TableName: "Predictions",
  //   Limit: 5,
  //   KeyConditionExpression: "teamName = :t",
  //   ExpressionAttributeValues: {
  //     ":t": specificFeature,
  //   },
  // }

  // const query4 = {
  //   TableName: "News",
  //   Limit: 10,
  //   KeyConditionExpression: "teamName = :t",
  //   ExpressionAttributeValues: {
  //     ":t": specificFeature,
  //   },
  // };

  const queryCommand = new QueryCommand(query);
  // const queryCommand2 = new QueryCommand(query2);
  // const queryCommand3 = new QueryCommand(query3);
  // const queryCommand4 = new QueryCommand(query4);

  try {
    const data = await docClient.send(queryCommand);
    // const data2 = await docClient.send(queryCommand2)
    // const data3 = await docClient.send(queryCommand3)
    // const data4 = await docClient.send(queryCommand4)

    // Data structure
    const featureData = {
      actual: { times: [], values: [] },
      predictions: { mean: [], upperQuantile: [], lowerQuantile: [] },
      sentiment: { timestamp: [], sentiment: [] },
      newsData: [],
    };
    featureData.actual.times = data.Items.map((item) => item.weather_timestamp);
    featureData.actual.values = data.Items.map((item) => item.feature_value);

    // featureData.sentiment.timestamp = data2.Items.map(item => item.timestampNews)
    // featureData.sentiment.sentiment = data2.Items.map(item => item.sentiment)

    // featureData.predictions.mean = data3.Items[0].mean
    // featureData.predictions.upperQuantile = data3.Items[0].upperQuantile
    // featureData.predictions.lowerQuantile = data3.Items[0].lowerQuantile

    // featureData.newsData = data4.Items.map(item => item.title)

    // console.log(featureData);
    return featureData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
