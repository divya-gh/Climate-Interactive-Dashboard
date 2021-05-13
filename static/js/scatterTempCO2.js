

 function scatterchart(data){

   d3.select("div#scatter").html("");

   console.log('ScatterData :', data);

   var svgWidth = 400;
   var svgHeight = 300;
   
   var margin = {
     top: 20,
     right: 20,
     bottom: 30,
     left: 40
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

  //Parse time 
  var parseTime = d3.timeParse("%Y");
  var years = data.Year ;
  years = years.map(data => parseTime(data));

  //get temp data
  var temp_data = data['Avg Temp Change'];
  temp_data = temp_data.map(d => +d) ;
 

  //Create a list data obj

  var tempCo2Data = [] ;
  temp_data.forEach((d,i) =>{
     
       var obj = {
         'year':years[i],
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
   console.log("min and max temp" , tmin,tmax);

   var xTimeScale = d3.scaleTime()
   .domain([d3.min(years), d3.max(years)])
   .range([0, width]).nice();

  var yLinearScale = d3.scaleLinear()
  .domain([tmin-0.2, tmax+0.2])
  .range([height, 0]).nice();

  // Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xTimeScale);
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
           .attr("r", 6)
           .attr("fill", d => pickColor(d.co2))
           .attr("opacity", 0.8);                            

// //append text to each group            
circlesGroup.append("text")
           .text(d => `${d.co2}`)
           .attr("x", (d) => xTimeScale(d.year))
           .attr("y", function (d) {
             return (yLinearScale(d.temp)+2)
           }).transition()
           .duration(300)
           .attr("class", "set_text")
           .style("display", 'none')
           ;

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
                 .attr("r", 6)
               d3.select(this).select('text')
                 .transition()
                 .duration(1000)
                 .style("display", 'none');
});

// transition on page load
chartGroup.selectAll("circle")
.transition()
.duration(100)
.attr("cx", (d) => width/2)
.attr("cy", d => height)
.transition()
.duration(100)
.attr("cx", (d) => xTimeScale(d.year))
.attr("cy", d => yLinearScale(d.temp));


function pickColor(co2){

  //console.log(co2)
  var limit1 = co2max/12 ;
   var limit2 = co2max/11 ;
   var limit3 = co2max/10;
   var limit4 = co2max/9;
   var limit5 = co2max/8;
   var limit6 = co2max/7;
   var limit7 = co2max/6 ;
   var limit8 = co2max/5;
   var limit9 = co2max/4;
   var limit10 = co2max/3
   var limit11 = co2max/2;
   var limit12 = co2max/1.5;
   var limit =co2max;



  if(co2 >= limit12){
    return '#DF013A';
  }
  else if(co2>=limit10){
    return "#ff4500";
  }
  else if(co2>=limit10){
    return "#ff4500";
  }
  else if(co2>=limit9){
    return "#ff9457";
  }
  else if(co2>limit8){
    return "#DF7401" ;
  }
  else if(co2>limit7){
    return "#FAAC58" ;
  }
  else if(co2>=limit6){
    return "#FACC2E";
  }
  else if(co2>limit5){
    return "#F7FE2E" ;
  }
  else if(co2>limit4){
    return "#E1F5A9" ;
  }
  else if(co2>limit3){
    return "#C8FE2E" ;
  }
  else if(co2>limit2){
    return "#C8FE2E" ;
  }
  else if(co2>limit1){
    return "#82FA58" ;
  }
  else if(co2 >= 0){
    return "#088A29" ;
  } 

}

// Set Y title for the scatter chart
var yTitle = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left + 40)
                .attr("x", 0 - (height -100))
                .attr("dy", "1em")
                .attr("class", "aText active")
                .text("Temperature  \u00B0C")
                //.attr("fill", black)
                .attr("display", "inline")    
                
 //Add Title to the chart
 var MainTitle = svg.append("g").append("text")
                          .attr("x", 200)             
                          .attr("y", 0 + 15)
                          .attr("text-anchor", "middle")  
                          .style("font-size", "11.5px") 
                          // .style("text-decoration", "underline")
                          .style("font-weight", "bold")   
                          .text("Correlation Between Temperation and Co2 Emission");


  };





 
    

 
