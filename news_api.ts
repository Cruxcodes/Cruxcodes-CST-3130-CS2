import axios from "axios";
import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//This is where the connection to the dynamodb is created
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);
dotenv.config();
const apiKey = process.env.NEWS_API_KEY;


/**This is the interface for the news table */
export interface NewsEntry {
  feature: string;
  description: string;
  publishedAt: string;
}

/**This is the list of weather feautures */
let feature_lists: Array<string> = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
];

/**This function is to get the news from the spi and push it to the aws server */
async function getNewsApi(feature: String) {
  console.log("API Key:", apiKey);
  try {
    //The urls were changed for each feature
    // const url = `https://newsapi.org/v2/everything?q=global%warming%20in%20london%20&sortBy=publishedAt&apiKey=${apiKey}`; this is the temperature
    // const url = ` https://newsapi.org/v2/everything?q=sea surface temperature in london&sortBy=publishedAt&apiKey=${apiKey}`;
    const url = ` https://newsapi.org/v2/everything?q=ocean currents%20in%20london&sortBy=publishedAt&apiKey=${apiKey}`;
    const responses = await axios.get(url);
    const response: Array<NewsEntry> = responses.data["articles"];
    for (var i = 0; i < (response.length < 12 ? response.length : 12); i++) {
      //This pushes the news to the news table on the server
      const command = new PutCommand({
        TableName: "news_table",
        Item: {
          news_feature: feature,
          news_timestamp: response[i].publishedAt,
          news: response[i].description,
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
  } catch (ex: any) {
    if (ex.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Response data:", ex.response.data);
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

getNewsApi(feature_lists[4]);
