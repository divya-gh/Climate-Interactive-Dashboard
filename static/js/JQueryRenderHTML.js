//const wait = (t) => new Promise((r) => setTimeout(r, t));
function slideUp() {
    $("select#selDataset").change(function(){

        var selCountry = $(this).children("option:selected").val();
        
        if($('#leaf').length){
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

    var countryAndbar = '<div class="row"><div id="second-chart" class="col-6"><div id="country"></div></div><div id="third-chart" class="col-md-6"><div id="bar"></div></div></div>'

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
    $("div#bar").text("Im a bar chart") 
    
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
    buildPie(country)

  

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
        

    
    chartCaptions =[{
        "captions":[{"Winter":"Winter", "Spring":"Spring","Summer":"Summer","Fall":"Fall"}],
        "color":[{"Winter":"Blue", "Spring":"green","Summer":"red","Fall":"orange"}],
        "xaxis":"Seasons",
        "yaxis":"Avg Temp Change"
    }]
    
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

    pieChart(newSeasonobj);


    }); 


}


function pieChart(seasonData){

    // set the dimensions and margins of the graph
    var width = 400
    height = 300
    margin = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    d3.select("div#pie").html("")
    var svg = d3.select("div#pie")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 400 300")
                // .attr("width", width)
                // .attr("height", height)

    var piegroup = svg.append("g")
                      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    console.log("season data keys:",Object.keys(seasonData));

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(Object.keys(seasonData))
                  .range(d3.schemeDark2);

                  //d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
                .value(function(d) {return d.value; })
                .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
                         .innerRadius(10)
                         .outerRadius(radius)


    //data that is used in the chart
    var data_ready = pie(d3.entries(seasonData))       


    //Create groups and bind data
    var pathGroup = piegroup.selectAll(".gr")
                                 .data(data_ready)
                                 .enter()
                                 .append('g')
                                 .classed("gr" , true)

       
                         
                        pathGroup.append('path')
                                 .transition()
                                 .duration(1000)
                                 .attr('d', arcGenerator)
                                 .attr('fill', function(d){ return(color(d.data.key)) })
                                 .attr("stroke", "white")
                                 .style("stroke-width", "2px")
                                 .style("opacity", 0.8)
                    //Add Labels
                        pathGroup.append('text')
                                 .transition()
                                 .duration(1000)
                                 .text(function(d){ return d.data.key})
                                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                                 .style("text-anchor", "middle")
                                 .style("font-size", 17)
                  
    





}