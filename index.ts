import axios from "axios";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//This is where the connection to the dynamodb is created
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

interface Params {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  hourly: string[];
}

// This is the query parameter for the ope matroo endpoint
const params: Params = {
  latitude: 51.5072,
  longitude: 0.1276,
  start_date: "2009-12-29",
  end_date: "2024-01-29",
  hourly: [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "wind_direction_10m",
  ],
};

let feature_lists: Array<string> = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
];

// This uploads weather data gotten from the open-meteo api to the dynamo db
async function uploadWeatherData() {
  try {
    const url = "https://archive-api.open-meteo.com/v1/archive";
    const responses = await axios.get(url, { params });
    const response: any = responses.data.hourly;
    for (let i = 0; i < feature_lists.length; i++) {
      for (let j = 0; j < 500; j++) {
        //This inputs the value of each feature into the weather table on dynamodb
        const command = new PutCommand({
          TableName: "weather",
          Item: {
            weather_feature: feature_lists[i].toString(),
            weather_timestamp: response["time"][j],
            feature_value: response[feature_lists[i]][j],
          },
        });
        //Store data in DynamoDB and handle errors
        try {
          const response = await documentClient.send(command);
          console.log(response);
        } catch (err) {
          console.error("ERROR uploading data: " + JSON.stringify(err));
        }
      }
    }
  } catch (ex: any) {
    if (ex.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Response data:", ex.response.data);
      // console.log()
      console.log("Response status:", ex.response.status);
      console.log("Response headers:", ex.response.headers);
    } else if (ex.request) {
      // The request was made but no response was received
      console.log("Request data:", ex.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error message:", ex.message);
    }
  }
}

//The upload weather function is called
uploadWeatherData();
