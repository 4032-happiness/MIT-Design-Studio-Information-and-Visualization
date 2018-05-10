var barSVG = document.getElementById("barSVG");
barSVG.setAttribute("width",  .9 * window.innerWidth);
barSVG.setAttribute("height", .9 * window.innerHeight);

var svg = d3.select("svg"),
    margin = {top: 20, right: 10, bottom: 150, left: 40},
    width = +svg.attr("width") - margin.left  - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    console.log(width, height);

var x = d3.scaleBand().range([0, width]),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var tooltip = d3.select("body").append("div").attr("class", "tooltipBar");

d3.csv("data.csv", function(d) {
  d.country = d['Country'];
  d.frequency = +d['Life Ladder'];
  return d;
}, function(error, data) {
  if (error) throw error;
    
    data.sort(function(a,b){
        return a.frequency - b.frequency;
    })

  x.domain(data.map(function(d) { return d.country; }));
  y.domain([0, 10]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")  
      .style("text-anchor", "end")
      .style("font-size", "7px")
      .attr("dx", "-1em")
      .attr("dy", "-.5em")
      .attr("transform", "rotate(-65)");;
      

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function(d){return colorPicker(d.Country);})
      .attr("x", function(d) { return x(d.country); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .on("mouseover", function(d){
            d3.select(this).style("fill", function(d,i)
            {return highlightPicker(d.Country);})
            tooltip
              .style("left", d3.event.pageX - 60 + "px")
              .style("top", y(d.frequency) - 30 + "px")
              .style("display", "inline-block")
              .html((d.country + "<br>" + d.frequency));
        })
      .on("mouseout", function(d){ 
            d3.select(this).style("fill", function(d,i)
            {return colorPicker(d.Country);})
            tooltip.style("display", "none");})
    
      .attr("height", function(d) { return height - y(d.frequency); });
    console.log(x.bandwidth());

  function colorPicker(v){
      if(v == "China") { return "#FF0000"}
      if (v == "United States") { return "#ffeb00"}
      else{ return "#4682b4";}
  }
  function highlightPicker(v){
      if(v == "China") { return "#ff8900"}
      if (v == "United States") { return "#ff8900"}
      else{ return "#00ff6c";} 
  }
    
//    data.forEach(function(item, i){  
//      if (data[i]["Country"] == "China") {
//        g.append("g")
//          .data(data)
//          .enter().append("rect")
//          .attr("class", "bar2")
//          .attr("x", function(d) { return x(d.country); })
//          .attr("y", function(d) { return y(d.frequency); })
//          .attr("width", x.bandwidth())
//          .attr("height", function(d) { return height - y(d.frequency); });
//          console.log("HIHIHIHI");
//      }
//  });
    
});
