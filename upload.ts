//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

//Stores demo data in database
async function uploadData() {
  //Create Date class so we can obtain a starting timestamp
  let date: Date = new Date();
  let startTimestamp = date.getTime();

  let currencies: Array<{ name: string; averagePrice: number }> = [
    { name: "bitcoin", averagePrice: 3800 },
    { name: "ethereum", averagePrice: 128 },
    { name: "litecoin", averagePrice: 31 },
    { name: "tron", averagePrice: 0.03 },
  ];

  //Add dummy data for four currencies
  for (let curr of currencies) {
    //Add ten lots of data for each currency
    for (let ts: number = 0; ts < 10; ++ts) {
      //Create command
      const command = new PutCommand({
        TableName: "CryptoCurrency",
        Item: {
          Currency: curr.name,
          CurrencyTimeStamp: startTimestamp + ts,
          Price: curr.averagePrice * (1 + 0.1 * (Math.random() - 0.5)),
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
}
uploadData();
