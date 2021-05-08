function pieChart(seasonData){

    // set the dimensions and margins of the graph
    var width = 400
    var height = 300
    var margin = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    //clear previous svg data
    d3.select("div#pie").html("")

    // append the svg object to the div called 'my_dataviz'    
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
                  //.range(d3.schemeDark2);
                  .range(['#0275d8','#5cb85c','#d9534f','#f0ad4e'])

                  //d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
                .value(function(d) {return d.value; })
                .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    
    // shape helper to build arcs:
    var arcGenerator = d3.arc()
                         .innerRadius(15)
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
                                 .attr("stroke", "darkgrey")
                                 .style("stroke-width", "3px")
                                 .style("opacity", .9)
                    //Add Labels
                        pathGroup.append('text')
                                 .transition()
                                 .duration(1000)
                                 .text(function(d){ return d.data.key})
                                 .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
                                 .attr('class','pie_text')
                  
    

}

