//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
import fs from "fs";

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});

/* Data we are going to send to endpoint
    REPLACE WITH YOUR OWN DATA!
    Should be last 100 points in your time series (depending on your choice of hyperparameters).
    Make sure that start is correct.
*/
const endpointData = {
  instances: [
    {
      start: "2024-04-10 01:00:00",
      target: [
        332.4798482031625, 332.4534269861464, 330.4520576078133,
        331.94263019236394, 327.54322227034623, 320.80651157421545,
        335.16450361855726, 335.41531779224283, 346.526479398009,
        343.4333160143508, 349.8196700360948, 372.6805340526595,
        378.1909614335929, 359.84903555379964, 385.69787382134183,
        372.5914045899362, 379.3441574685071, 361.4246493213831,
        363.1934098841718, 356.57349133513884, 351.0835299472372,
        363.948511789799, 338.67221206500153, 331.4446824330517,
        334.81904951914544, 337.42675549684856, 321.7057169825002,
        352.3852785222889, 343.47569158929997, 335.14555568211665,
        359.3863787617378, 363.91814715159825, 371.6145095770775,
        390.1092067887077, 363.92467024865033, 396.62801864240447,
        402.64121918025126, 377.8369765506302, 390.29822574954096,
        380.4638156982979, 389.70926245123354, 380.23554422344984,
        376.2339109024558, 387.4456204504648, 377.6767878276636,
        372.95563776279033, 376.5709629173666, 356.3869504197698,
        343.8782732535451, 335.7919441311618, 363.7530852562171,
        340.3506788251773, 364.0415667716423, 362.392117460253,
        358.9633045500295, 385.0426514487779, 363.7710376750038,
        368.93770667474445, 407.7110846674428, 413.53839493464716,
        411.19863292918455, 390.0250952457148, 425.90018770968896,
        424.67999500896303, 416.47913500002574, 392.85872469618084,
        377.52140039619604, 387.58031101459017, 397.71064621088294,
        380.75687977434126, 391.62199670304386, 369.876230017272,
        368.99901986459514, 367.88436018149935, 356.88842653372194,
        377.75040068622576, 374.32399252613124, 364.06513851216397,
        369.00296684178295, 370.8658733452579, 391.90476674871957,
        399.74302665401945, 397.1364842705218, 429.72950495570313,
        420.02420562487055, 405.198909977454, 407.3024627207033,
        418.4086911034213, 427.1610499103465, 406.0442433923968,
        416.5357711765829, 402.18284767161794, 392.1670658921563,
        402.33620169213145, 400.25725209199317, 393.8474591951097,
        400.63792677191435, 392.4923075908618, 384.2154513437955,
        393.61914925859065,
      ],
    },
  ],
  configuration: {
    num_samples: 50,
    output_types: ["mean", "quantiles", "samples"],
    quantiles: ["0.1", "0.9"],
  },
};

//Calls endpoint and logs results
async function invokeEndpoint() {
  //Create and send command with data
  const command = new InvokeEndpointCommand({
    EndpointName: "QAsynthetic",
    Body: JSON.stringify(endpointData),
    ContentType: "application/json",
    Accept: "application/json",
  });
  try {
    const response = await client.send(command);

    //Must install @types/node for this to work
    let predictions = JSON.parse(Buffer.from(response.Body).toString("utf8"));

    //print the time adding 1 hour
    // const predictionsWithAdjustedTimestamps = predictions.map(
    //   (prediction, index) => {
    //     const originalTimestamp = endpointData.instances[0].start;
    //     console.log({
    //       timestamp: addOneHour(originalTimestamp),
    //       value: prediction,
    //     });
    //   }
    // );
    console.log(predictions)
    //Write prediction to a file
    fs.writeFileSync(
      "./predictions/synthetic_prediction.json",
      JSON.stringify(predictions, null, 2)
    );
    console.log("Predictions written to predictions.json successfully.");
  } catch (error) {
    console.log(error);
  }
}

invokeEndpoint();

// Function to add one hour to a given timestamp
function addOneHour(timestamp) {
  const originalTime = new Date(timestamp);
  const newTime = new Date(originalTime.getTime() + 60 * 60 * 1000); // Adding one hour (in milliseconds)
  return newTime.toISOString();
}
