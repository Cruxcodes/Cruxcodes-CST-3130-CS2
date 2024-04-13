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
      start: "2010-01-15T04:00",
      target: [
        248, 250, 236, 214, 192, 184, 178, 181, 181, 179, 180, 182, 181, 170,
        168, 168, 167, 161, 157, 156, 152, 152, 156, 163, 165, 168, 174, 182,
        182, 184, 187, 208, 234, 268, 288, 269, 261, 259, 259, 258, 259, 256,
        251, 248, 248, 248, 247, 238, 235, 234, 240, 243, 239, 241, 239, 245,
        250, 247, 251, 252, 252, 248, 246, 236, 162, 117, 101, 100, 108, 116,
        111, 96, 101, 104, 104, 107, 113, 114, 115, 118, 118, 119, 121, 120,
        109, 106, 63, 55, 49, 39, 22, 10, 11, 11, 325, 319, 315, 297, 270, 260,
      ],
    },
  ],
  configuration: {
    num_samples: 50,
    output_types: ["mean", "quantiles", "samples"],
    quantiles: ["0.1", "0.9"],
  },
};

invokeEndpoint("wind_direction_10m","2010-01-14T16:00", endpointData, "WindDirEndpoint");
