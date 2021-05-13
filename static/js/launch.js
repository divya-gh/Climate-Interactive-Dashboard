//-----------------------------------------------------//    
// Function to render Launch Page
//-----------------------------------------------------//

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    //Set initial value as World Info
    selector.append("option").attr('value','World Info').text("World Info")
  
    // Use the list of countries names to populate the select options
    d3.json("/api/v1.0/countries").then((data) => {
      var sampleNames = data;
      //console.log(sampleNames)
      
      // assign Countries to each option
      data.forEach(country => {
          selector.append("option")
                  .attr("value", country)
                  .text(country)
      })  
    }); 

    //DemoInfo();
    demoInfo('World');
    //BuildWorldMap();  

    //------------------------------------------------------//

    //On selection of a country call the function setStage to render Deo info and create DOM elements    
    d3.select("#selDataset").on("change", setStage) ;
    
    
  }


//Initialize and render launch informations
init();



//-----------------------------------------------------//    
// Function to build charts on each selection
//-----------------------------------------------------//

function  setStage(){    

    //Get options selected by the user
    var country = d3.selectAll('#selDataset').node().value ;
    console.log(country);

    //if worldInfo is Selected,
    if(country === "World Info"){
        init();
        document.location.href="/";
        
    }
    else{
            //Update Demo Info for the selected Country
            demoInfo(country);

            //Call JQueryRenderHTML to render chart elements
            slideUp(); 
    }        

}


//-----------------------------------------------------//
// Function to get Demographic Information
//-----------------------------------------------------//
function demoInfo(country) {
    // Get Demo info for the selected Country - call API 
    d3.json("/launch_data").then((demoData) => {
        //print
        console.log('DemoData:', demoData);

        //Filter selected country
        var countryInfo = demoData.filter(obj => country === obj.Country)
        //print
        console.log('Old Demo Info: ', countryInfo);

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
        //print ordered selection
        console.log("Demo Info Sorted: ",countryInfoObj )  ;      
        
        //Clear previous data if any
        demoSelector.html("");

        //Add demo data to the selector
        Object.entries(countryInfoObj[0]).forEach(([key,value]) => { 
                    demoSelector.append('p').text(`${key}: ${value}`)
                    });
        //style demo info panel
        demoSelector.attr("class" , 'border border-success panel_font mt-3 pt-4')                  

                  });       

}//End of Demo update




