import "./styles.css";
import * as d3 from "d3";
import * as topojson from "topojson-client";

document.getElementById("app").innerHTML = `
<h1>GeoJson Visualization</h1>
<div>
<label>FPS</label>
<select id=dropDown>

</select>
</div>
<div id=canvas>
  
</div>
`;

d3.json(
  "https://raw.githubusercontent.com/umassdgithub/Sample_Data/main/MASS_TOPO.json"
).then((data) => {
  const geoJson = topojson.feature(data, data.objects.cb_2018_25_bg_500k);
  let CountyFP = geoJson.features.map((d) => d.properties.COUNTYFP);
  CountyFP = [...new Set(CountyFP)];

  const dropDown = d3.selectAll("#dropDown");

  dropDown
    .selectAll(".options")
    .data(CountyFP)
    .enter()
    .append("option")
    .text((d) => d);

  const initialValue = d3.selectAll("#dropDown").property("value");
  const initialGeoJson = { type: "FeatureCollection", features: [] };
  initialGeoJson.features = geoJson.features.filter(
    (d) => d.properties.COUNTYFP === initialValue
  );
  console.log(geoJson);
  makeMap(initialGeoJson);

  document.querySelector("#dropDown").addEventListener("change", (d) => {
    const selected_COUNTYFP = d3.selectAll("#dropDown").property("value");
    const geoJsonCopy = { ...geoJson };
    geoJsonCopy.features = geoJson.features.filter(
      (d) => d.properties.COUNTYFP === selected_COUNTYFP
    );

    makeMap(geoJsonCopy);
  });

  function makeMap(geoJson) {
    d3.select("svg").remove();
    const svg = d3
      .select("#canvas")
      .append("svg")
      .attr("width", "600px")
      .attr("height", "400px")
      .style("border", "dashed 4px gray");

    const projection = d3.geoMercator().fitExtent(
      [
        [0, 0],
        [600, 400]
      ],
      geoJson
    );

    svg
      .selectAll(".paths")
      .data(geoJson.features)
      .enter()
      .append("path")
      .attr("d", (d, i) => d3.geoPath(projection)(d))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", ".4px");
  }
});
