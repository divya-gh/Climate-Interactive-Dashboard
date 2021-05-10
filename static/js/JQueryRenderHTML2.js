//const wait = (t) => new Promise((r) => setTimeout(r, t));
function slideMapUp() {
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
$(document).ready(slideMapUp);  





//-----------------------------------------------------//
// Function to render DOM elements for charting
//-----------------------------------------------------//

addDom = (country) => {



    //clear map and render Chart-area when a country is selected  
    // $('#map').html("")
    $('#first-chart').html("")
    $('#third-chart').html("")
    $('#fourth-chart').html("")
    $('#fifth-chart').html("")

    //create rows and columns with specific Id's for each chart
    var warmingStripsChart = '<div id="warming-stripes"></div>'

    var barChart = '<div id="bar"></div>'

    var pieChart = '<div id="pie"></div>'

    var scatterChart = '<div id="scatter"></div>'


    // //Create DOM elements

    $('#first-chart').append(warmingStripsChart)
    $('#third-chart').append(barChart)
    $('#fourth-chart').append(pieChart)
    $('#fifth-chart').append(scatterChart)


    //---------------------------------------------------------------------------------
    // experiment -remove these later  
    $('#first-chart').css("border", "1px solid black")
    // $("div#warming-stripes").text("Im a warming stripes chart")
    
    $('#second-chart').css("border", "1px solid black")
    //$("div#scatter").text("Im a scatter plot")
    
    $('#third-chart').css("border", "1px solid black")
    $("div#bar").text("Im a bar chart") 
    
    $('#fourth-chart').css("border", "1px solid black")
    //$("div#pie").text("Im a pie chart")   
    
    $('#fifth-chart').css("border", "1px solid black")
    // $("div#country").text("Im a Country") 


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
    buildPie(country)

    //Call the function build scatter
    // buildScatter(country)
  

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

    //call the function stripe_chart(avg_temp) from stripe_charts.js
    stripe_chart(AvgTempChange);

    });

}

      


//-----------------------------------------------------//
// Function to Build Pie Chart
//-----------------------------------------------------//

function buildPie(country){

    // Get season data for the selected Country - call API 
    d3.json(`/season_data/${country}`).then((seasonData) => {
        //print
    
    console.log('seasonData Old:', seasonData);


    //calculate new season data 
    var meanSeasonData = {}
    Object.entries(seasonData[0]).forEach( ([key,value])=> {
            meanSeasonData[key] = d3.mean(value)              
                      
        })
    
    
    //get only seasons for pie chart
    var newSeasonobj = {
        "Winter":meanSeasonData.Winter,
        "Spring":meanSeasonData.Spring,
        "Summer":meanSeasonData.Summer,
        "Fall":meanSeasonData.Fall
    }
       
    //print
    console.log('seasonData new:', newSeasonobj);

    //Call the function from the pieChart file
    pieChart(country, newSeasonobj);


    }); 


}


