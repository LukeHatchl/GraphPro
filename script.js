// Regular expression to match the pattern y = mx + b
// Match the input string with the regular expression
// If the match is successful, extract m and b
// match[1] is the m value (slope). If not present, default to 1.
// match[2] is the b value (intercept), after removing whitespace. Default to 0 if undefined.
// Return an object containing m and b
// If no match, alert the user and return null
function parseFunction(input) {
    const regex = /y\s*=\s*([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)?/;
    const match = input.match(regex);

    if (match) {
        const m = parseFloat(match[1]) || 1;
        const b = match[2] ? parseFloat(match[2].replace(/\s+/g, '')) : 0;
        return { m, b };
    } else {
        alert("Invalid function format. Please enter in the form y = mx + b.");
        return null;
    }

}

// Function to create X-axis grid lines
function makeXGridlines() {       
    return d3.axisBottom(xScale)
        .ticks(10);  // Adjust number of grid lines by changing ticks
}

// Function to create Y-axis grid lines
function makeYGridlines() {       
    return d3.axisLeft(yScale)
        .ticks(10);  // Adjust number of grid lines by changing ticks
}

// Create the SVG
const width = 600;
const height = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 50 };

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale)

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

svg.append("g")
    .call(yAxis);

// Add the X gridlines
svg.append("g")     
    .attr("class", "grid")
    .attr("transform", `translate(0,${height})`)
    .call(makeXGridlines()
        .tickSize(-height)
        .tickFormat(""));

// Add the Y gridlines
svg.append("g")     
    .attr("class", "grid")
    .call(makeYGridlines()
        .tickSize(-width)
        .tickFormat(""));


// Get the user's input
// Parse the function input to extract the values of m and b
// If the input is invalid, stop the function execution
// Remove the previous line (if any) to clear the old graph
// Generate data points (x values from 0 to 10)
// Define a line generator function based on m and b (the line equation y = mx + b)
// Append the new path (line) to the SVG
// Re-append the axes
function plotFunction() {
    const input = document.getElementById("functionInput").value;
    console.log("Entered Function: ", input);
    document.getElementById("output").innerText = input;
    const parsed = parseFunction(input);

    if (!parsed) return;

    const { m, b } = parsed;

    svg.selectAll(".line").remove();

    const data = Array.from({ length: 10 }, (_, i) => ({ x: i }));

    const line = d3.line()
         .x(d => xScale(d.x))    
         .y(d => yScale(m * d.x + b));  

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

    svg.append("g")
    .call(yAxis);
}

function updateBounds() {
    // Get the selected values from the dropdowns
    const xMin = parseFloat(document.getElementById("xMin").value);
    const xMax = parseFloat(document.getElementById("xMax").value);
    const yMin = parseFloat(document.getElementById("yMin").value);
    const yMax = parseFloat(document.getElementById("yMax").value);

    // Update the scales with the new bounds
    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax]);

    // Redraw the axes with the updated bounds
    svg.selectAll("g.axis").remove();  // Remove existing axes

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", `translate(0,${height})`)
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);

    // Optionally, you may want to re-draw any existing graph lines
    plotFunction();
}
