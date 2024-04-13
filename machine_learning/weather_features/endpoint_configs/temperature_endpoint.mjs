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
        2.5, 2.2, 2.7, 2.6, 1.9, 1.6, 1.5, 1.5, 1.4, 1.3, 1.2, 1.2, 1.2, 1, 1,
        0.9, 0.7, 1, 2, 3.3, 4.7, 5.7, 6.1, 6.1, 5.6, 5.1, 5.5, 5.6, 5.7, 5.6,
        5.5, 5.1, 4.7, 4.1, 3.6, 3.2, 3, 3.1, 3.3, 3.9, 4.1, 4.6, 5, 5.2, 5.8,
        6.1, 6.6, 7.1, 7.4, 7.4, 7.6, 6.8, 6.7, 6.6, 6.3, 6.2, 6.4, 6.9, 7.1,
        6.5, 5.4, 4.4, 3.6, 3.4, 3.2, 3.5, 4.7, 6, 7.1, 7.8, 8, 7.7, 6.7, 5.4,
        4.4, 4.2, 3.7, 3.3, 2.8, 2.3, 2, 1.7, 1.5, 1.4, 1.5, 1.8, 1.9, 3.4, 4.1,
        4.7, 5.7, 7, 7.8, 8.4, 8.6, 8.3, 7.2, 6.3, 4.8, 5.8,
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
  "temperature_2m",
  "2010-01-14T16:00",
  endpointData,
  "TempEndpoint"
);
