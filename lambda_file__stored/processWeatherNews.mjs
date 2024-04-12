import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import axios from "axios";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    for (let record of event.Records) {
      if (record.eventName === "INSERT") {
        // retrieve important information
        let newsTime = record.dynamodb.NewImage.news_timestamp.S;
        let newsFeature = record.dynamodb.NewImage.news_feature.S;
        let news = record.dynamodb.NewImage.news.S;

        // console.log(`F Name:  ${newsFeature}`);
        // console.log(`Text: ${news}`);
        // console.log(`Timestamp: ${newsTime}`);

        //Get sentiment of text

        //Store news, newsFeature and sentiment.

        // Call text processing to get sentiment
        const sentimentResult = await getSentiment(news);

        // Save the news, news_feature and the sentiment
        const command = new PutCommand({
          TableName: "news_sentiment",
          Item: {
            weather_feature: newsFeature,
            news_timestamp: newsTime,
            sentiment: sentimentResult,
          },
        });

        try {
          const response = await documentClient.send(command);
          console.log(response);
        } catch (err) {
          console.log("ERROR uploading NBA data: " + JSON.stringify(err));
          throw err;
        }
      }
    }
  } catch (e) {
    console.log("Error: " + e);
  }
};

// Function for calling and processing sentiment.
async function getSentiment(text) {
  //0 is neutral, >0 is positive, <0 is negative
  //URL of web service
  let url = `https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod`;

  //Sent GET to endpoint with Axios
  let response = await axios.post(
    url,
    {
      text,
    },
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );

  return response.data.sentiment;
}
