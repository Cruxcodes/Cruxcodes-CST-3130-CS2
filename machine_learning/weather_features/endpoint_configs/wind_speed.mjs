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
        3, 2.5, 1.6, 1.4, 4.1, 4.6, 3.3, 3.3, 5.1, 7.2, 5.8, 2.9, 7.8, 7.3, 7.8,
        7.8, 8.5, 10.8, 12.2, 14.4, 16.6, 16.6, 18, 18.4, 17.3, 16.9, 16.5,
        16.9, 17.7, 18.5, 19, 20.3, 20.5, 22.9, 24.6, 25, 25.3, 25.6, 26.3,
        27.2, 26.8, 26.4, 23.8, 23.2, 22.4, 20.5, 17.7, 15.1, 13.7, 13, 12.3,
        11.5, 10.5, 8.7, 9.8, 9.3, 13.7, 19.7, 21.1, 20.5, 19.8, 18.1, 16.6,
        15.7, 15.4, 15, 15.5, 15.4, 15.3, 15.6, 15.3, 14.2, 12.2, 11, 11.3,
        11.3, 11.6, 11, 11, 10.6, 11, 10.5, 10.9, 11.1, 11.4, 11.6, 11.6, 11.8,
        11.3, 11.9, 11.3, 13.5, 16.3, 15.5, 14.7, 12.1, 10.4, 9.4, 8.8, 8.3,
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
  "wind_speed_10m",
  "2010-01-14T16:00",
  endpointData,
  "WindSpeedEndpoint"
);
