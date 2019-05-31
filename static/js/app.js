//**********************METADATA*******************************************

function metadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = "/metadata/" + sample;
    // Use d3 to select the panel with id of `#sample-metadata`
  var panelMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  panelMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(metadataURL).then(function (data) {
      Object.entries(data).forEach(([key, value]) => {
        panelMetadata.append("p").text(`${key}: ${value}`);
      });
    });
}


//*********************BUBBLE CHART***************************************
// / @TODO: Use `d3.json` to fetch the sample data for the plots
function charts(sample) {
  var chartsURL = "/samples/" + sample;
  d3.json(chartsURL).then(function (data) {

  // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x: data.otu_ids,
    y: data.sample_values,
    mode: 'markers',
    text: data.otu_labels,
    marker: {
      color: data.otu_ids,
      size: data.sample_values,
      colorscale: "Portland"
    }
  };
  var trace1 = [trace1];

  var layout = {
    xaxis: {
      title: "Taxonomic Unit ID",
      },
    yaxis: {
      title: "Population of Bacteria Strain",
      },
    showlegend: false,
    height: 600,
    width: 1300
  };


  Plotly.newPlot('bubble', trace1, layout);


//*******************PIE CHART*******************************************
// @TODO: Build a Pie Chart
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).
  var dataSample = data.sample_values.sort(function compareFunction(firstNum, secondNum) {
    return secondNum - firstNum;
    });

  var data = [{
    values: dataSample.slice(0, 10),
    labels: data.otu_ids.slice(0, 10),
    hovertext: data.otu_labels.slice(0, 10),
    type: 'pie',
  }];

  var layout = {
      title: "Top 10 Bacterial Life Forms Found in Subject",
      showlegend: true,
      height: 600,
      width: 600,
      colorscale: "Portland",
  };
  Plotly.newPlot('pie', data, layout);
  });
} //end function charts


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    charts(firstSample);
    metadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  charts(newSample);
  metadata(newSample);
}

// Initialize the dashboard
init();
