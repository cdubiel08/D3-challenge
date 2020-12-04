// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 50,
    left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// Load data

d3.csv("assets/data/data.csv").then(function (demoData) {

    // Print the Demographics Data on console to ensure ok
    console.log(demoData);

    //extract data for analysis
    demoData.forEach(function (data) {
        //`Healthcare vs. Poverty` or `Smokers vs. Age`.
        data.state = data.state;
        data.healthcare = +data.healthcare
        data.poverty = +data.poverty
        //data.smokes = +data.smokes
        //data.age = +data.age

        //test data extraction is ok on console
        console.log(data.state);
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.healthcare) * 0.8, d3.max(demoData, d => d.healthcare) + 1.5])
        .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d.poverty) * 0.8, d3.max(demoData, d => d.poverty) + 1.5])
        .range([chartHeight, 0]);

    //  axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(demoData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5")
        .classed('stateCircle', true);

    //append text in circle
    chartGroup.selectAll()
        .data(demoData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .style("fill", "black")
        .attr('font-size', '10px')
        .text(d => d.abbr)
        .classed('stateText', true);

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`Healthcare: ${d.healthcare} <br> Poverty: ${d.poverty}<br> State: ${d.state}`);
        });

    // Create tooltip in the chart
    circlesGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
        //.attr('fill', 'green');
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });


    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left - 5)
        .attr("x", 0 - (chartHeight / 1.7))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 35})`)
        .attr("class", "axisText")
        .text("Healthcare");

}).catch(function (error) {
    console.log(error);

});
