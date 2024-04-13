// Import the necessary functions from your websocket.mjs module
import { getSendMessagePromises, sendData } from "./websocket.mjs";
import { getData } from "./database.mjs";

const domain = "c2ajwyv4r2.execute-api.us-east-1.amazonaws.com";

const stage = "production";

export const handler = async (event) => {
  try {
    const data = await getData();
    console.log("Domain: " + domain + " stage: " + stage);
    //get the connection id
    let connId = event.requestContext.connectionId;
    console.log("connectionId" + connId);
    //Get promises to send messages to connected clients
    let sendMsgPromises = await sendData(
      connId,
      domain,
      stage,
      JSON.stringify(data)
    );

    //Execute promises
    await Promise.all(sendMsgPromises);
  } catch (err) {
    return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
  }

  //Success
  return { statusCode: 200, body: "Data sent successfully." };
};
