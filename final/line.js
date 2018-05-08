let linePlotMargin = { top: 10, right: 20, bottom: 30, left: 30 }
let linePlotWidth = d3v4.select('#line-plot').node().clientWidth - (linePlotMargin.right + linePlotMargin.left)
let linePlotHeight = d3v4.select('#line-plot').node().clientHeight - (linePlotMargin.top + linePlotMargin.bottom)
let linePlotTableHeight = d3v4.select('#line-table').node().clientHeight

let linePlot = d3v4.select("#line-plot")
  .append('svg')
    .attr('width', linePlotWidth + linePlotMargin.left + linePlotMargin.right)
    .attr('height', linePlotHeight + linePlotMargin.top + linePlotMargin.bottom)
  .append('g')
    .attr('transform', `translate(${linePlotMargin.left}, ${linePlotMargin.top})`)

let lineQueue = d3v4.queue()
  .defer(d3v4.csv, './line.csv', parseLineData)
  .await(lineDataLoaded)

let lineData = {}
let lineDataAverage = []

let countryColor = '#AAA'
let yourCountryColor = 'red'
let yourCountry = localStorage.getItem("country")

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
  drawLinePlotTable(lineDataAverage)
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
  let allCountries = lineDataAverage.map((d) => { return d.country })
  let yourIndex = allCountries.indexOf(yourCountry)
  if (yourIndex < number / 2) { // Your country is in the lowest (number/2) countries
    highlightLinePlotLowest(number + 1)
    return
  }
  if (yourIndex >= lineDataAverage.length - number / 2) { // Your country is in the highest (number/2) countries
    highlightLinePlotHighest(number + 1)
    return
  }
  let closest = allCountries.slice(yourIndex - number / 2, yourIndex + 1 + number / 2)
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
  let xScale = d3v4.scaleLinear().range([0, linePlotWidth]).domain([xMin, xMax])
  let yScale = d3v4.scaleLinear().range([linePlotHeight, 0]).domain([yMin - 0.5, yMax + 0.5])

  // Define the line
  let line = d3v4.line()
    .x(function(d){ return xScale(d.year) })
    .y(function(d){ return yScale(d.happiness) })

  // Draw the lines
  for (let country of countries) {
    let color = country === yourCountry ? yourCountryColor : countryColor
    let width = country === yourCountry ? 2 : 1
    let opacity = country === yourCountry ? 1 : 0.5
    drawlinePlotLine(lineData[country], line, color, 1, opacity)
  }

  // Add the X Axis
  linePlot.append('g')
    .attr('transform', `translate(0, ${linePlotHeight})`)
    .call(
      d3v4.axisBottom(xScale)
        .tickFormat(d3v4.format('d'))
        .tickSize(-linePlotHeight)
        .tickSizeOuter(0))

  // Add the Y Axis
  linePlot.append('g')
    .call(
      d3v4.axisLeft(yScale)
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
    .attr('id', encodeCountryName(data[0].country))
    // .on('mouseover', function(d) {
      // console.log(d[0].country)
      // d3v4.select(this).attr('stroke', 'blue').raise()
      // })
    // .on('mouseout', function(d) {
      // d3v4.select(this).attr('stroke', color).lower()
      // })
}

function highlightLinePlot(countries) {
  let minY = Infinity
  let maxY = -Infinity
  $('.line').removeClass('highlighted')
  $('#line-table table tr').removeClass('highlighted')

  for (let country of countries) {
    let countryID = encodeCountryName(country)
    $(`#${countryID}`).addClass('highlighted')
    $(`#tr-${countryID}`).addClass('highlighted')
    let position = $(`#tr-${countryID}`).position()
    let height = $(`#tr-${countryID}`).height()
    minY = Math.min(minY, position.top)
    maxY = Math.max(maxY, position.top + height)
  }

  let offset = ((minY + maxY) / 2) - (linePlotTableHeight / 2)
  $('#line-table').animate({
    scrollTop: offset
  }, 400)
}

function drawLinePlotTable(data) {
  for (let i = 1; i <= data.length; i++) {
    let d = data[data.length - i]
    $row = $('<tr>')
    $row.append(`<td>${i}.</td>`)
    $row.append(`<td>${d.country}</td>`)
    $row.append(`<td>${d.average.toPrecision(3)}</td>`)
    $row.attr('id', `tr-${encodeCountryName(d.country)}`)
    if (d.country === yourCountry) {
      $row.addClass('yours')
    } else {
      $row.on('click', function(){
        highlightLinePlot([d.country])
        $('#line-switches .switch').removeClass('selected')
      })
    }
    $('#line-table table').append($row)
  }

  let yourCountryID = encodeCountryName(yourCountry)
  let position = $(`#tr-${yourCountryID}`).position()
  let height = $(`#tr-${yourCountryID}`).height()
  let offset = (position.top + (height / 2)) - (linePlotTableHeight / 2)
  $('#line-table').scrollTop(offset)
}

function encodeCountryName(name) {
  return name.replace(/\s+/g, '-').replace(/\(|\)/g, '').replace(/\./g, '')
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
