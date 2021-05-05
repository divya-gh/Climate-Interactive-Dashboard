function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/api/v1.0/countries").then((data) => {
      var sampleNames = data;
      console.log(sampleNames)
      
      // assign Countries to each option
      data.forEach(country => {
          selector.append("option")
                  .attr("value", country)
                  .text(country)
      })
  
    });
  }

init();