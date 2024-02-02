
// SVG Size
let width = 700,
	height = 500;
const padding = 30;  // Padding value


// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	d.Income = +d.Income;
	d.Population = +d.Population;
	d.LifeExpectancy = +d.LifeExpectancy;

	// TODO: convert values where necessary in this callback (d3.csv reads the csv line by line. In the callback,
	//  you have access to each line (or row) represented as a js object with key value pairs. (i.e. a dictionary).
	return d;
}).then( data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	// TODO: sort the data

	data.sort(function (a, b) {
		return d3.descending(a.Population, b.Population);
	});

	// TODO: Call your separate drawing function here, i.e. within the .then() method's callback function


	drawScatterPlot(data);



});

// TODO: create a separate function that is in charge of drawing the data, which means it takes the sorted data as an argument
//function (){}
function drawScatterPlot(data) {


	// Create SVG element
	let svg = d3.select("#chart-area")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	// Create linear scales for income (x-axis) and life expectancy (y-axis) with padding
	const incomeScale = d3.scaleLog()
		.domain([d3.min(data, d => d.Income) - 10, d3.max(data, d => d.Income) + 10])
		.range([padding, width - padding]);

	const lifeExpectancyScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.LifeExpectancy) - 10, d3.max(data, d => d.LifeExpectancy) + 10])
		.range([height - padding, padding]);

	// Create a population-dependent linear scale for circle radius
	const radiusScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.Population), d3.max(data, d => d.Population)])
		.range([4, 30]);

	// Create a D3 color scale for regions
	const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
		.domain(data.map(d => d.Region));

	// Append circles to the SVG
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", d => incomeScale(d.Income))
		.attr("cy", d => lifeExpectancyScale(d.LifeExpectancy))
		.attr("r", d => radiusScale(d.Population))
		.style("fill", d => colorScale(d.Region))
		.style("stroke", "black")
		.style("stroke-width", 2);

	// Create D3 axis functions
	const xAxis = d3.axisBottom().scale(incomeScale).ticks(5, ".0s");
	const yAxis = d3.axisLeft().scale(lifeExpectancyScale);

	// Append x-axis to the SVG
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis);

	// Append y-axis to the SVG
	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

	// Label x-axis
	svg.append("text")
		.attr("class", "x-axis-label")
		.attr("text-anchor", "middle")
		.attr("x", width / 2)
		.attr("y", height - padding + 29)
		.text("Income");

	// Label y-axis
	svg.append("text")
		.attr("class", "y-axis-label")
		.attr("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.attr("x", -height / 2)
		.attr("y", padding - 22)
		.text("Life Expectancy");
}

