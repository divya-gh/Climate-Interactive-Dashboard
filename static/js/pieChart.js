function pieBarChart(seasonData, monthsData, yearData){

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

//=================================================================================================================//
//Pie chart Area
//================================================================================================================//

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(chartWidth, chartHeight) / 2 - margin.left

    //clear previous svg data
    d3.select("div#pie").html("")

    // append the svg object to the div called 'my_dataviz'    
    var svg = d3.select("div#pie")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 400 300")

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

    //===================================================================================//
    //bar chart Area
    //==================================================================================//
    var m_line = {
        top: 10,
        right: 10,
        bottom: 39,
        left: 25
      };

    var lineChartWidth = width - m_line.left - m_line.right;
    var lineChartHeight = height - m_line.top - m_line.bottom;


     var svg_line = d3.select("div#bar")
                 .append("svg")
                 .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox", "0 0 400 300")
             
    // Step 2: Create an SVG wrapper,
    var chartGroup = svg_line.append("g")
                        .attr("transform", `translate(${m_line.left}, ${m_line.top})`);

    
                            // Create X title for seasons
    var yearG = svg_line.append('g').append("text")
                   .classed("aText year", true)
                   .attr("transform", `translate(${width /3 -2}, ${height -2.5})`)                 
                    //.attr("class", 'season')
                   .text("Years");
               
    var SG = svg_line.append('g').append("text")
                            .attr("transform", `translate(${width /2}, ${height -2.5})`)
                            .classed("aText month inactive inactive:hover", true)
                            .text("Seasons");  

    var MG = svg_line.append('g').append("text")
                            .attr("transform", `translate(${width /2 + 60}, ${height -2.5})`)
                            .classed("aText month inactive inactive:hover", true)
                            .text("Months");   


    var parseTime = d3.timeParse("%Y");
    var years = yearData.Year ;
    //parse years
    years = years.map(data => parseTime(data));

    avg_temp = yearData['Avg Temp Change'];
    //parse avg temp
    avg_temp = avg_temp.map(data => +data)

    console.log(d3.extent(years));
    // Create Scales
    //= ============================================
    var xTimeScale = d3.scaleTime()
                       .domain([d3.min(years), d3.max(years)])
                       .range([0, lineChartWidth]).nice();
    var yLinearScale = d3.scaleLinear()
                          .domain([d3.min(avg_temp)-0.2, d3.max(avg_temp)+0.2])
                          .range([lineChartHeight, 0]).nice();

    // Create Axes
    // =============================================
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
    var leftAxis = d3.axisLeft(yLinearScale).ticks();
                      
    // Step 7: Append the axes to the chartGroup
    // ==============================================
    // Add bottomAxis
    chartGroup.append("g").attr("transform", `translate(0, ${lineChartHeight})`).call(bottomAxis);

    // Add leftAxis to the left side of the display
    chartGroup.append("g").call(leftAxis);

    //create a list of data object
    var temp_list = [];
    years.forEach((year,i) =>{
        var temp_obj = {"year":year, "temp" : avg_temp[i]}
        temp_list.push(temp_obj)
    })
    //console.log(temp_list)

    // line generator
    var line = d3.line()
                 .x(d => xTimeScale(d.year))
                 .y(d => yLinearScale(d.temp));

    // append line
    var lineGroup = chartGroup.append('g')
              .attr("class", "lgr")
              .append("path")
              .data([temp_list])
              .attr("d", line)
              .attr("fill", "none")
              .attr("stroke", "orange")
              .attr("stroke-width",2);

    // Create the event listeners with transitions
    lineGroup.on("mouseover", function() {
        d3.select(this).transition()
                  .duration(500)
                  .attr("stroke", "red");
      })
          .on("mouseout", function() {
            d3.select(this)
                  .transition()
                  .duration(500)
                  .attr("stroke", "orange");
          });
      
    //Append circles to each point
    // append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(temp_list)
                                 .enter()
                                 .append("circle")
                                 .attr("r", 3)
                                 .attr("fill", "lightblue");

    // Event listeners with transitions
    circlesGroup.on("mouseover", function() {
                    d3.select(this)
                      .transition()
                      .duration(1000)
                      .attr("r", 20)
                      .attr("fill", "lightblue");
    })
                .on("mouseout", function() {
                    d3.select(this)
                      .transition()
                      .duration(1000)
                      .attr("r", 3)
                      .attr("fill", "lightblue");
    });

    // transition on page load
    chartGroup.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", (d) => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d.temp));
    











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
                //disable season text
                seasonG.classed("inactive inactive:hover" , true)

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
                buildChartPie(radius,piegroup, color, value, meanMonthsData)           

                 }

            else {
                // set the color scale
                var color = d3.scaleOrdinal()
                              .domain(Object.keys(seasonData))
                              .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])

                //set the season title inactive
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
                   .style("stroke-width", "2px")
                   .style("opacity", 0.7)

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

    pathGroup.on("mouseover", (d) => {
        // d3.select(this).select("path")
        //                //alter path

        pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 .text(function(d){ return (d.data.value).toFixed(2)})
                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                 .attr('class','mon_text')
            
});
    pathGroup.on("mouseout", (d) => {
        hover = pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 if(value === "Seasons"){
                    hover.text(function(d){ return d.data.key})
                         .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                         .attr('class','pie_text')
                 }
                 else {
                    hover.text(function(d){ return (d.data.key).slice(0,3)})
                         .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                         .attr('class','mon_text')
                 }
                 
                
                     
});
             



}