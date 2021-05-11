

 function scatterchart(data){

   d3.select("div#scatter").html("");

   console.log('ScatterData :', data);

   var svgWidth = 400;
   var svgHeight = 300;
   
   var margin = {
     top: 20,
     right: 10,
     bottom: 30,
     left: 30
   };
   
   var width = svgWidth - margin.left - margin.right;
   var height = svgHeight - margin.top - margin.bottom;

   // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
  .select("div#scatter")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 400 300")

//Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  Co2List =[];
  var Co2Data = data["Co2 Emission"] ;

  Co2Data = Co2Data.forEach(d => {
   Co2List.push(+d) ;
  }) ;


  var years = data.Year ;
  years = years.map(data => parseTime(data));

  //get temp data
  var temp_data = data['Avg Temp Change'];
  temp_data = temp_data.map(d => +d) ;
 

  //Create a list data obj

  var tempCo2Data = [] ;
  temp_data.forEach((d,i) =>{
     
       var obj = {
          'co2': Co2List[i],
          'temp' : d 
       }

       tempCo2Data.push(obj)     
      });

  console.log("tempCo2Data" , tempCo2Data);
 


   var co2min = d3.min(Co2List);
   var co2max = d3.max(Co2List);
   console.log("min and max co2" , co2min,co2max);

   //find the min and max of temp_data
   var tmin = d3.min(temp_data);
   var tmax = d3.max(temp_data);


  var xTimeScale = d3.scaleLinear()
  .domain([co2min, co2max +1])
  .range([0, width]).nice();

  var yLinearScale = d3.scaleLinear()
  .domain([tmin, tmax+0.1])
  .range([height, 0]).nice();

  // Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Add bottomAxis
  var xGroup = chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
  // Add leftAxis to the left side of the display
  var yGroup = chartGroup.append("g").call(leftAxis);

   
   //create previous groups 
   // chartGroup.selectAll(".ygr").remove();
   var circlesGroup = chartGroup.selectAll(".ygr")
                            .data(tempCo2Data)
                            .enter()
                            .append('g')
                            .classed("ygr" , true);
//append circles to each group                             
circlesGroup.append("circle")
           .attr("r", 3)
           .attr("fill", "blue");                            

// //append text to each group            
circlesGroup.append("text")
           .text(d => `${d.co2}`)
           .attr("x", (d) => xLinearScale(d.co2))
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
.attr("cx", (d) => xLinearScale(d.co2))
.attr("cy", d => yLinearScale(d.temp));









  };

 
    

 
