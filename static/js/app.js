// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(metadata => metadata.id == sample)
    // let filteredMetadata = metadata.filter(sampleID => sampleID.id == sample)
    let sampleMetadata = filteredMetadata[0] //grabbing first id object

    // Use d3 to select the panel with id of `#sample-metadata`
    let dashboardMeta = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    dashboardMeta.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let info in sampleMetadata) { 
      dashboardMeta.append("h6").text(`${info.toUpperCase()}: ${sampleMetadata[info]}`)} //for each loop, add the sample id to the dropdown list and get it's current value
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesFields = data.samples //select samples object 

    // Filter the samples for the object with the desired sample number
    let samplesFiltered = samplesFields.filter(sampleID => sampleID.id == sample)
    let filteredData = samplesFiltered[0]

    // Get the otu_ids, otu_labels, and sample_values
    let otuIDs = filteredData.otu_ids
    let otuLabels = filteredData.otu_labels
    let sampleValues = filteredData.sample_values
   
    // Build a Bubble Chart
    let BubbleChart = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIDs,
        colorscale: "Earth",
        // opacity: [1, 0.8, 0.6, 0.4],
        size: sampleValues
      }
    }];

    
    let BubbleChartLayout  = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      margin: {t: 30},
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'}
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', BubbleChart, BubbleChartLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otuIDsArray = otuIDs.map(otuIDs => `OTU ${otuIDs}`)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let BarChart = [
      {
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIDsArray.slice(0, 10).reverse(),
        hovertext: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: "h"
      }
    ];

    let BarChartLayout = {title: "Top 10 Bacteria Cultures Found" }


    // Render the Bar Chart
    Plotly.newPlot('bar', BarChart, BarChartLayout);
  });
}

// Function to run on page load
function init() {
  // let dropdownMenu = d3.select('#selDataset') //where drop down menu will be
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleIDs = data.names //select the list of ids under "names"
 

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select('#selDataset') //where drop down menu will be

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let x = 0; x < sampleIDs.length; x++) {
      dropdownMenu.append("option").text(sampleIDs[x]).property("value", sampleIDs[x]) //for each loop, add the sample id to the dropdown list and get it's current value
      }

    // Get the first sample from the list
    let startingSample = sampleIDs[0]

    // Build charts and metadata panel with the first sample
    buildCharts(startingSample)
    buildMetadata(startingSample)

  });
}

// Function for event listener
function optionChanged(newSample) {

// Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample),
  buildMetadata(newSample)}

// Initialize the dashboard
init();
