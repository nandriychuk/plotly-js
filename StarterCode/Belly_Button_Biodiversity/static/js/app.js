function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data){
    var data = [data]
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadataPanel = d3.select("#sample-metadata")

    sampleMetadataPanel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    data.forEach(dataPoint => {
      var row = sampleMetadataPanel.append('div');
      Object.entries(dataPoint).forEach(([key, value])=>{
        var sampleData = sampleMetadataPanel.append('h6');
        sampleData.text(`${key}: ${value}`);
      })
    });
      // BONUS: Build the Gauge Chart
    buildGauge(data[0].WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){

//Build a Bubble Chart using the sample data

// create variables to referense data values
var sample_values = data.sample_values;
var otu_ids = data.otu_ids;
var otu_labels = data.otu_labels;


var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids
    }
  }];

  var bubbleLayout = {

    margin: { t: 10 },
    xaxis: { title: "OTU ID" }
  };

  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  

// Sort sample values in descending order
  var sortedSampleValues = sample_values.sort((a, b) => b-a);
  console.log(sortedSampleValues)
  //Build a Pie Chart
    var pieData = [
      {
        values: sortedSampleValues.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }    
    ];
 
    var pieLayout = {
      margin: { t: 0, l: 66 }
    };
    
    Plotly.newPlot("pie", pieData, pieLayout);
  });
   
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
