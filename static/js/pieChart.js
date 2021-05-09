function pieChart(country, seasonData){

    // set the dimensions and margins of the graph
    var width = 400
    var height = 300
    //var margin = 10

    var margin = {
        top: 10,
        right: 10,
        bottom: 25,
        left: 10
      };

    var chartWidth = width - margin.left - margin.right;
    var chartHeight = height - margin.top - margin.bottom;

        
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(chartWidth, chartHeight) / 2 - margin.left

    //clear previous svg data
    d3.select("div#pie").html("")

    // append the svg object to the div called 'my_dataviz'    
    var svg = d3.select("div#pie")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 400 300")
                // .attr("width", width)
                // .attr("height", height)

    //Create a group for the chart
    var piegroup = svg.append("g")
                      .attr("transform", "translate(" + (width/2) + "," + height/2 + ")");
    //console.log("season data keys:",Object.keys(seasonData));
  
    // Create X title for seasons
    seasonG = svg.append('g').append("text")
                   .classed("aText season", true)
                   .attr("transform", `translate(${width / 3}, ${height -2.5})`)
                 
                 //.attr("class", 'season')
                 .text("Seasons");
    monthG = svg.append('g').append("text")
              .attr("transform", `translate(${width /2 + 60}, ${height -2.5})`)
              .classed("aText month inactive inactive:hover", true)
              .text("Months");   

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(Object.keys(seasonData))
                  //.range(d3.schemeDark2);
                  .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])                  
                  //d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    //set a default value
    var value = "Seasons"

    //Default pie chart
    buildChartPie(radius,piegroup, color,value,seasonData);
                            
    //Event- on click for months
    //============================//

     //create a function to handle events
     svg.selectAll(".aText").on("click", function() {

            // get value of the selection
            var value = d3.select(this).text();      
            console.log(`Value of clicked title : ${value}`);

            //set hover and active values
            if(value === 'Months'){

                //set style when event occures
                d3.select(this).classed("inactive inactive:hover" , false)
                seasonG.classed("inactive inactive:hover" , true)

                //disable season text


                //Call months data
                d3.json(`/months_data/${country}`).then((monthsData) => {
                        //print data
                        console.log("Months Data", monthsData)

                        // parse data
                        monthsData.forEach(obj => {
                            Object.entries(obj).forEach( ([key,value])=> {                                
                                if(key!= "Year"){
                                    value = +value ; 
                                };
                            });
                        });
                        
                        //create an obj with mean values
                        var meanMonthsData ={}
                        Object.keys(monthsData[0]).forEach( (key)=> {
                            if(key != "Year"){
                                temp_list = monthsData.map(obj => obj[key])
                                //console.log("Mean Data", temp_list)
                                meanMonthsData[key] = d3.mean(temp_list) ;
                            };           
                        //print        
                        //console.log("Mean Data", meanMonthsData)
                        });
                                    // set the color scale
                        var color = d3.scaleOrdinal()
                                      .domain(Object.keys(meanMonthsData))
                                      .range(d3.schemeDark2);                                 

                        //call pie functon
                        buildChartPie(radius,piegroup, color,value,meanMonthsData)

                });


            }
            else {
                // set the color scale
                var color = d3.scaleOrdinal()
                              .domain(Object.keys(seasonData))
                              .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])

                d3.select(this).classed("inactive inactive:hover" , false)
                monthG.classed("inactive inactive:hover" , true)

                //call the function to build pie chart
                buildChartPie(radius, piegroup, color,value,seasonData)
            }

              
     });

}

//=====================================================//
//Function to Create a pie chart
//=====================================================//

function buildChartPie(radius, piegroup, color, value, data){


    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.value; })
      //.sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
               .innerRadius(15)
               .outerRadius(radius)


    //data that is used in the chart
    var data_ready = pie(d3.entries(data))       

    piegroup.html("")
    
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
                   .attr("stroke", "black")
                   .style("stroke-width", "3px")
                   .style("opacity", 0.8)

    if(value === "Seasons"){
            //Add Labels
            pathGroup.append('text')
            .transition()
            .duration(1000)
            .text(function(d){ return d.data.key})
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .attr('class','pie_text')

    }
    else {
            //Add Labels
            pathGroup.append('text')
            .transition()
            .duration(1000)
            .text(function(d){ return (d.data.key).slice(0,3)})
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .attr('class','mon_text')
    }

    piegroup.selectAll("g").on("mouseover", (d) => {
        pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 .text(function(d){ return (d.data.value).toFixed(2)})
                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                 .attr('class','mon_text')
            
});
    piegroup.selectAll("g").on("mouseout", (d) => {
        hover = pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 if(value === "Seasons"){
                    hover.text(function(d){ return d.data.key})
                 }
                 else {
                    hover.text(function(d){ return (d.data.key).slice(0,3)})
                 }
                 
                hover.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                     .attr('class','mon_text')
});
             



}