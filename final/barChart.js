var country = localStorage.getItem("country");
var happiness = localStorage.getItem("happiness_ladder");
var smile = localStorage.getItem("smile");
var social_support = localStorage.getItem("social_support");
var worry = localStorage.getItem("negative_affect");
var generosity = localStorage.getItem("generosity");
var life_expectancy = localStorage.getItem("life_expectancy");
var selected1 = document.getElementById("bar-happiness");
selected1.classList.add("selected");
var barSVG = document.getElementById("barSVG");
barSVG.setAttribute("width",  .8 * window.innerWidth);
barSVG.setAttribute("height", .9 * window.innerHeight);

var svgBar = d3v4.select("svg"),
    margin = {top: 20, right: 10, bottom: 150, left: 20},
    width = +svgBar.attr("width") - margin.left  - margin.right,
    height = +svgBar.attr("height") - margin.top - margin.bottom;
    console.log(width, height);

var x = d3v4.scaleBand().range([0, width]),
    y = d3v4.scaleLinear().rangeRound([height, 0]);

var g = svgBar.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3v4.select("body").append("div").attr("class", "tooltipBar");

var phrase = "Happiness";

document.getElementById("bar-happiness").addEventListener("click",function(e){
    selected1.classList.remove("selected");
    selected1 = document.getElementById("bar-happiness");
    selected1.classList.add("selected");
    console.log('called')
    phrase = "Happiness";
    drawBar(barData);
});
document.getElementById("bar-social-support").addEventListener("click",function(e){
    selected1.classList.remove("selected");
    selected1 = document.getElementById("bar-social-support");
    selected1.classList.add("selected");
    console.log('called')
    phrase = "Social Support";
    drawBar(barData);
});
document.getElementById("bar-generosity").addEventListener("click",function(e){
    selected1.classList.remove("selected");
    selected1 = document.getElementById("bar-generosity");
    selected1.classList.add("selected");
    console.log('called')
    phrase = "Generosity";
    drawBar(barData);
});
document.getElementById("bar-positive-affect").addEventListener("click",function(e){
    selected1.classList.remove("selected");
    selected1 = document.getElementById("bar-positive-affect");
    selected1.classList.add("selected");
    console.log('called')
    phrase = "Positive Affect";
    drawBar(barData);
});
document.getElementById("bar-negative-affect").addEventListener("click",function(e){
    selected1.classList.remove("selected");
    selected1 = document.getElementById("bar-negative-affect");
    selected1.classList.add("selected");
    console.log('called')
    phrase = "Negative Affect";
    drawBar(barData);
});

var barData = null;

/////////////////////////////////////////////////////////

    d3v4.csv("data2.csv", function(d) {
      d.country = d['Country'];
      d.frequency = +d[phrase];
      return d;
    }, function(error, data) {
         if (error) throw error;

          barData = data;
          var you = {"Country": "You", "Happiness": happiness, "Life Expectancy/10": life_expectancy, "Social Support": social_support, "Generosity": generosity, "Positive Affect": smile, "Negative Affect": worry, country: "You", frequency: phrase};
          data.unshift(you);
        drawBar(data);
    }
    );

     function drawBar (data) {


        data.sort(function(a,b){
            return a[phrase] - b[phrase];
        })
      x.domain(data.map(function(d) { return d.country; }));
      y.domain([0, 10]);
    console.log(data)

    g.selectAll('.bar-axis').remove()
    g.selectAll('.bar').remove()

      g.append("g")
          .attr("class", "bar-axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3v4.axisBottom(x).tickSizeOuter(0))
          .selectAll("text")
          .style("text-anchor", "end")
          .style("font-size", "7px")
          .attr("dx", "-1em")
          .attr("dy", "-.5em")
          .attr("transform", "rotate(-65)");;


      g.append("g")
          .attr("class", "bar-axis axis--y")
          .call(d3v4.axisLeft(y).ticks(10).tickSizeOuter(0))
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
          .attr("y", function(d) { return y(d[phrase]); })
          .attr("width", x.bandwidth())
          .style("opacity", function(d) { return (d.Country == "You" || d.country == country) ? "0.8" : "0.5"})
          .on("mouseover", function(d){
                d3v4.select(this).style("fill", function(d,i)
                {return highlightPicker(d.Country);})
                .style("opacity", "0.8")
                tooltip
                  .style("left", d3v4.event.pageX - 60 + "px")
                  .style("top", (.9 * window.innerHeight) + y(d[phrase]) + 520 + "px")
                  .style("display", "inline-block")
                  .html((d.country + "<br>" + d[phrase]))
          console.log((.9 * window.innerHeight) - y(d[phrase]));
          console.log(y(d[phrase]))
            })

          .on("mouseout", function(d){
                d3v4.select(this).style("fill", function(d,i)
                {return colorPicker(d.Country);})
                .style("opacity", function(d) { return (d.Country == "You" || d.country == country) ? "0.8" : "0.5"})
                tooltip.style("display", "none");})

          .attr("height", function(d) { return height - y(d[phrase]); });
        console.log(x.bandwidth());

      function colorPicker(v){
          // if(v == "You") { return "#FF0000"}
          // if (v == country) { return "#ffeb00"}
          // else{ return "#4682b4";}
          if (v == "You") { return 'red'}//'#bf0a0a }
          if (v == country) { return 'blue'}//'#29388d' }
          else{ return "#AAA";}
      }
      function highlightPicker(v){
          // if(v == "You") { return "#ff8900"}
          // if (v == country) { return "#ff8900"}
          if(v == "You") { return '#bf0a0a'} //'#760606' }
          if (v == country) { return '#29388d'}//'#19235a' }
          else{ return "#666";}
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

    }
