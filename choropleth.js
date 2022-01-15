const height= 650;
const width=1000;
const eduDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const mapDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const colors = ["rgb(230, 186, 250)", "rgb(179, 125, 204)", "rgb(127, 72, 153)", "rgb(68, 22, 90)"];

d3.select("body")
  .append("h1")
  .text("Choropleth Map: Edumacated?")
  .attr("id", "title")
  .style("text-align", "center");

d3.select("body")   
  .append("h2")
  .style("margin", "20px")
  .text("Percentage of Bachelor Degree Holders over Age 25")
  .attr("id", "description")
  .style("text-align", "center");

const svg = d3.select("body")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .style("padding", "30px")
  .style("border", "1px solid black")
  .style("background", "skyblue")
  .style("border-radius","10px");

let mapData;
let eduData;

let drawMap = () => {
  const tooltip = d3.select("body")
    .data(mapData)
    .enter()
    .append("div")
    .attr("id", "tooltip")
    .style("padding", " 10px")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "lightgrey")
    .style("border", "1px solid black")
    .style("border-radius", "10px")
    .style("line-height", "1.5");

  svg.selectAll("path")
    .data(mapData)
    .enter()
    .append("path")
    .attr('d', d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d)=> {let id = d.id;
    let county = eduData.find((item)=> {
      return item.fips === id
    })
    let fips = county.fips;
    return fips})
    .attr("data-education", (d)=> {let id = d.id;
      let county = eduData.find((item)=> {
        return item.fips === id
      })
      let percent = county.bachelorsOrHigher;
      return percent})
      .attr("data-countyName", (d)=> {let id = d.id;
        let county = eduData.find((item)=> {
          return item.fips === id
        })
        let countyName = county.area_name;
        return countyName})
    .attr("fill", (d)=> {
      let id = d.id;
      let county = eduData.find((item)=> {
        return item.fips === id
      })
      let percent = county.bachelorsOrHigher;
      if (percent < 15){return colors[0]} else if (percent >= 15 && percent <=30){ return colors[1]} else if (percent > 30 && percent <=45){ return colors[2]} else {return colors[3]};
    })
    .on("mouseover", function(d){
      tooltip.style("visibility", "visible")
        .html((d)=>{
          let countyName = this.getAttribute("data-countyName");
          let percent = this.getAttribute("data-education");
          return countyName + ": " + percent + "%";
        })
        .attr("data-education", (d)=> {return this.getAttribute("data-education")}
      )})
  .on("mousemove", function(e){
    return tooltip.style('left', (e.pageX+10) + "px").style('top', (e.pageY+10) + 'px')
      ;})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
} 

d3.json(mapDataUrl)
  .then((data, error) => {
    if(error){
      console.log(error)
    } else {
      mapData = topojson.feature(data, data.objects.counties).features

      d3.json(eduDataUrl)
        .then((data, error)=> {
          if(error){
            console.log(error)
          } else {
            eduData = data
            drawMap();
          }   
        })
    }
  })
  const legend = d3.select("body")
  .append("svg")
  .style("position", "absolute")
  .style("top", "110px")
  .style("left", "400px")
  .attr("id", "legend")
  .style("height", "80px")
  .style("width", "300px")
  .style("border", "1px solid black")
  .style("background", "beige")
  .style("border-radius", "10px");

  
const legendScale = d3.scaleLinear(colors)
  .domain([0,100])
  .range([35,235])

const legendAxis = d3.axisBottom(legendScale).ticks(4).tickValues(["0", "15", "30", "45"]);
  
legend.append("g")
    .attr("transform", "translate(35, 60)")
    .call(legendAxis);

d3.select("body")
  .append("h3")
  .text("Legend: % of People with Degrees")    
  .style("margin", "10px")
  .style("position", "absolute")
  .style("top", "110px")
  .style("left", "400px")
  .style("text-shadow", "1px 1px 1px white")
  .style("font-size", "14px");

legend.selectAll("rect")
  .data(colors)
  .enter()
  .append("rect")
  .attr("height", "30")
  .attr("width", "30")
  .attr("x", (d,i)=> (70+ i* 30) + "px")
  .attr("y", "30px")
  .attr("fill", (d)=> d)
  .style("stroke", "black")
  .style("border", "1px solid black")
  .append("title")
  .text((d, i)=>i== 0 ? "<15%" : i==1 ? "Between 15% and 30%" : i==2 ? "Between 30% and 45%" : "More than 45%");

d3.select("body")
  .append("footer")
  .text("Created by Chris Patchett, 2022")
  .style("margin-top", "10px");
