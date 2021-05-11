//const wait = (t) => new Promise((r) => setTimeout(r, t));
function slideUp() {
    $("select#selDataset").change(function(){

        var selCountry = $(this).children("option:selected").val();
        console.log("world_info",selCountry)

        //If world Info is selected, run init function
        if(selCountry === "World Info"){
            init();
            
            
        }
        else if($('#leaf').length){
            $('#leaf').slideUp("slow", function(){
             // Code to be executed
                 addDom(selCountry);	                   
            });
        }
        else {
                addDom(selCountry);
           }         
         
     
        });
    
    
    }
//Manipulate Dom when the document is ready
$(document).ready(slideUp);  





//-----------------------------------------------------//
// Function to render DOM elements for charting
//-----------------------------------------------------//

addDom = (country) => {

    //clear map and render Chart-area when a country is selected  
    $('#map').html("")

    //create rows and columns with specific Id's for each chart
    var warmingStripsChart = '<div class="row"><div id="first-chart" class="col-12 p-0"><div id="warming-stripes"></div></div></div>'

    var countryAndbar = '<div class="row"><div id="second-chart" class="col-6"><div id="country"></div></div><div id="third-chart" class="col-md-6 p-0"><div id="bar"></div></div></div>'

    var pieAndScatter = '<div class="row"><div id="fourth-chart" class="col-6"><div id="pie"></div></div><div id="fifth-chart" class="col-md-6"><div id="scatter"></div></div></div>'

    //Create DOM elements
    $("#map").append(warmingStripsChart);

    $("#map").append(countryAndbar);

    $("#map").append(pieAndScatter);

    //---------------------------------------------------------------------------------
    // experiment -remove these later  
    $('#first-chart').css("border", "1px solid black")
    // $("div#warming-stripes").text("Im a warming stripes chart")
    
    $('#second-chart').css("border", "1px solid black")
    //$("div#scatter").text("Im a scatter plot")
    
    $('#third-chart').css("border", "1px solid black")
    //$("div#bar").text("Im a bar chart") 
    
    $('#fourth-chart').css("border", "1px solid black")
    //$("div#pie").text("Im a pie chart")   
    
    $('#fifth-chart').css("border", "1px solid black")
    $("div#country").text("Im a Country") 


    //Render Charts when DOM elements are ready

    plotCharts(country);
    //$("div#warming-stripes").text("Country").addClass("warm-stripes text-center")



    
}
        
        
//-----------------------------------------------------//
// Function to update charts per country
//-----------------------------------------------------//

plotCharts = (country) => {

    //Call the function buildWarming Stripes
    buildWarmingStripes(country);

    //Call the function build sunburts
    buildPieBar(country)

  

}


//-----------------------------------------------------//
// Function to Build Warming stripes Chart
//-----------------------------------------------------//

function buildWarmingStripes(country){
    // Get data for the selected Country - call API 
    d3.json(`/scatter_data/${country}`).then((scatterData) => {
    //print
    console.log('ScatterData:', scatterData);

    //Fetch avg_temp Change per year
    AvgTempChange = scatterData['Avg Temp Change'] ;

    //add text to the div container with id = warming-stripes
    // $("div#warming-stripes").text(`${country}`).addClass("set_country");


    //call the function stripe_chart(avg_temp) from stripe_charts.js
    stripe_chart(AvgTempChange);

    });

}

      


//-----------------------------------------------------//
// Function to Build Pie Chart
//-----------------------------------------------------//

function buildPieBar(country){

    // Get season data for the selected Country - call API 
    d3.json(`/season_data/${country}`).then((seasonData) => {
        //print
    
    console.log('seasonData Old:', seasonData);


    //Call months data
    d3.json(`/months_data/${country}`).then((monthsData) => {
        //print data
        //console.log("Months Data", monthsData)

        // parse data
        // Configure a parseTime function which will return a new Date object from a string
        var parseYear = d3.timeParse("%Y");
        var parseDate = d3.timeFormat("%B");

        monthsData.forEach(obj => {
            Object.entries(obj).forEach( ([key,value])=> {                                
                if(key === "Year"){                    
                    monthsData[key] = parseYear(value);
                    //console.log(key,value)
                }
                else {
                   /// console.log(key,value)  
                    key = parseDate(key);
                    monthsData[key] = +value ; 
                    //console.log(key)                    
                }               
            });
        });
        console.log("parsed Months Data", monthsData) 

        // Get data for the line chart for the selected country
        d3.json(`/scatter_data/${country}`).then((yearData) => {
        //print
        //console.log('year-scatter:', scatterData);


            //Call the function from the pieChart file
            pieBarChart(seasonData, monthsData, yearData);            

        });  
    }); 
  });
}


