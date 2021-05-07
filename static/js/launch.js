function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    //Set initial value to Country
    selector.append("option").attr('value','Country').text("Country")
  
    // Use the list of countries names to populate the select options
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

    //DemoInfo();
    //BuildWorldMap();  

  }

init();


d3.select("#selDataset").on("change", buildPlots)
    
// for each selection option, built plots
function  buildPlots(){

    var country = d3.selectAll('#selDataset').node().value ;
        console.log(country);

    //Update Demo Info for the selected Country
    demoInfo(country)

    //Call JQueryRenderHTML
    slideUp();

    // plotCharts(country)

}


//-----------------------------------------------------//
// Function to get Demographic Information
//-----------------------------------------------------//
function demoInfo(country) {
    // Get Demo info for the selected Country - call API 
    d3.json("/launch_data").then((demoData) => {
        console.log('DemoData:', demoData)
        var countryInfo = demoData.filter(obj => country === obj.Country)
        console.log('Old Demo Info: ', countryInfo)

        //Get HTML element for Demo Info
        var demoSelector = d3.select("#demo-info");

        //Arrange Keys and values in order
        var countryInfoObj = countryInfo.map(obj => {
            return obj = {'Country':obj.Country,
                          "Population":obj.Population,
                          "Avg Temp Change":obj['Avg Temp Change'],
                          "Avg Co2 Emission":obj['Avg Co2 Change'],
                          "Land Size":obj['Land Size'],
                          "Lat":obj.Lat,
                          "Lon":obj.Lng 
                        }
                    }) ;
        console.log("New Demo Info: ",countryInfoObj )        
        
        //Clear previous data if any
        demoSelector.html("");

        //Add demo data to the selector
        Object.entries(countryInfoObj[0]).forEach(([key,value]) => { 
                    demoSelector.append('p').text(`${key}: ${value}`)
                                                                    });
        demoSelector.attr("class" , 'border border-success panel_font mt-3 pt-4')                  

                  });       

}//End of Demo update


//-----------------------------------------------------//
// Function to update charts per country
//-----------------------------------------------------//

// plotCharts = (country) => {
//     selector = 
// }