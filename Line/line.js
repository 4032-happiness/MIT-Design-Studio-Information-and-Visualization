let linePlotMargin = { top: 10, right: 20, bottom: 30, left: 30 }
let linePlotWidth = d3.select('#line-plot').node().clientWidth - (linePlotMargin.right + linePlotMargin.left)
let linePlotHeight = d3.select('#line-plot').node().clientHeight - (linePlotMargin.top + linePlotMargin.bottom)

let linePlot = d3.select("#line-plot")
  .append('svg')
    .attr('width', linePlotWidth + linePlotMargin.left + linePlotMargin.right)
    .attr('height', linePlotHeight + linePlotMargin.top + linePlotMargin.bottom)
  .append('g')
    .attr('transform', `translate(${linePlotMargin.left}, ${linePlotMargin.top})`)

let lineQueue = d3.queue()
  .defer(d3.csv, './line.csv', parseLineData)
  .await(lineDataLoaded)

let lineData = {}
let lineDataAverage = []

let yourCountry = 'United States'

function parseLineData(d){
  return {
    country: d["country"],
    year: +d["year"],
    happiness: +d["Life Ladder"],
  }
}

function lineDataLoaded(err, data){
  // Parse data into a dictionary by country
  for (let d of data) {
    if (!lineData[d.country]) {
      lineData[d.country] = []
    }
    lineData[d.country].push({
      country: d.country,
      year: d.year,
      happiness: d.happiness,
    })
  }

  // Parse data into an array of averages
  for (let country of Object.keys(lineData)) {
    let sum = lineData[country].reduce((accumulator, currentValue) => accumulator + currentValue.happiness, 0)
    lineDataAverage.push({
      country: country,
      average: sum / lineData[country].length,
    })
  }
  lineDataAverage.sort((a, b) => { return a.average - b.average })

  drawLinePlot(Object.keys(lineData)) // Draw all countries
}

function highlightLinePlotHighest(number) {
  let highest = lineDataAverage.slice(lineDataAverage.length - number, lineDataAverage.length).map((d) => { return d.country })
  if (highest.indexOf(yourCountry) !== -1) {
    highest.splice(highest.indexOf(yourCountry), 1)
  }
  highlightLinePlot(highest)
}

function highlightLinePlotLowest(number) {
  let lowest = lineDataAverage.slice(0, number).map((d) => { return d.country })
  if (lowest.indexOf(yourCountry) !== -1) {
    lowest.splice(lowest.indexOf(yourCountry), 1)
  }
  highlightLinePlot(lowest)
}

function highlightLinePlotClosest(number) {
  let closest
  let allCountries = lineDataAverage.map((d) => { return d.country })
  let yourIndex = allCountries.indexOf(yourCountry)

  if (yourIndex < number / 2) { // Your country is in the highest (number/2) countries
    closest = allCountries.slice(lineDataAverage.length - number - 1, lineDataAverage.length)
  } else if (yourIndex > lineDataAverage.length - number / 2) { // Your country is in the lowest (number/2) countries
    closest = allCountries.slice(0, number + 1)
  } else {
    closest = allCountries.slice(yourIndex - number / 2, yourIndex + 1 + number / 2)
  }
  closest.splice(closest.indexOf(yourCountry), 1)
  highlightLinePlot(closest)
}

function drawLinePlot(countries) {
  // Reset the plot
  linePlot.selectAll('*').remove()

  // Define the scales
  let xMin = Infinity
  let xMax = -Infinity
  let yMin = Infinity
  let yMax = -Infinity
  for (let country of countries) {
    xMin = Math.min(Math.min.apply(Math, lineData[country].map((d) => { return d.year })), xMin)
    xMax = Math.max(Math.max.apply(Math, lineData[country].map((d) => { return d.year })), xMax)
    yMin = Math.min(Math.min.apply(Math, lineData[country].map((d) => { return d.happiness })), yMin)
    yMax = Math.max(Math.max.apply(Math, lineData[country].map((d) => { return d.happiness })), yMax)
  }
  let xScale = d3.scaleLinear().range([0, linePlotWidth]).domain([xMin - 0.5, xMax + 0.5])
  let yScale = d3.scaleLinear().range([linePlotHeight, 0]).domain([yMin - 0.5, yMax + 0.5])

  // Define the line
  let line = d3.line()
    .x(function(d){ return xScale(d.year) })
    .y(function(d){ return yScale(d.happiness) })

  // Draw the lines
  for (let country of countries) {
    let color = country === yourCountry ? 'red' : '#AAA'
    let width = country === yourCountry ? 2 : 1
    let opacity = country === yourCountry ? 1 : 0.5
    drawlinePlotLine(lineData[country], line, color, 1, opacity)
  }

  // Add the X Axis
  linePlot.append('g')
    .attr('transform', `translate(0, ${linePlotHeight})`)
    .call(
      d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
        .tickSizeOuter(0))

  // Add the Y Axis
  linePlot.append('g')
    .call(
      d3.axisLeft(yScale)
        .tickSizeOuter(0))
}

function drawlinePlotLine(data, line, color, width, opacity) {
  linePlot.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', width)
    .attr('opacity', opacity)
    .attr('id', data[0].country.replace(/\s+/g, '-'))
    .on('mouseover', function(d) {
      // console.log(d[0].country)
      // d3.select(this).attr('stroke', 'blue').raise()
      })
    .on('mouseout', function(d) {
      // d3.select(this).attr('stroke', color).lower()
      })
}

function highlightLinePlot(countries) {
  $('.line').removeClass('highlighted')
  for (let country of countries) {
    $(`#${country.replace(/\s+/g, '-')}`).addClass('highlighted')
  }
}

$('#line-switch-highest').on('click', function(){
  highlightLinePlotHighest(10)
  $('#line-switches .switch').removeClass('selected')
  $(this).addClass('selected')
})

$('#line-switch-lowest').on('click', function(){
  highlightLinePlotLowest(10)
  $('#line-switches .switch').removeClass('selected')
  $(this).addClass('selected')
})

$('#line-switch-closest').on('click', function(){
  highlightLinePlotClosest(10)
  $('#line-switches .switch').removeClass('selected')
  $(this).addClass('selected')
})
