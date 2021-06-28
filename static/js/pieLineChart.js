function pieLineChart(seasonData, monthsData, yearData){

    // set the dimensions and margins of the graph
    var width = 400
    var height = 300
    //var margin = 10

    var margin = {
        top: 10,
        right: 13,
        bottom: 25,
        left: 40
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

    //Add Title to the chart
    var PieTitle = svg.append("g").append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + 15)
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        // .style("text-decoration", "underline")
        .style("font-weight", "bold")   
        .text("Avg. temperature between 1961 & 2019");


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
    }

    if(meanSeasonData.Fall != undefined){
        newSeasonobj["Fall"] = meanSeasonData.Fall ;
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




    //----------------------------------------------------------------------------------//
    //===================================================================================//
    //Line chart Area
    //==================================================================================//
    //--------------------------------------------------------------------------------//


    var m_line = {
        top: 20,
        right: 20,
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
             
    // Create an SVG wrapper,
    var chartGroup = svg_line.append("g")
                        .attr("transform", `translate(${m_line.left}, ${m_line.top})`);


//==============================================================================================//
//                          Create X-Titles
//=============================================================================================//   
    // Create X title for years,seasons and Months

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


         //Add Title to the chart
    var YearsTitle = svg_line.append("g").append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + 15)
        .attr("text-anchor", "middle")  
        .style("font-size", "11.5px") 
        // .style("text-decoration", "underline")
        .style("font-weight", "bold")   
        .text("Avg. Temperature change since 1961");


    //set data for line creation---------------------------------------------------------------//

    //Parse time 
    var parseTime = d3.timeParse("%Y");
    var years = yearData.Year ;
    //parse years
    years = years.map(data => parseTime(data));

    avg_tem = yearData['Avg Temp Change'];
    //parse avg temp
    avg_tem = avg_tem.map(data => +data)

    console.log(d3.extent(years));

    // Create Scales
    //= ============================================//
    var xTimeScale = d3.scaleTime()
                       .domain([d3.min(years), d3.max(years)])
                       .range([0, lineChartWidth]).nice();
    var yLinearScale = d3.scaleLinear()
                          .domain([d3.min(avg_tem)-0.2, d3.max(avg_tem)+0.2])
                          .range([lineChartHeight, 0]).nice();

    // Create Axes
    // =============================================
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
    var leftAxis = d3.axisLeft(yLinearScale).ticks();
                      
    // Append the axes to the chartGroup
    // ==============================================
    // Add bottomAxis
    var xGroup = chartGroup.append("g").attr("transform", `translate(0, ${lineChartHeight})`).call(bottomAxis);

    // Add leftAxis to the left side of the display
    var yGroup = chartGroup.append("g").call(leftAxis);

    //Set Y-title for the temperature
    var YTitle = createYTitle("black", "Temperature \u00B0C", 100) ;


    //create a list of data object
    var temp_list = [];
    years.forEach((year,i) =>{
        var temp_obj = {"year":year, "temp" : +avg_tem[i]}
        //console.log(temp_obj)
        temp_list.push(temp_obj)
    })
    //console.log(temp_list)

    //===========================================================================//
    //  function to create a line path for Years data
    //===========================================================================//

    function createYearChart(temp_list){
        //console.log(temp_list)
        //Set Y-title visible 
        YTitle.attr("display","inline");
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
                                  .attr("stroke-width",2)
                                  .attr('opacity', 0.8);
                              
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


        var circleColor = "#9966FF" ; 
        createCircle(temp_list,circleColor);
        
    }

    createYearChart(temp_list);

    // Function to append circles to data points
    //===========================================//

    function createCircle(data, color){
        //console.log(data)
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

    //==========================================================================================//
    //               Set the stage for season data
    //=========================================================================================//

    //set Y axis Title for the Seasons
    //1: Create a function to create Y titles
    function createYTitle(color, title, position){
        var yTitle = svg_line.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left +40)
                .attr("x", 0 - (chartHeight -position))
                .attr("dy", "1em")
                .attr("class", "WG aText")
                .text(title)
                .attr("fill", color)
                .attr("display","None");
            return yTitle;
        }

    //==================================//
    //   create seasons Y-title
    //=================================//
    //1: Add Winter to Y axis
    var WG = createYTitle("blue", "Winter", 30) ;
    //2: Add Spring to Y axis
    var SPG = createYTitle("green", "Spring", 90) ;
    //2: Add Summer to Y axis
    var SMG = createYTitle("red","Summer", 150) ;
    //2: Add Fall to Y axis
    var FG = createYTitle("orange","Fall", 210) ;    
    
    //==================================//
    //   create Months Y-title
    //=================================//

    //1: Add Winter to Y axis
    var Jan = createYTitle("#0066ff", 'Ja',0) ; 
    var Feb = createYTitle("#3333ff", 'Fb',25) ; 
    var Mar = createYTitle("#85b81f",'Mr' ,50) ;
    var Apr = createYTitle("#33cc33",'Ap' ,75) ;
    var May = createYTitle("#006600", 'Ma',95) ;
    var Jun = createYTitle("#a60059", 'Ju',115) ;
    var Jul = createYTitle("#e6001a",'Jl' ,135) ;
    var Aug = createYTitle("#ff0000", 'Ag',155) ;
    var Sep = createYTitle("#ff8585", 'Sp',175) ;
    var Oct = createYTitle("#ff7070",'Oc' ,195) ;
    var Nov = createYTitle("#ff9900",'Nv' ,220) ;
    var Dec = createYTitle("#0099ff",'Dc' ,240) ;

//================================================//
//  Line genrator function
//----------------------//
//===============================================//
function generateLine(key, data,color){
    // Line generator for Fall data
    var line = d3.line()
    .x(d => xTimeScale(d.year))
    .y(d => yLinearScale(d[key]));

    // Append a path element to the svg, make sure to set the stroke, stroke-width, and fill attributes.
    //clear previous groups
    // chartGroup.selectAll(".lgr").remove();
    // chartGroup.selectAll(".ygr").remove();
    var lineGroup = chartGroup.append('g')
                        .attr("class", "lgr")
                        .append("path")
                        .attr("d", line(data))
                        .attr("fill", "none")
                        .attr("stroke", color)
                        .attr("stroke-width",2)
                        .attr('opacity',0.8);

    return lineGroup;
}


//===========================================================================//
//          Function to create line for each season
//===========================================================================//
    function lineSeasons(){
        //Make the Y-titles visisble
        WG.attr("display","inline");
        SPG.attr("display","inline");
        SMG.attr("display","inline");
        FG.attr("display","inline");

        //clear previous groups
        chartGroup.selectAll(".lgr").remove();
        chartGroup.selectAll(".ygr").remove()
        //chartGroup.selectAll(".lgr").atrr("display","none");

        //select dMin and Dmax for yDomain
        var minlist =[] ;
        var maxlist =[] ;
        Object.entries(seasonData[0]).forEach( ([key,value])=> {                                
            if((key != "Year") & (key != "Country") & (key != "Data Found")) {  
                minlist.push(d3.min(value))  ; 
                maxlist.push(d3.max(value))  ;            
            }            
        });
        // console.log("min list",minlist);
        // console.log("max list",maxlist);

        var dMin = d3.min(minlist);
        var dMax = d3.max(maxlist);

        // console.log("min",dMin);
        // console.log("max",dMax);

        //Set x and yscales
        yLinearScale.domain([dMin,dMax]).nice() ;

        //change chart width to fit in the scale
        lineChartWidth = width - m_line.left +1 - m_line.right;
        //xTimeScale.range([0, lineChartWidth]).nice();

        // updates x axis with transition
        yGroup.transition().duration(500).call(d3.axisLeft(yLinearScale)) 

        var winterData = seasonData[0].Winter.map(d => +d) ;
        var springData = seasonData[0].Spring.map(d => +d) ;
        var summerData = seasonData[0].Summer.map(d => +d) ;

        //Create a list of Objects
        seasonLine = [] ;
        years.forEach((year,i) => {
            var seasonLineObj = {
                "year": year,
                "Winter": winterData[i],
                "Spring":springData[i],
                "Summer":summerData[i],
            }                  

        if(seasonData[0].Fall != "nodata"){      
            var fallData = seasonData[0].Fall.map(d => +d) ;
            seasonLineObj["Fall"] = fallData[i] ;
        }
        seasonLine.push(seasonLineObj);

    });
        
        //console.log("winterData", winterData)


             
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
        var lineGroup = chartGroup.append('g')
                            .attr("class", "lgr")
                            .append("path")
                            .attr("d", lineWin(seasonLine))
                            .attr("fill", "none")
                            .attr("stroke", "blue")
                            .attr("stroke-width",2)
                            .attr('opacity',0.8);

        // append line
        var lineGroup1 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineSpr(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "green")
                                  .attr("stroke-width",2)
                                  .attr('opacity',0.8);

        var lineGroup2 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineSum(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "red")
                                  .attr("stroke-width",2)
                                  .attr('opacity',0.8);
    
        var lineGroup3 = chartGroup.append('g')
                                  .attr("class", "lgr")
                                  .append("path")
                                  .attr("d", lineFal(seasonLine))
                                  .attr("fill", "none")
                                  .attr("stroke", "orange")
                                  .attr("stroke-width",2)
                                  .attr('opacity',0.8);

//=================================================================================//
//  Events - Seasons Y title on click
//=================================================================================//

        //Event - When clicked on ytitle for winter
        WG.on("click", function() {

            //set other titles as inactive
            WG.classed("inactive inactive:hover" , false)
            SPG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , true)
            FG.classed("inactive inactive:hover" , true)
            //YTitle.attr("display","none");

            //make linegroups 1 , 2 and 3 invisible
            lineGroup.transition().duration(1000).attr('display','inline')
            lineGroup1.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','none')
            lineGroup3.transition().duration(1000).attr('display','none')

            //create an object with just year and temp for createcircle function              
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

            //create an object with just year and temp for createcircle function              
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

            //create an object with just year and temp for createcircle function            
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
            FG.classed("inactive inactive:hover" , false)
            SPG.classed("inactive inactive:hover" , true)
            WG.classed("inactive inactive:hover" , true)
            SMG.classed("inactive inactive:hover" , true)
            
        
            //make linegroups 1 , 2 and 3 invisible
            lineGroup1.transition().duration(1000).attr('display','none')
            lineGroup.transition().duration(1000).attr('display','none')
            lineGroup2.transition().duration(1000).attr('display','none')
            lineGroup3.transition().duration(1000).attr('display','inline')


            //check to see if property exists
            seasonLine.forEach(obj => {
                if("Fall" in obj){
                    var fallCircleData = seasonLine.map(obj => {
                        obj = {'year': obj.year ,  'temp':+obj.Fall}
                        return obj ;
                    })
                    // console.log("fall data", fallCircleData)
        
                    var circleColor = "#9999FF"
                    createCircle(fallCircleData, circleColor);
                }

            })



        });
                     

    }


