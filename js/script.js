var dataset = [];
var lineNumbers=[];
var datasetMap = [];
var datasetDeaths=[];	
var datasetDeaths0to10=[];
var	datasetDeaths11to20=[];
var	datasetDeaths21to40=[];
var	datasetDeaths41to60=[];
var	datasetDeaths61to80=[];
var	datasetDeaths80plus=[];
var datasetDeathsMale = [];
var datasetDeathsFemale = [];
var mapsSvg;
var xScale,yScale;
var widthMap,heightMap;
function drawSegment(xScale,yScale,mapIndex){
	var lineFunction = d3.svg.line()
		.x(function (d) {
			return xScale(d[1]);
		})
		.y(function (d) {
			return yScale(d[2]);
		})
		.interpolate("linear");
	mapsSvg.append("path")
		.attr("d", lineFunction(datasetMap[mapIndex]))
		.style("stroke-width", 2)
		.style("stroke", "gray")
		.attr("fill", "none");
}
function drawStreets(){
	for (i in datasetMap) {
		drawSegment(xScale,yScale,i);
	}
}

function loadAndDrawPumps(pumpsFileName){
	d3.csv(pumpsFileName, function(data){
		var datasetPumps=[];	
		for (key in data){
			pArray=[]
			pArray.push(data[key].X)
			pArray.push(data[key].Y)
			datasetPumps.push(pArray)
		}
		mapsSvg.selectAll("circle")  
			.data(datasetPumps)
			.enter()
			.append("circle")    
			.attr("cx", function(d) {
				return xScale(d[0]);
			})
			.attr("cy", function(d) {
				return yScale(d[1]);
			})
			.attr("r", 5)
			.attr("stroke","black")
			.attr("fill","blue")
			
		mapsSvg.selectAll("text")
			.data(datasetPumps)
			.enter()
			.append("text")
		
			.attr("x", function(d) {
					return (xScale(d[0])+4);
				})
			.attr("y", function(d) {
					return (yScale(d[1])+6);
				})
			.attr("font-family", "sans-serif")
			.attr("font-size", "11px")
			.attr("fill", "blue")
			.text("Pump");
	});
}
function createMapsSvg(mapId){
	var margin = {top: 40, right: 20, bottom: 20, left: 50},
	widthMap = 800 - margin.left - margin.right,
	heightMap = 580 - margin.top - margin.bottom;
	var p = 220;
	xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { return d[1]; })])
		.range([-p*0.80, widthMap-p*2.1]);
	yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) { return d[2]; })])
		.range([heightMap+p/1.7 ,p*1.4]);
	mapsSvg = d3.select(mapId)
		.append("svg")
		.attr("width", widthMap + margin.left + margin.right)
		.attr("height", heightMap + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")")
}
function onchange() {
	selectValue = d3.select('select')
		.property('value')
	var deathcircle = mapsSvg.selectAll("circle")  
		.data(function(d) {
			if (selectValue=="0-10"){
				return  datasetDeaths0to10;
			}
			else if (selectValue=="11-20"){
				return datasetDeaths11to20;
			}	
			else if (selectValue=="21-40"){
				return  datasetDeaths21to40;
			}
			else if (selectValue=="41-60"){
				return  datasetDeaths41to60;
			}
			else if (selectValue=="61-80"){
				return  datasetDeaths61to80;
			}
			else if (selectValue=="> 80"){
				return  datasetDeaths80plus;
			}
			else if (selectValue=="male"){
				return  datasetDeathsMale;
			}
			else if (selectValue=="female"){
				return  datasetDeathsFemale;
			}
			else {
				return datasetDeaths;
			}
		});
	deathcircle.exit().remove();
	deathcircle.enter()
		.append("circle")    
		.attr("cx", function(d) {
			return xScale(d[0]);
		})
		.attr("cy", function(d) {
			return yScale(d[1]);
		})
		.attr("r", 4)
		.attr("stroke-width",2)
		.attr("fill","red")
		.style("stroke", "pink");
}
function createSelectElement(selectId){
	var data = ["All", "0-10", "11-20", "21-40", "41-60", "61-80", "> 80","male","female"];
	var select = d3.select(selectId)
		.append('select')
		.attr('class','form-control')
		.on('change',onchange);
	var options = select.selectAll('option')
		.data(data)
		.enter()
		.append('option')
		.text(function (d) { return d; });
}
function loadAndDrawStreetsData(streetFileName){
	d3.csv(streetFileName, function(data){
		for (key in data) {
			xArray=[]
			lineNumbers.push(data[key].L)
			xArray.push(data[key].L)
			xArray.push(data[key].X)
			xArray.push(data[key].Y)
			dataset.push(xArray)
		}
		for (var i=0; i<lineNumbers.length; i++){
			var temp=[];
			for (var j=i; j< (+i + +lineNumbers[i]); j++){
				temp.push(dataset[j]);
			}
			if (temp.length!=0){
				datasetMap.push(temp);
			}
		}
		createMapsSvg("#maps");
		drawStreets();
		loadAndDrawPumps("pumps.csv");
		d3.csv("deaths.age.csv", function(data){
			for (key in data){
				dArray=[]
				dArray.push(data[key].X)
				dArray.push(data[key].Y)
				dArray.push(data[key].age)
				dArray.push(data[key].sex)
				dArray.push(data[key].day)
				datasetDeaths.push(dArray)
				if (data[key].age==0){
					datasetDeaths0to10.push(dArray)
				}
				if (data[key].age==1){
					datasetDeaths11to20.push(dArray)
				}
				if (data[key].age==2){
					datasetDeaths21to40.push(dArray)
				}
				if (data[key].age==3){
					datasetDeaths41to60.push(dArray)
				}
				if (data[key].age==4){
					datasetDeaths61to80.push(dArray)
				}
				if (data[key].age==5){
					datasetDeaths80plus.push(dArray)
				}
				if (data[key].sex ==0){
					datasetDeathsMale.push(dArray)
				}
				if (data[key].sex==1){
					datasetDeathsFemale.push(dArray)
				}
			}
			createSelectElement('#select-div');
		});		
	});
}
function drawGraphs(){
	var margin = {top: 20, right: 40, bottom: 30, left: 50},
		width = 400 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;
	var	parseDate = d3.time.format("%d-%b").parse;
	var formatTime = d3.time.format("%d-%B");
	var	x = d3.time.scale().range([0, width]);
	var	y = d3.scale.linear().range([height, 0]);
	var	xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(5);
	var	yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(5);
	var valueline = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.close); });

	var div = d3.select("#graphs").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	var svg1 = d3.select("#graphs").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");
	d3.csv("deathdays2.csv", function(error, data) {
	  if (error) throw error;
	  data.forEach(function(d) {
	      d.date = parseDate(d.date);
	      d.close = +d.close;
	  });
	  x.domain(d3.extent(data, function(d) { return d.date; }));
	  y.domain([0, d3.max(data, function(d) { return d.close; })]);
	  svg1.append("path")
	     .data([data])
	     .attr("class", "line")
	     .attr("d", valueline);
	  svg1.selectAll("dot")
	     .data(data)
	   .enter().append("circle")
	     .attr("r", 6)
	     .attr("cx", function(d) { return x(d.date); })
	     .attr("cy", function(d) { return y(d.close); })
	     .attr("fill","red")
	     .attr("stroke-width",3)
	     .attr("stroke","pink")
	     .on("mouseover", function(d) {
	       div.transition()
	         .duration(200)
	         .style("opacity", .9);
	       div.html(formatTime(d.date) + "<br/>" + d.close)
	         .style("left", (d3.event.pageX) + "px")
	         .style("top", (d3.event.pageY - 28) + "px");
	       })
	     .on("mouseout", function(d) {
	       div.transition()
	         .duration(500)
	         .style("opacity", 0);
	       });
	  svg1.append("g")
	      .attr("transform", "translate(0," + height + ")")
		  .attr("class","axis")
	      .call(xAxis);
	  svg1.append("g")
		  .attr("class","axis")
	      .call(yAxis);
	  svg1.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 0 - margin.left)  
	      .attr("x",0 - (height / 2))
	      .attr("dy", "1em")
	      .style("text-anchor", "middle")
	      .text("Number of people died");
		  
		  
	  svg1.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - ((margin.top/4)))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "12px") 
	        .style("text-decoration", "underline")  
	        .text("Total number of people died on particular date");

	});

	var	y0 = d3.scale.linear().range([height, 0]);
	var	y1 = d3.scale.linear().range([height, 0]);	
	var	yAxisLeft = d3.svg.axis().scale(y0)
		.orient("left").ticks(5);

	var	yAxisRight = d3.svg.axis().scale(y1)
		.orient("right").ticks(10);		

	var	valueline1 = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y0(d.male); });	
	    
	var	valueline2 = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y1(d.female); });
		
	var div = d3.select("#graphs").append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	  
	var	svg2 = d3.select("#graphs")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", 
			      "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("mf.csv", function(error, data) {
		data.forEach(function(d) {
			d.date = parseDate(d.date);
			d.male = +d.male;
			d.female = +d.female;
		});

		x.domain(d3.extent(data, function(d) { return d.date; }));
		y0.domain([0, d3.max(data, function(d) { 
			return Math.max(d.male); })]);
		y1.domain([0, d3.max(data, function(d) { 
			return Math.max(d.female); })]);

		svg2.append("path")
			.attr("class", "line")
			.attr("id", "blueLine")
			.attr("d", valueline1(data));

		svg2.append("path")
			.attr("class", "line")
			.style("stroke", "red")
			.attr("id", "redLine")
			.attr("d", valueline2(data));

		svg2.selectAll("dot")
			.data(data)
			.enter().append("circle")
			.attr("r", 3)
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y0(d.male); })
			.attr("fill","red")
		     .attr("stroke-width",3)
		     .attr("stroke","pink")
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(formatTime(d.date) + "<br/>" + d.male)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});
		   
		svg2.selectAll("dot")
			.data(data)
			.enter().append("circle")
			.attr("r", 2)
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return y1(d.female); })
			.attr("fill","red")
		     .attr("stroke-width",3)
		     .attr("stroke","green")
			.on("mouseover", function(d) {
				div.transition()
					.duration(200)
					.style("opacity", .9);
				div.html(formatTime(d.date) + "<br/>" + d.female)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
			});

		svg2.append("g")	
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg2.append("g")	
			.attr("class", "y axis")
			.style("fill", "steelblue")
			.attr("id", "blueAxis")
			.call(yAxisLeft);

		svg2.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (width-2) + " ,0)")
			.style("fill", "red")
			.attr("id", "redAxis")
			.call(yAxisRight);

		svg2.append("text")
			.attr("x", width/2)             
			.attr("y", height/2 + margin.top)    
			.attr("class", "legend")
			.style("fill", "steelblue")         
			.on("click", function(){
				var active   = blueLine.active ? false : true,
					newOpacity = active ? 0 : 1;
				d3.select("#blueLine").style("opacity", newOpacity);
				d3.select("#blueAxis").style("opacity", newOpacity);
				blueLine.active = active;
			})
			.text("Male");
		svg2.append("text")
			.attr("x", width/2)             
			.attr("y", height/2)    
			.attr("class", "legend")
			.style("fill", "red")         
			.on("click", function(){
				var active   = redLine.active ? false : true ,
					newOpacity = active ? 0 : 1;
				d3.select("#redLine").style("opacity", newOpacity);
				d3.select("#redAxis").style("opacity", newOpacity);
				redLine.active = active;
			})
			.text("Female");
		svg2.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)  
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Number of people died");
		
		svg2.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - ((margin.top/4)))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .style("text-decoration", "underline")  
	        .text("Male vs Female died on particular date");
	});
}
loadAndDrawStreetsData("streets.csv")
drawGraphs();