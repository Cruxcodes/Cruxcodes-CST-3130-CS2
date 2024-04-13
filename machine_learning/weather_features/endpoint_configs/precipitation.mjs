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
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.5, 0.9, 0.6, 0.1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.6, 1.1, 1.2, 0.7, 0.4, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
  "precipitation",
  "2010-01-14T16:00",
  endpointData,
  "PrecipitationEndpoint"
);



