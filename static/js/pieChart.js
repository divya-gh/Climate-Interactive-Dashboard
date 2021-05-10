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

    // set the color scale
    var color = d3.scaleOrdinal()
                  .domain(Object.keys(newSeasonobj))
                  //.range(d3.schemeDark2);
                  .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])                  
                  //d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    //set a default value
    var value = "Seasons"

    //Default pie chart
    buildChartPie(radius,piegroup, color,value,newSeasonobj);

    //===================================================================================//
    //Line chart Area
    //==================================================================================//
    var m_line = {
        top: 20,
        right: 13,
        bottom: 39,
        left: 40
      };

    var lineChartWidth = width - m_line.left - m_line.right;
    var lineChartHeight = height - m_line.top - m_line.bottom;

    //clear previous svg data
    d3.select("div#bar").html("")

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
    var xGroup = chartGroup.append("g").attr("transform", `translate(0, ${lineChartHeight})`).call(bottomAxis);

    // Add leftAxis to the left side of the display
    var yGroup = chartGroup.append("g").call(leftAxis);

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
      

    // Function to append circles to data points
    //===========================================//

    function createCircle(data, color){
        console.log(data)
        //create previous groups 
        chartGroup.selectAll(".ygr").remove();
        var circlesGroup = chartGroup.selectAll(".ygr")
                                 .data(data)
                                 .enter()
                                 .append('g')
                                 .classed("ygr" , true);
    //append circles to each group                             
    circlesGroup.append("circle")
                .attr("r", 3)
                .attr("fill", color);                            

    // //append text to each group            
    circlesGroup.append("text")
                .text(d => `${d.temp}`)
                .attr("x", (d) => xTimeScale(d.year))
                .attr("y", function (d) {
                  return (yLinearScale(d.temp)+2)
                }).transition()
                .duration(300)
                .attr("class", "set_text")
                .style("display", 'none');

    //Event listeners with transitions
    circlesGroup.on("mouseover", function() {
                d3.select(this).selectAll('circle')
                  .transition()
                  .duration(100)
                  .attr("r", 20)

              
                d3.select(this).select('text')
                    .transition()
                    .duration(1000)
                    //.delay(10)
                    .style("display", 'inline')     

    })
                .on("mouseout", function() {
                    d3.select(this).selectAll('circle')
                      .transition()
                      .duration(1000)
                      .attr("r", 3)
                    d3.select(this).select('text')
                      .transition()
                      .duration(1000)
                      .style("display", 'none');
    });

    // transition on page load
    chartGroup.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cx", (d) => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d.temp));

    }

    var circleColor = "#9966FF" ; 
    createCircle(temp_list,circleColor);
    

    function lineSeasons(){

        //set Y axis Title
        //1: Add Winter to Y axis
        WG = svg_line.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left +9.5)
                .attr("x", 0 - (chartHeight -30))
                .attr("dy", "1em")
                .attr("class", "WG aText")
                .text("Winter")
                .attr("fill", "blue");

        //1: Add Spring to Y axis
        SPG = svg_line.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left +9.5)
                .attr("x", 0 - (chartHeight -90))
                .attr("dy", "1em")
                .attr("class", "WG aText")
                .text("Spring")
                .attr("fill", "green");;

        //1: Add Summer to Y axis
        SMG = svg_line.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left +9.5)
                .attr("x", 0 - (chartHeight -150))
                .attr("dy", "1em")
                .attr("class", "WG aText")
                .text("Summer")
                .attr("fill", "red");

        //1: Add Fall to Y axis
        FG = svg_line.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left +9.5)
                .attr("x", 0 - (chartHeight -210))
                .attr("dy", "1em")
                .attr("class", "WG aText")
                .text("Fall")
                .attr("fill", "orange");


        //select dMin and Dmax for yDomain
        var minlist =[] ;
        var maxlist =[] ;
        Object.entries(seasonData[0]).forEach( ([key,value])=> {                                
            if((key != "Year") & (key != "Country") & (key != "Data Found")) {  
                minlist.push(d3.min(value))  ; 
                maxlist.push(d3.max(value))              
            }            
        });
        console.log("min list",minlist)
        console.log("max list",maxlist)

        var dMin = d3.min(minlist);
        var dMax = d3.max(maxlist);

        console.log("min",dMin)
        console.log("max",dMax)

        //Set x and yscales
        yLinearScale.domain([dMin,dMax]).nice() ;

        //change chart width to fit in the scale
        lineChartWidth = width - m_line.left +1 - m_line.right;
        //xTimeScale.range([0, lineChartWidth]).nice();

        // updates x axis with transition
        yGroup.transition().duration(500).call(d3.axisLeft(yLinearScale)) 

        //Get the data ready
        var winterData = seasonData[0].Winter.map(d => +d) ;
        var springData = seasonData[0].Spring.map(d => +d) ;
        var summerData = seasonData[0].Summer.map(d => +d) ;
        var fallData = seasonData[0].Fall.map(d => +d) ;
        console.log("winterData", winterData)

        //Create a list of Objects
        seasonLine = [] ;
        years.forEach((year,i) => {
            var seasonLineObj = {
                "year": year,
                "Winter": winterData[i],
                "Spring":springData[i],
                "Summer":summerData[i],
                "Fall":fallData[i]
            }
            seasonLine.push(seasonLineObj);
        });
        console.log("season line list:", seasonLine)

        // Line generator for Winter data
        var lineWin = d3.line()
                        .x(d => xTimeScale(d.year))
                        .y(d => yLinearScale(d.Winter));

        // Line generator for Spring data
        var lineSpr = d3.line()
        .x(d => xTimeScale(d.year))
        .y(d => yLinearScale(d.Spring));

        // Line generator for Summer data
        var lineSum = d3.line()
        .x(d => xTimeScale(d.year))
        .y(d => yLinearScale(d.Summer));

        // Line generator for Fall data
        var lineFal = d3.line()
        .x(d => xTimeScale(d.year))
        .y(d => yLinearScale(d.Fall));

        // Append a path element to the svg, make sure to set the stroke, stroke-width, and fill attributes.
        //clear previous groups
        chartGroup.selectAll(".lgr").remove();
        chartGroup.selectAll(".ygr").remove();
        var lineGroup = chartGroup.append('g')
                            .attr("class", "lgr")
                            .append("path")
                            .attr("d", lineWin(seasonLine))
                            .attr("fill", "none")
                            .attr("stroke", "blue")
                            .attr("stroke-width",2);

        // append line
        var lineGroup1 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineSpr(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "green")
                                  .attr("stroke-width",2);

        var lineGroup2 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineSum(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "red")
                                  .attr("stroke-width",2);
    
        var lineGroup3 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineFal(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "orange")
                                  .attr("stroke-width",2);

        //Event - When clicked on ytitle for winter
        WG.on("click", function() {

            //set other titles as inactive
            WG.classed("inactive inactive:hover" , false)
            SPG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , true)
            FG.classed("inactive inactive:hover" , true)

            //make linegroups 1 , 2 and 3 invisible
            lineGroup.transition().duration(1000).attr('display','inline')
            lineGroup1.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','none')
            lineGroup3.transition().duration(1000).attr('display','none')
            
            var WCircleData = seasonLine.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.Winter}
                return obj ;
            })
            
            var circleColor = "orange"
            createCircle(WCircleData, circleColor);
        });


        //Event - When clicked on ytitle for Spring
        SPG.on("click", function() {

            //set other titles as inactive
            SPG.classed("inactive inactive:hover" , false)
            WG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , true)
            FG.classed("inactive inactive:hover" , true)

            //make linegroups 1 , 2 and 3 invisible
            lineGroup1.transition().duration(1000).attr('display','inline')
            lineGroup.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','none')
            lineGroup3.transition().duration(1000).attr('display','none')
            
            var SprCircleData = seasonLine.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.Spring}
                return obj ;
            })
            
            var circleColor = "gray"
            createCircle(SprCircleData, circleColor);
        });

        //Event - When clicked on ytitle for Summer
        SMG.on("click", function() {

            //set other titles as inactive
            SPG.classed("inactive inactive:hover" , true)
            WG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , false)
            FG.classed("inactive inactive:hover" , true)

            //make linegroups 1 , 2 and 3 invisible
            lineGroup1.transition().duration(1000).attr('display','none')
            lineGroup.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','inline')
            lineGroup3.transition().duration(1000).attr('display','none')
            
            var sumCircleData = seasonLine.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.Summer}
                return obj ;
            })
            
            var circleColor = "#0099FF"
            createCircle(sumCircleData, circleColor);
        });


        //Event - When clicked on ytitle for Summer
        FG.on("click", function() {
        
            //set other titles as inactive
            SPG.classed("inactive inactive:hover" , true)
            WG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , true)
            FG.classed("inactive inactive:hover" , false)
        
            //make linegroups 1 , 2 and 3 invisible
            lineGroup1.transition().duration(1000).attr('display','none')
            lineGroup.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','none')
            lineGroup3.transition().duration(1000).attr('display','inline')

            var fallCircleData = seasonLine.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.Fall}
                return obj ;
            })

            var circleColor = "#9999FF"
            createCircle(fallCircleData, circleColor);
        });
                     

    }

    //create a function to handle events
    svg_line.selectAll(".aText").on("click", function() {
        // get value of the selection
        var value = d3.select(this).text();      
        console.log(`Value of clicked title : ${value}`);
        //set hover and active values
        if(value === 'Seasons'){
            
        //set style when event occures
        d3.select(this).classed("inactive inactive:hover" , false)
        //disable season text
        yearG.classed("inactive inactive:hover" , true)
        MG.classed("inactive inactive:hover" , true)

        
        lineSeasons();

        }


        

    });
    









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
                              .domain(Object.keys(newSeasonobj))
                              .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])

                //set the season title inactive
                d3.select(this).classed("inactive inactive:hover" , false)
                monthG.classed("inactive inactive:hover" , true)

                //call the function to build pie chart
                buildChartPie(radius, piegroup, color,value,newSeasonobj)
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