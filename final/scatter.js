var margin;
var scatterWidth;
var scatterHeight;
var selected;
var radius = 4;
var dotcolor = "#225378";
var inputcolor ="#EB7F00";
selected = document.getElementById("gdp-button");
selected.classList.add("selected1");

let scatterPlotMargin = { top: 10, right: 20, bottom: 30, left: 30 }
var margin = {top: 20, right: 0, bottom: 0, left: 20};
    //var plot_width = document.getElementById("#scatter-plot-row").width;
    //console.log(plot_width);
    scatterWidth = document.getElementById("scatter-plot").clientWidth - scatterPlotMargin.left - scatterPlotMargin.right;
    scatterHeight = document.getElementById("scatter-plot").clientHeight - scatterPlotMargin.top - scatterPlotMargin.bottom;
// setup x, in this case the values in X axis are the calories
// We need to define the range, scale and position
var xValue = function(d) { return d["Life Ladder"];}, // data -> value
    xScale = d3.scale.linear().range([0, scatterWidth]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var inputHappiness=parseInt(localStorage.getItem("happiness"));
var inputComaparison = 7;
var inputCountry = localStorage.getItem("country");
var year = 2015;

var color =dotcolor;
var comparisonColumn = "Log GDP per capita";
// setup y, in this case the values in X axis are the proteins
// We need to define the range, scale and position
var yValue = function(d) { return d[comparisonColumn];}, // data -> value
    yScale = d3.scale.linear().range([scatterHeight, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color, manufaturer is just a column in our data
var cValue = function(d){ return d.country;}
 //var color = d3.scale.category10();

// add the graph canvas to the body of the webpage
// svg is similar to the 'ctx' element from our in class tutorial
var scattersvg = d3.select("#scatter-plot").append("svg") // here the canvas is just in the body
    .attr("width", scatterWidth + scatterPlotMargin.left + scatterPlotMargin.right)
    .attr("height", scatterHeight + scatterPlotMargin.top + scatterPlotMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + scatterPlotMargin.left + "," + scatterPlotMargin.top + ")");

// add the tooltip area to the webpage
var scatterTooltip = d3.select("#scatter-plot").append("div")
    .attr("class", "scatter-tooltip")
    .style("opacity", 0);




// load data
d3.csv("WHR2.csv", function(error, data) {
  // change string (from CSV) into number format

  data.forEach(function(d) {
    d["Life Ladder"] = +d["Life Ladder"];
    d[comparisonColumn] = +d[comparisonColumn];
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([Math.min(d3.min(data, xValue), inputHappiness)-0.5, Math.max(d3.max(data, xValue), inputHappiness)+0.5]);
  yScale.domain([Math.min(d3.min(data, yValue), inputComaparison)-0.5, Math.max(d3.max(data, yValue), inputComaparison)+0.5]);

  // x-axis
  scattersvg.append("g")
      .attr("class", "x scatter-axis")
      .attr("transform", "translate(0," + scatterHeight + ")")
      .call(xAxis.outerTickSize(0))
    .append("text")
      .attr("class", "label")
      .attr("x", scatterWidth)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Happiness Rating");

  // y-axis
  scattersvg.append("g")
      .attr("class", "y scatter-axis")
      .call(yAxis.outerTickSize(0))
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(comparisonColumn);

  // draw dots
  scattersvg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", radius)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color;})//
      .on("mouseover", function(d) {
          scatterTooltip.transition()
               .duration(200)
               .style("opacity", .9);
          scatterTooltip.html(d["Country"] + "<br/> (" + xValue(d)
	        + ", " + yValue(d) + ")")
               .style("left", (event.pageX + 50) + "px")
               .style("top", (event.pageY + 50) + "px");
      })
      .on("mouseout", function(d) {
          scatterTooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

    //add users point
    scattersvg.append("circle")
    .attr("class","dot input")
    .attr("r",radius)
    .attr("cx",xScale(inputHappiness))
    .attr("cy",yScale(inputComaparison))
    .style("fill", inputcolor)
    .on("mouseover", function(d) {
          scatterTooltip.transition()
               .duration(200)
               .style("opacity", .9);
          scatterTooltip.html("You" + "<br/> (" +inputHappiness.toString()+ ", " + inputComaparison + ")")
            .style("left", (event.pageX + 50) + "px")
            .style("top", (event.pageY + 50) + "px");
      })
      .on("mouseout", function(d) {
          scatterTooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });



});

document.getElementById("generosity-button").addEventListener("click",function(e){
    console.log(document.getElementById("generosity-button").value);
    comparisonColumn = "Generosity";
    inputComaparison = 1;
    color = "#225378";//"#1695A3";
    selected.classList.remove("selected");
    selected = document.getElementById("generosity-button");
    selected.classList.add("selected");
    updateData();



});

document.getElementById("social-support-button").addEventListener("click",function(e){
    console.log(document.getElementById("social-support-button").value);
    comparisonColumn = "Social Support";
    color = dotcolor;//"#225378";
    inputComaparison = 1;
    selected.classList.remove("selected");
    selected = document.getElementById("social-support-button");
    selected.classList.add("selected");
    updateData();
});

document.getElementById("life-expectancy-button").addEventListener("click",function(e){
    console.log(document.getElementById("life-expectancy-button").value);
    comparisonColumn = "Healthy life expectancy at birth";
    color = dotcolor;//"#B4DC7F";
    inputComaparison = 60;
    selected.classList.remove("selected");
    selected = document.getElementById("life-expectancy-button");
    selected.classList.add("selected");
    updateData();
});
document.getElementById("gdp-button").addEventListener("click",function(e){
    console.log(document.getElementById("gdp-button").value);
    comparisonColumn = "Log GDP per capita";
    inputComaparison = 4;
    color = dotcolor;//"#ACF0F2";
    selected.classList.remove("selected");
    selected = document.getElementById("gdp-button");
    selected.classList.add("selected");
    updateData();
});
document.getElementById("positive-affect-button").addEventListener("click",function(e){
    console.log(document.getElementById("positive-affect-button").value);
    comparisonColumn ="Positive Affect";
    inputComaparison = 4;
    color = dotcolor;//"#ACF0F2";
    selected.classList.remove("selected");
    selected = document.getElementById("positive-affect-button");
    selected.classList.add("selected");
    updateData();
});
document.getElementById("negative-affect-button").addEventListener("click",function(e){
    console.log(document.getElementById("negative-affect-button").value);
    comparisonColumn = "Negative Affect";
    inputComaparison = 4;
    color = dotcolor;//"#ACF0F2";
    selected.classList.remove("selected");
    selected = document.getElementById("negative-affect-button");
    selected.classList.add("selected");
    updateData();
});
function updateData(){
    // load data
    d3.csv("WHR2.csv", function(error, data) {
  // change string (from CSV) into number format

    data.forEach(function(d) {
        d["Life Ladder"] = +d["Life Ladder"];
        d[comparisonColumn] = +d[comparisonColumn];
    });

     scattersvg.selectAll(".dot").remove();
     d3.selectAll('.axis').remove();
    //rescale domain and range
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    if (["Log GDP per capita","Healthy life expectancy at birth","Generosity","Social Support"].includes(comparisonColumn) ){
       data.forEach(function (d){
        if (d.country ==inputCountry){
            inputComaparison = d[comparisonColumn];
            return d[comparisonColumn];

        }
            return 0;
        })
      }

    ///if (["Generosity","Social Support"].includes(comparisonColumn) ){
    if (comparisonColumn == "Generosity"){
        inputComaparison = localStorage.getItem("generosity");
        console.log("generosity");

    }
    if (comparisonColumn == "Social Support"){
        inputComaparison = localStorage.getItem("social_support");

    }
    if (comparisonColumn == "Negative Affect"){
        inputComaparison = localStorage.getItem("negative_affect");

    }
    if (comparisonColumn == "Positive Affect"){
        inputComaparison = localStorage.getItem("positive_affect");
        //console.log("social support");


    }

    //rescale domain and range
    xScale.domain([Math.min(d3.min(data, xValue), inputHappiness)-0.5, Math.max(d3.max(data, xValue), inputHappiness)+0.5]);
    yScale.domain([Math.min(d3.min(data, yValue), inputComaparison)-0.5, Math.max(d3.max(data, yValue), inputComaparison)+0.5]);

    data.forEach(function (d){
        if (d.country ==inputCountry){
            console.log(d[comparisonColumn]);

        }
    })

  scattersvg.append("g")
      .attr("class", "x scatter-axis")
      .attr("transform", "translate(0," + scatterHeight + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", scatterWidth)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Happiness Rating");

  // y-axis
  scattersvg.append("g")
      .attr("class", "y scatter-axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(comparisonColumn);

    // draw dots
    scattersvg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color;})// color(cValue(d));})
        .on("mouseover", function(d) {
        scatterTooltip.transition()
            .duration(200)
            .style("opacity", .9);
        scatterTooltip.html(d["Country"] + "<br/> (" + xValue(d)
                     + ", " + yValue(d) + ")")
            // .style("left", (event.clientX) + "px")
            // .style("top", (event.clientY) + "px");
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
        .on("mouseout", function(d) {
        scatterTooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
    console.log(comparisonColumn, inputComaparison);
    //add users point
    scattersvg.append("circle")
        .attr("class","dot input")
        .attr("r",radius)
        .attr("cx",xScale(inputHappiness))
        .attr("cy",yScale(inputComaparison))
        .style("fill", inputcolor)
        .on("mouseover", function(d) {
        scatterTooltip.transition()
            .duration(200)
            .style("opacity", .9);
        scatterTooltip.html("You" + "<br/> (" +inputHappiness.toString()+ ", " + inputComaparison + ")")
          .style("left", (event.pageX + 50) + "px")
          .style("top", (event.pageY + 50) + "px");
    })
        .on("mouseout", function(d) {
        scatterTooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });


});

}
