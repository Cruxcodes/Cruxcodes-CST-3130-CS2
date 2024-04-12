function plotPieChart(pieData) {
  // Data structure for the pie chart
  const data = [
    {
      values: pieData.values,
      labels: pieData.labels,
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
