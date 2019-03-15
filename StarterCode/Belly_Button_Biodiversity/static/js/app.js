function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data){
    var data = [data]
    console.log(data)
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadataPanel = d3.select("#sample-metadata")

    sampleMetadataPanel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    data.forEach(dataPoint => {
      var row = sampleMetadataPanel.append('div');
      Object.entries(dataPoint).forEach(([key, value])=>{
        var sampleData = sampleMetadataPanel.append('div');
        sampleData.text(`${key}: ${value}`);
      })
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){

    // @TODO: Build a Bubble Chart using the sample data
// Use otu_ids for the x values
// Use sample_values for the y values
// Use sample_values for the marker size
// Use otu_ids for the marker colors
// Use otu_labels for the text values
  var trace1 = [{
    x: data.otu_ids,
    y: data.sample_values,
    mode: 'markers',
    marker: {
      size: data.sample_values
    }
  }];

  // var data = [trace1];

  var layout = {
    title: 'Marker Size',
    showlegend: false,
    height: 600,
    width: 600
  };

  Plotly.newPlot('bubble', trace1, layout);
  

    // @TODO: Build a Pie Chart
 
    var values = data.sample_values;
    var labels = data.otu_ids;
    console.log(values)
    console.log(labels)

    var trace = [{
      "values": values.slice(0,10),
      "labels": labels.slice(0,10),
      "type": "pie",
    }]
    var layout = {
      margin: {l: 0}

    };
   
    Plotly.plot("pie", trace, layout)
  });
  // function updatePlotly(trace) {
  //   var PIE = document.getElementById("pie");
  //   Plotly.restyle(PIE,  [trace]);
  //  }
  //  updatePlotly(trace);
   
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    // console.log(sampleNames)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
