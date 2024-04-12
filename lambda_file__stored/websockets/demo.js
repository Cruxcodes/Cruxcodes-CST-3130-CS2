//Import external library with websocket functions
import { getSendMessagePromises } from "./websocket.mjs";

const connection = new WebSocket(
  "wss://c2ajwyv4r2.execute-api.us-east-1.amazonaws.com"
);

const stage = "production";

export const handler = async (event) => {
  //console.log(JSON.stringify(event));
  try {
    //get the connection id
    let connId = event.requestContext.connectionId;
    const coin = JSON.parse(event.body).data;
    //Extract domain and stage from event
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;

    const data = getData();
    console.log("Domain: " + domain + " stage: " + stage);

    //Get promises to send messages to connected clients
    let sendMsgPromises = await sendMessage(
      connId,
      domain,
      stage,
      json.stringify(data)
    );

    //Execute promises
    await Promise.all(sendMsgPromises);
  } catch (err) {
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  //Success
  return { statusCode: 200, body: "Data sent successfully." };
};

// async function sendMessage(connId, domain, stage, data) {
//   //Create API Gateway management class.
//   const callbackUrl = `https://${domain}/${stage}`;
//   const apiGwClient = new ApiGatewayManagementApiClient({
//     endpoint: callbackUrl,
//   });

//   //Create post to connection command
//   const postToConnectionCommand = new PostToConnectionCommand({
//     ConnectionId: connId,
//     Data: message,
//   });

//   //Wait for API Gateway to execute and log result
//   await apiGwClient.send(postToConnectionCommand);
//   console.log("Message '" + message + "' sent to: " + connId);
// }

//THis is for the websocket
export async function sendData(connId, domain, stage, data) {
  try {
    //Create API Gateway management class.
    const callbackUrl = `https://${domain}/${stage}`;
    const apiGwClient = new ApiGatewayManagementApiClient({
      endpoint: callbackUrl,
    });

    //Create post to connection command
    const postToConnectionCommand = new PostToConnectionCommand({
      ConnectionId: connId,
      Data: data,
    });

    //Wait for API Gateway to execute and log result
    await apiGwClient.send(postToConnectionCommand);
    console.log("Data '" + data + "' sent to: " + connId);
  } catch (err) {
    console.log("Failed to send data to: " + connId);

    //Delete connection ID from database
    if (err.statusCode == 410) {
      try {
        await deleteConnectionId(connId);
      } catch (err) {
        console.log("ERROR deleting connectionId: " + JSON.stringify(err));
        throw err;
      }
    } else {
      console.log("UNKNOWN ERROR: " + JSON.stringify(err));
      throw err;
    }
  }
}
