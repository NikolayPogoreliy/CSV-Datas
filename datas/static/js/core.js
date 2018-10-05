$(document).ready(function(){

var entityColors = ["red", "orange", "yellow", "green", "blue", "blueviolet"];
var values = data.values,
    totals = data.total;
var keys = d3.map(totals).keys();

// ****************************TIME BASED HISTOGRAM**********************************
var height = 700,
    width = 1200,
    margin=40,
    padding = 2;

var svg = getSVG("#time","axis",width, height);
var xAxisLength = getAxisLength(width, margin);
var yAxisLength = getAxisLength(height, margin);
var scaleX = getScale([data.range[0], data.range[1]],[0, xAxisLength]);
var maxYValue = d3.max(values, function(d) {return d.total;});
var scaleY = getScale([maxYValue,0],[0,yAxisLength]);
var scaleZ = d3.scaleOrdinal().domain(keys).range(entityColors);
var xAxis = getAxis(scaleX, 'bottom', values.length+1);
var yAxis = getAxis(scaleY, 'left');

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var v = d[1]-d[0];
    return "<span style='color:white'>" + v + "</span> of <span style='color:white'>" + d.data.total + "</span>";
  })

svg.call(tip);
drawAxis(svg, xAxis, "x-axis", [margin, height-margin]);
drawAxis(svg, yAxis, "y-axis", [margin, margin]);

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50)
      .attr("x", -70)
      .attr("dy", ".71em")
      .style("text-anchor", "center")
      .text("Occurrences");

d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", xAxisLength)
    .attr("y2", 0);
var g =svg.append("g")
    .attr("class", "body")
    .attr("transform", "translate(" + margin + ", 0 )");
g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(values))
    .enter().append("g")
      .attr("fill", function(d) {
            return scaleZ(d.key);
            })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function (d) {return scaleX(d.data.time);})
      .attr("y", function (d) {return scaleY(d[1])+margin;})
      .attr("height", function (d) {return scaleY(d[0])-scaleY(d[1]);})
      .attr("width", function(d){return Math.floor(xAxisLength / values.length) - padding;})
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .attr("transform", "translate(0,"+margin+")")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

  legend.append("rect")
      .attr("x", width - 59)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", scaleZ);

  legend.append("text")
      .attr("x", width - 64)
      .attr("y", 9.5)
      .attr("dy", "0.4em")
      .text(function(d) {
      return d; });
//**********************************************************************************************************************

//*****************************TOTAL ENTITY HISTOGRAM*******************************************************************
var heightTotal = 400,
    widthTotal = 500,
    marginTotal = 40,
    paddingTotal = 2;
var totalsData = d3.map(totals).entries();
for (i in totalsData) {totalsData[i].color = entityColors[i];}
var svgTotal = getSVG("#total","axis",widthTotal, heightTotal);
var xAxisLengthTotal = getAxisLength(widthTotal, marginTotal);
var yAxisLengthTotal = getAxisLength(heightTotal, marginTotal);
var scaleXTotal = d3.scaleBand().rangeRound([0,xAxisLengthTotal]).padding(0.1).domain(d3.map(totals).keys());
var maxYValueTotal = d3.max(d3.map(totals).values())+5;
var minYValueTotal = d3.min(d3.map(totals).values())-20;
var scaleYTotal = getScale([maxYValueTotal,minYValueTotal],[0,yAxisLengthTotal]);
var xAxisTotal = getAxis(scaleXTotal, 'bottom');
var yAxisTotal = getAxis(scaleYTotal, 'left');

var tipTotal = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:white'>" + d.value + "</span>";
  })

svgTotal.call(tipTotal);

drawAxis(svgTotal, xAxisTotal, "x-axis", [marginTotal, heightTotal-marginTotal]);
drawAxis(svgTotal, yAxisTotal, "y-axis", [marginTotal, marginTotal]);
svgTotal.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50)
      .attr("x", -70)
      .attr("dy", ".71em")
      .style("text-anchor", "center")
      .text("Occurrences");
var gTotal =svgTotal.append("g")
    .attr("class", "bodyTotal")
    .attr("transform",  "translate(" + marginTotal + ", 0 )");
gTotal.selectAll("rect.barTotal")
    .data(totalsData)
    .enter()
    .append("rect")
    .attr("class", "barTotal");
gTotal.selectAll("rect.barTotal")
    .data(totalsData)
    .attr("x", function (d,i) {return scaleXTotal(d.key);})
    .attr("y", function (d) {return scaleYTotal(d.value) + marginTotal;})
    .attr("height", function (d) {return yAxisLengthTotal - scaleYTotal(d.value);})
    .attr("width", function(d){return Math.floor(xAxisLengthTotal / totalsData.length) - paddingTotal;})
    .attr("fill", function(d){return d.color;})
    .on('mouseover', tipTotal.show)
    .on('mouseout', tipTotal.hide);
//**********************************************************************************************************************
});

function getSVG(containerSelector, svgClass, width, height){
    return d3.select(containerSelector).append("svg").attr("class", svgClass).attr("width", width).attr("height", height);
}

function getAxisLength(param, margin){
    return param - 2*margin
}

function getScale(domainLimits, rangeLimits){
    return d3.scaleLinear().domain(domainLimits).rangeRound(rangeLimits)
}

function getAxis(scale, orient='bottom', ticks=null){
    var axis;
    switch(orient){
        case "bottom":
            axis = d3.axisBottom();
            break;
        case "left":
            axis = d3.axisLeft();
            break;
        case "top":
            axis = d3.axisTop();
            break;
        case "right":
            axis = d3.axisRight();
    }
    axis.scale(scale);
    if (ticks){ axis.ticks(ticks);}
    return axis;
}

function drawAxis(contain, axis, klass, translations){
    contain.append("g")
     .attr("class", klass)
     .attr("transform", "translate(" + translations[0] + "," + translations[1] + ")")
    .call(axis);
}