// Show loader function
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

// Hide loader function
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function plotPieChart(pieData) {
  // Data structure for the pie chart
  const data = [
    {
      values: pieData.sentiment,
      labels: pieData.timeStamp,
      type: "pie",
    },
  ];

  // Layout options for the pie chart
  const layout = {
    title: `Sentiment Data for ${pieData.team}`,
  };

  // Plot the pie chart
  Plotly.newPlot("pieChart", data, layout);
}

function calculatePercentage(wholeValue, percentValue) {
  return (percentValue / wholeValue) * 100;
}

/**@function this is in charge of plotting the sentiment piechart */
function plotSentimentChart(data) {
  let dataValues = data.sentiment;
  let positive = [];
  let negative = [];
  let neutral = [];

  let selectedValue = document.querySelector(
    'input[name="weatherFeature"]:checked'
  ).value;

  document.querySelector(".feature").innerHTML = selectedValue;
  for (var i = 0; i < dataValues.length; i++) {
    if (dataValues[i] == 0) {
      neutral.push(dataValues[i]);
    } else if (dataValues[i] > 0) {
      positive.push(dataValues[i]);
    } else {
      negative.push(dataValues[i]);
    }
  }

  let positivePercentage = calculatePercentage(
    dataValues.length,
    positive.length
  );
  let negativePercentage = calculatePercentage(
    dataValues.length,
    negative.length
  );
  let neutralPercentage = calculatePercentage(
    dataValues.length,
    neutral.length
  );

  //
  Plotly.purge("sentimentChart");
  Plotly.newPlot(
    "sentimentChart",
    [
      {
        values: [positivePercentage, negativePercentage, neutralPercentage],
        labels: ["Positive", "Negative", "Neutral"],
        type: "pie",
        marker: {
          colors: ["Blue", "purple", "gray"], // Specify custom colors here
        },
      },
    ],
    {
      width: 1000,
      height: 500,
      title: `${selectedValue} Sentiments Pie Chart`,
    }
  );
}

//Open connection
let connection = new WebSocket(
  "wss://c2ajwyv4r2.execute-api.us-east-1.amazonaws.com/production/"
);

//Log connected response
connection.onopen = function (event) {
  console.log("Connected: " + JSON.stringify(event));
  sendMessage();
};

//Output messages from the server
connection.onmessage = function (msg) {
  const data = JSON.parse(msg.data);

  let selectedValue = document.querySelector(
    'input[name="weatherFeature"]:checked'
  ).value;

  hideLoader();

  //This calls the function to plot the sentiment
  plotSentimentChart(data[selectedValue].sentiment);

  let trace1 = {
    x: data[selectedValue].actual.times,
    y: data[selectedValue].actual.values,
    mode: "line",
    name: data[selectedValue],
    marker: {
      color: "rgb(219, 64, 82)",
      size: 12,
    },
  };

  let trace2 = {
    x: data[selectedValue].predictions.timeStamp,
    y: data[selectedValue].predictions.mean,
    mode: "line",
    name: "Mean",
    marker: {
      color: "brown",
      size: 12,
    },
  };

  let trace3 = {
    x: data[selectedValue].predictions.timeStamp,
    y: data[selectedValue].predictions.upperPercentile,
    mode: "line",
    name: "UpperPercentile",
    marker: {
      color: "green",
      size: 12,
    },
  };

  let trace4 = {
    x: data[selectedValue].predictions.timeStamp,
    y: data[selectedValue].predictions.lowerPercentile,
    mode: "line",
    name: "LowerPercentile",
    marker: {
      color: "black",
      size: 12,
    },
  };

  // let data = [ trace1, trace2 ];

  //Specify title and axis labels
  let layout = {
    title: selectedValue,
    xaxis: {
      title: "Times",
    },
    yaxis: {
      title: "Values",
    },
  };

  //Purge clears the existing chart and then draws a new one
  Plotly.purge("chartDiv");
  //Draw graph
  Plotly.newPlot("chartDiv", [trace1, trace2, trace3, trace4], layout);
};

//Log errors
connection.onerror = function (error) {
  console.log("WebSocket Error: " + JSON.stringify(error));
};

//Send message to server
function sendMessage() {
  showLoader();
  //Get text from form
  let msgText = "";

  //Create message to be sent to server
  let msgObject = {
    action: "sendMessage", //Used for routing in API Gateway
    data: msgText,
  };

  //Send message
  connection.send(JSON.stringify(msgObject));

  //Log result
  console.log("Message sent: " + JSON.stringify(msgObject));
}
