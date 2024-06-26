//Import AWS
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from "@aws-sdk/client-sagemaker-runtime";
import fs from "fs";
import { invokeEndpoint } from "./main.mjs";

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
      start: "2010-01-14T16:00",
      target: [
        99, 99, 99, 99, 100, 100, 100, 100, 100, 100, 100, 100, 99, 99, 98, 97,
        96, 96, 95, 93, 91, 89, 88, 89, 92, 95, 95, 96, 96, 96, 96, 97, 96, 97,
        96, 93, 90, 89, 88, 90, 91, 90, 90, 89, 89, 90, 91, 92, 94, 96, 97, 97,
        98, 97, 97, 96, 95, 93, 90, 89, 89, 90, 91, 92, 93, 93, 93, 90, 85, 81,
        79, 81, 84, 89, 92, 92, 93, 94, 95, 96, 97, 97, 98, 98, 97, 97, 97, 97,
        97, 97, 96, 90, 87, 86, 85, 84, 87, 91, 94, 96,
      ],
    },
  ],
  configuration: {
    num_samples: 50,
    output_types: ["mean", "quantiles", "samples"],
    quantiles: ["0.1", "0.9"],
  },
};

invokeEndpoint(
  "relative_humidity_2m",
  "2010-01-14T16:00",
  endpointData,
  "RelativeHumEndpoint"
);
