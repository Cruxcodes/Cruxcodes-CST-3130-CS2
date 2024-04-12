//Axios will handle HTTP requests to web service
import axios from "axios";
import predictions from "../machine_learning/synthetic/predictions/synthetic_prediction.json" assert { type: "json" };

//The ID of the student whose data you want to plot
let studentID = "MOO949038";

//URL where student data is available
let url = "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/";

//Authentication details for Plotly
//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = "Crusader33";
const PLOTLY_KEY = "tGC0O6rlpF7mzZtb8qE2";

//Initialize Plotly with user details.
import Plotly from "plotly";
let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);

async function handler(event) {
  try {
    //Get synthetic data
    let yValues = (await axios.get(url + studentID)).data.target;

    //Add basic X values for plot
    let xValues = [];
    for (let i = 0; i < yValues.length; ++i) {
      xValues.push(i);
    }

    //Call function to plot data
    let plotResult = await plotData(studentID, xValues, yValues);
    console.log(
      "Plot for student '" + studentID + "' available at: " + plotResult.url
    );

    return {
      statusCode: 200,
      body: "Ok",
    };
  } catch (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Error plotting data for student ID: " + studentID,
    };
  }
}

//Plots the specified data
// async function plotData(studentID, xValues, yValues) {
//   //Data structure
//   let studentData = {
//     x: xValues,
//     y: yValues,
//     type: "scatter",
//     mode: "line",
//     name: studentID,
//     marker: {
//       color: "rgb(200, 64, 82)",
//       size: 12,
//     },
//   };

//   let predictionValueX = [];
//   for (
//     let i = yValues.length;
//     i < yValues.length + predictions.predictions[0].mean.length;
//     ++i
//   ) {
//     predictionValueX.push(i);
//   }

//   let predictionDataMean = {
//     x: predictionValueX,
//     y: predictions.predictions[0].mean,
//     type: "scatter",
//     mode: "line",
//     name: "Mean",
//     marker: {
//       color: "rgb(65, 105, 225)",
//       size: 12,
//     },
//   };

//   let prediction01Quantile = {
//     x: predictionValueX,
//     y: predictions.predictions[0].quantiles["0.1"],
//     type: "scatter",
//     mode: "line",
//     name: "Prediction 0.1 Quantile",
//     marker: {
//       color: "rgb(34, 139, 34)",
//       size: 12,
//     },
//   };

//   let prediction09Quantile = {
//     x: predictionValueX,
//     y: predictions.predictions[0].quantiles["0.9"],
//     type: "scatter",
//     mode: "line",
//     name: "Prediction 0.9 Quantile",
//     marker: {
//       color: "rgb(250, 179, 0)",
//       size: 12,
//     },
//   };

//   let data = [
//     studentData,
//     predictionDataMean,
//     prediction01Quantile,
//     prediction09Quantile,
//   ];

//   //Layout of graph
//   let layout = {
//     title: "Synthetic Data for Student " + studentID,
//     font: {
//       size: 25,
//     },
//     xaxis: {
//       title: "Time (hours)",
//     },
//     yaxis: {
//       title: "Value",
//     },
//   };
//   let graphOptions = {
//     layout: layout,
//     filename: "date-axes",
//     fileopt: "overwrite",
//   };

//   //Wrap Plotly callback in a promise
//   return new Promise((resolve, reject) => {
//     plotly.plot(data, graphOptions, function (err, msg) {
//       if (err) reject(err);
//       else {
//         resolve(msg);
//       }
//     });
//   });
// }

// handler();


async function plotData(studentID, xValues, yValues) {
  //Data structure
  let studentData = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "line",
    name: studentID,
    marker: {
      color: "rgb(219, 64, 82)",
      size: 12,
    },
  };
  let data = [studentData];

  //Layout of graph
  let layout = {
    title: "Synthetic Data for Student " + studentID,
    font: {
      size: 25,
    },
    xaxis: {
      title: "Time (hours)",
    },
    yaxis: {
      title: "Value",
    },
  };
  let graphOptions = {
    layout: layout,
    filename: "date-axes",
    fileopt: "overwrite",
  };

  //Wrap Plotly callback in a promise
  return new Promise((resolve, reject) => {
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) reject(err);
      else {
        resolve(msg);
      }
    });
  });
}

handler();