//================================================================================================================//
//                                            X -axis click events on line chart
//===============================================================================================================//


    //When X-title Months is clicked
    SG.on("click", seasonline);
    
    //function to generate season lines
    function seasonline() {
        // get value of the selection
        // var value = d3.select(this).text();      
        // console.log(`Value of clicked title : ${value}`);
        
        
        // //set hover and active values
        // if(value === 'Seasons'){
            
        // //set style when event occures
        // d3.select(this).classed("inactive inactive:hover" , false)


        //disable season text
        SG.classed("inactive inactive:hover" , false)
        yearG.classed("inactive inactive:hover" , true)
        MG.classed("inactive inactive:hover" , true)
        YTitle.attr("display","none");

        WG.attr("display","inline").classed("inactive inactive:hover" , false);
        SPG.attr("display","inline").classed("inactive inactive:hover" , false);
        SMG.attr("display","inline").classed("inactive inactive:hover" , false);
        FG.attr("display","inline").classed("inactive inactive:hover" , false);
        

        //Make the Months Y-titles none
        Jan.attr("display","none");
        Feb.attr("display","none");
        Mar.attr("display","none");
        Apr.attr("display","none");
        May.attr("display","none");
        Jun.attr("display","none");
        Jul.attr("display","none");
        Aug.attr("display","none");
        Sep.attr("display","none");
        Oct.attr("display","none");
        Nov.attr("display","none");
        Dec.attr("display","none");

        //call line creator function for seasons
        lineSeasons();

        }       

    

    //When X-title year is clicked

    yearG.on("click", function() {

        //set y-title active
        YTitle.attr("display","inline");

        //Make other titles inactive
        SG.classed("inactive inactive:hover" , true)
        MG.classed("inactive inactive:hover" , true)
        yearG.classed("inactive inactive:hover" , false)

        //clear Ytitles
        SPG.attr('display','none')
        WG.attr('display','none')
        SMG.attr('display','none')
        FG.attr('display','none')

        //Make the Months Y-titles none
        Jan.attr("display","none");
        Feb.attr("display","none");
        Mar.attr("display","none");
        Apr.attr("display","none");
        May.attr("display","none");
        Jun.attr("display","none");
        Jul.attr("display","none");
        Aug.attr("display","none");
        Sep.attr("display","none");
        Oct.attr("display","none");
        Nov.attr("display","none");
        Dec.attr("display","none");
    
        //make linegroups 1 , 2 and 3 invisible
        chartGroup.selectAll(".lgr").attr('display','none');

        //Set y scale again and call y axis
        yLinearScale.domain([d3.min(avg_tem)-0.2, d3.max(avg_tem)+0.2]).nice();
        // updates x axis with transition
        yGroup.transition().duration(500).call(d3.axisLeft(yLinearScale)) 

        //console.log(temp_list)
        //create line path -call the function to create
        createYearChart(temp_list);

    });

       
    //parse date and numbers        
    monthsData.forEach(obj => {
        Object.keys(obj).forEach(key =>{
            if(key === "year"){
                obj[key] = parseTime(obj[key]);
                //console.log(obj[key])
            }
            else {
                obj[key] =+obj[key];
            }
        });
    });

    MG.on("click", buildMonthsLineChart);
    
    function buildMonthsLineChart() {
        //Make other titles inactive

        YTitle.attr("display","none");
        SG.classed("inactive inactive:hover" , true)
        MG.classed("inactive inactive:hover" , false)
        yearG.classed("inactive inactive:hover" , true)



        //clear Ytitles of seasons svg area
        SPG.attr('display','none')
        WG.attr('display','none')
        SMG.attr('display','none')
        FG.attr('display','none')

        //set other titles as inactive
        Dec.classed("inactive inactive:hover" , false);
        Feb.classed("inactive inactive:hover" , false);
        Jan.classed("inactive inactive:hover" , false);           
        Mar.classed("inactive inactive:hover" , false);
        Apr.classed("inactive inactive:hover" , false);
        May.classed("inactive inactive:hover" , false);
        Jun.classed("inactive inactive:hover" , false);
        Jul.classed("inactive inactive:hover" , false);
        Aug.classed("inactive inactive:hover" , false);
        Sep.classed("inactive inactive:hover" , false);
        Oct.classed("inactive inactive:hover" , false);
        Nov.classed("inactive inactive:hover" , false);

        //Clear any path in the chart area
        chartGroup.selectAll(".lgr").attr('display','none');
        chartGroup.selectAll(".ygr").attr('display','none');

        //Print data
        console.log("Months Data: ", monthsData);
        var janData = d3.extent(monthsData.map(obj => obj.January));
        var febData = d3.extent(monthsData.map(obj => obj.February));
        var marData = d3.extent(monthsData.map(obj => obj.March));
        var aprData = d3.extent(monthsData.map(obj => obj.April));
        var mayData = d3.extent(monthsData.map(obj => obj.May));
        var junData = d3.extent(monthsData.map(obj => obj.June));
        var julData = d3.extent(monthsData.map(obj => obj.July));
        var augData = d3.extent(monthsData.map(obj => obj.August));
        var sepData = d3.extent(monthsData.map(obj => obj.September));
        var octData = d3.extent(monthsData.map(obj => obj.October));
        var novData = d3.extent(monthsData.map(obj => obj.November));
        var decData = d3.extent(monthsData.map(obj => obj.December));

        var MonthsMin = [];
        var MonthsMax = [];
        Object.keys(monthsData[0]).forEach(key =>{

            if(key != "year"){
                MonthsMin.push(d3.min(monthsData.map(obj => obj[key])));
                MonthsMax.push(d3.max(monthsData.map(obj => obj[key])));
            }           
        });            

        // console.log(MonthsMin);
        // console.log(MonthsMax);

        //Set y scale again and call y axis
        yLinearScale.domain([d3.min(MonthsMin)-0.2, d3.max(MonthsMax)+0.2]).nice();
        // updates x axis with transition
        yGroup.transition().duration(500).call(d3.axisLeft(yLinearScale)) ;

        //Make the Y-titles visible
        Jan.attr("display","inline");
        Feb.attr("display","inline");
        Mar.attr("display","inline");
        Apr.attr("display","inline");
        May.attr("display","inline");
        Jun.attr("display","inline");
        Jul.attr("display","inline");
        Aug.attr("display","inline");
        Sep.attr("display","inline");
        Oct.attr("display","inline");
        Nov.attr("display","inline");
        Dec.attr("display","inline");



        //Set colors for each month
        const ranColor = ['#0066ff',"#3333ff",'#85b81f',"#33cc33" ,"#006600","#a60059","#e6001a","#ff0000","#ff8585","#ff7070",'#ff9900','#0099ff'];
        var linegroup = [];
        Object.keys(monthsData[0]).forEach((key,i) =>{
            //console.log(key,i)
            if(key != "year"){
                linegroup[i] = generateLine(key,monthsData,ranColor[i]);

            }
        });

        var decgroup = generateLine("December",monthsData,'#0000CD');

        //=========================================================================================//
        //     Events - Y axis title on click
        //========================================================================================//
        
        //Event - When clicked on ytitle for winter
        Jan.on("click", function() {

            //set other titles as inactive
            Jan.classed("inactive inactive:hover" , false)
            Feb.classed("inactive inactive:hover" , true)
            Mar.classed("inactive inactive:hover" , true)
            Apr.classed("inactive inactive:hover" , true)
            May.classed("inactive inactive:hover" , true)
            Jun.classed("inactive inactive:hover" , true)
            Jul.classed("inactive inactive:hover" , true)
            Aug.classed("inactive inactive:hover" , true)
            Sep.classed("inactive inactive:hover" , true)
            Oct.classed("inactive inactive:hover" , true)
            Nov.classed("inactive inactive:hover" , true)
            Dec.classed("inactive inactive:hover" , true)


            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 1){
                    gr.transition().duration(1000).attr('display','inline')
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none')
                    decgroup.transition().duration(1000).attr('display','none')

                }
            })

            //create an object with just year and temp for createcircle function              
            var JCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.January}
                return obj ;
            });
            
            var circleColor = "orange"
            createCircle(JCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Feb.on("click", function() {
        
            //set other titles as inactive
            Feb.classed("inactive inactive:hover" , false)
            Jan.classed("inactive inactive:hover" , true)            
            Mar.classed("inactive inactive:hover" , true)
            Apr.classed("inactive inactive:hover" , true)
            May.classed("inactive inactive:hover" , true)
            Jun.classed("inactive inactive:hover" , true)
            Jul.classed("inactive inactive:hover" , true)
            Aug.classed("inactive inactive:hover" , true)
            Sep.classed("inactive inactive:hover" , true)
            Oct.classed("inactive inactive:hover" , true)
            Nov.classed("inactive inactive:hover" , true)
            Dec.classed("inactive inactive:hover" , true)
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 2){
                    gr.transition().duration(1000).attr('display','inline')
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none')
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var FCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.February}
                return obj ;
            })
        
            var circleColor = "#0066ff"
            createCircle(FCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Mar.on("click", function() {
        
            //set other titles as inactive
            Mar.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 3){
                    gr.transition().duration(1000).attr('display','inline')
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var MarCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.March}
                return obj ;
            })
        
            var circleColor = "#AE98AA"
            createCircle(MarCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Apr.on("click", function() {
        
            //set other titles as inactive
            Apr.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 4){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var AprCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.April}
                return obj ;
            })
        
            var circleColor = "#8BA8B7"
            createCircle(AprCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        May.on("click", function() {
        
            //set other titles as inactive
            May.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 5){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var MayCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.May}
                return obj ;
            })
        
            var circleColor = "#9DE093"
            createCircle(MayCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Jun.on("click", function() {
        
            //set other titles as inactive
            Jun.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 6){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var JunCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.June}
                return obj ;
            })
        
            var circleColor = "#63B76C"
            createCircle(JunCircleData, circleColor);
        });
        
        //Event - When clicked on ytitle for winter
        Jul.on("click", function() {
        
            //set other titles as inactive
            Jul.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 7){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var JulCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.July}
                return obj ;
            })
        
            var circleColor = "#339ACC"
            createCircle(JulCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Aug.on("click", function() {
        
            //set other titles as inactive
            Aug.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 8){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var augCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.August}
                return obj ;
            })
        
            var circleColor = "#00CC99"
            createCircle(augCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Sep.on("click", function() {
        
            //set other titles as inactive
            Sep.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 9){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var sepCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.September}
                return obj ;
            })
        
            var circleColor = "#339ACC"
            createCircle(sepCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Oct.on("click", function() {
        
            //set other titles as inactive
            Oct.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Nov.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 10){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            })
        
            //create an object with just year and temp for createcircle function              
            var octCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.October}
                return obj ;
            })
        
            var circleColor = "#6CDAE7"
            createCircle(octCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Nov.on("click", function() {
        
            //set other titles as inactive
            Nov.classed("inactive inactive:hover" , false);
            Feb.classed("inactive inactive:hover" , true);
            Jan.classed("inactive inactive:hover" , true)  ;           
            Mar.classed("inactive inactive:hover" , true);
            Apr.classed("inactive inactive:hover" , true);
            May.classed("inactive inactive:hover" , true);
            Jun.classed("inactive inactive:hover" , true);
            Jul.classed("inactive inactive:hover" , true);
            Aug.classed("inactive inactive:hover" , true);
            Sep.classed("inactive inactive:hover" , true);
            Oct.classed("inactive inactive:hover" , true);
            Dec.classed("inactive inactive:hover" , true);
        
        
            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 11){
                    gr.transition().duration(1000).attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    decgroup.transition().duration(1000).attr('display','none');
                }
            });
        
            //create an object with just year and temp for createcircle function              
            var novCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.November}
                return obj ;
            })
        
            var circleColor = "#5F9EA0"
            createCircle(novCircleData, circleColor);
        });

        //Event - When clicked on ytitle for winter
        Dec.on("click", function() {

            //set other titles as inactive
            Dec.classed("inactive inactive:hover" , false)
            Feb.classed("inactive inactive:hover" , true)
            Mar.classed("inactive inactive:hover" , true)
            Apr.classed("inactive inactive:hover" , true)
            May.classed("inactive inactive:hover" , true)
            Jun.classed("inactive inactive:hover" , true)
            Jul.classed("inactive inactive:hover" , true)
            Aug.classed("inactive inactive:hover" , true)
            Sep.classed("inactive inactive:hover" , true)
            Oct.classed("inactive inactive:hover" , true)
            Nov.classed("inactive inactive:hover" , true)
            Jan.classed("inactive inactive:hover" , true)

            //make linegroups 1 , 2 and 3 invisible
            linegroup.forEach((gr,i) => {
                // console.log(i)
                if(i === 12){
                    //create a path
                    decgroup.attr('display','inline');
                    // console.log(i)
                }
                else{
                    gr.transition().duration(1000).attr('display','none');
                    
                }
            });

            //create an object with just year and temp for createcircle function              
            var DCircleData = monthsData.map(obj => {
                obj = {'year': obj.year ,  'temp':+obj.December}
                return obj ;
            });
            
            var circleColor = "#3CB371"
            createCircle(DCircleData, circleColor);
        });



    
};




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
                    if(key != "year"){
                        temp_list1 = monthsData.map(obj => obj[key])
                        //console.log("Mean Data", temp_list)
                        meanMonthsData[key] = d3.mean(temp_list1) ;
                };           
            //print        
            //console.log("Mean months Data", meanMonthsData)
            });
                // set the color scale
                var color = d3.scaleOrdinal()
                              .domain(Object.keys(meanMonthsData))
                              .range(d3.schemeDark2);                      

                //call pie functon
                buildChartPie(radius,piegroup, color, value, meanMonthsData) ; 
                buildMonthsLineChart();

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
                buildChartPie(radius, piegroup, color,value,newSeasonobj);
                seasonline();

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
       .sort(function(a, b) {return b.key.localeCompare(a.key)}) ; // This make sure that group order remains the same in the pie chart

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
                       

        pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 .text(function(d){ return `${(d.data.value).toFixed(2)} \u00B0C`})
                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                 .attr('class','pie_text');
            
});
    pathGroup.on("mouseout", (d) => {

        hover = pathGroup.select("text")
                 .transition()
                 .duration(1000)
                 if(value === "Seasons"){
                    hover.text(function(d){ return d.data.key})
                         .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                         .attr('class','mon_text')
                 }
                 else {
                    hover.text(function(d){ return (d.data.key).slice(0,3)})
                         .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                         .attr('class','mon_text');
                 }
                 
                
                     
});
             



}