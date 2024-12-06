import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import attackersData from "../assets/attackers.json"; // Import attackers JSON
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set()); // Track processed IDs

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 40 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countries = feature(topojsonData, topojsonData.objects.countries);

    // Draw countries on the map
    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#f5f5f5") // Light white/gray for landmass
      .attr("stroke", "#e0e0e0") // Lighter gray for country borders
      .attr("stroke-width", 0.5);

      const renderNewMarkers = (newData, selfLocation) => {
        let index = 0; // Start index for batch rendering
        const batchSize = 1; // Number of data points to render at a time
        const interval = 1000; // Interval in milliseconds between batches
      
        const getColorByType = (type) => {
          switch (type) {
            case "Botnet":
              return "#0099ff"; // Sky blue
            case "Trojan":
              return "#33cc33"; // Bright green
            case "Self":
              return "#ff4500"; // Orange-red
            default:
              return "#ffc107"; // Bright yellow
          }
        };
      
        const renderBatch = () => {
          if (index >= newData.length) return;
      
          const batchData = newData.slice(index, index + batchSize);
      
          batchData.forEach((entry) => {
            if (processedIds.has(entry.id)) return;
      
            const { latitude, longitude, id, type } = entry;
            if (!latitude || !longitude) return; // Skip invalid data
            const [x, y] = projection([longitude, latitude]);
      
            if (selfLocation) {
              const [selfX, selfY] = projection(selfLocation);
      
              const lineColor = getColorByType(type);
      
              // Define a curved path (arc) between the points
              const curve = d3
                .line()
                .x((d) => d[0])
                .y((d) => d[1])
                .curve(d3.curveBasis); // Smooth curve
      
              const midX = (x + selfX) / 2; // Midpoint for curvature
              const midY = (y + selfY) / 2 - 50; // Elevate midpoint for arc
      
              const lineData = [
                [x, y],
                [midX, midY],
                [selfX, selfY],
              ];
      
              // Add animated curved line
              const path = svg
              .append("path")
              .datum(lineData)
              .attr("d", curve)
              .attr("stroke", lineColor) // Line color based on type
              .attr("stroke-width", 1)
              .attr("fill", "none")
              .attr("stroke-linecap", "round") // Rounded line ends
              .attr("stroke-dasharray", function () {
                return this.getTotalLength();
              })
              .attr("stroke-dashoffset", function () {
                return this.getTotalLength();
              })
              .transition()
              .duration(3000) // Draw the path over 3 seconds
              .ease(d3.easeQuadInOut)
              .attr("stroke-dashoffset", 0)
              .duration(2000) // Fade out after animation
              .style("opacity", 0)
                .on("end", function () {
                  // Add explosion effect at target location
                  svg
                    .append("circle")
                    .attr("cx", selfX)
                    .attr("cy", selfY)
                    .attr("r", 0)
                    .attr("fill", lineColor)
                    .attr("opacity", 0.8)
                    .transition()
                    .duration(500)
                    .attr("r", 10) // Expand radius
                    .attr("opacity", 0) // Fade out
                    .on("end", function () {
                      d3.select(this).remove(); // Remove explosion circle
                    });
      
                  d3.select(this).remove(); // Remove line
                });
      
              // Add attacker (source) point
              svg
                .append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 2)
                .attr("fill", "red")
                .attr("opacity", 0.8)
                .transition()
                .duration(3000) // Same duration as line animation
                .style("opacity", 0)
                .on("end", function () {
                  d3.select(this).remove(); // Remove attacker point
                });
      
              setProcessedIds((prev) => new Set(prev).add(id)); // Mark ID as processed
            }
          });
      
          index += batchSize;
        };
      
        const intervalId = setInterval(() => {
          renderBatch();
          if (index >= newData.length) clearInterval(intervalId);
        }, interval);
      };
      

    // Fetch user's location
    const fetchLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        const { lat, lon, country } = data;
    
        const selfData = {
          id: "self", // Static ID for the user's location
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(lon) || 0,
          country: country || "Unknown Country",
          type: "Self",
        };
    
        // Check if selfData already exists in attackersData
        const isSelfDataPresent = attackersData.some((data) => data.id === "self");
        if (!isSelfDataPresent) {
          attackersData.push(selfData);
        }
    
        renderNewMarkers(attackersData, [selfData.longitude, selfData.latitude]);
      } catch (error) {
        console.error("Error fetching location:", error);
        renderNewMarkers(attackersData, null);
      }
    };
    
    fetchLocation();
    
   
  }, [processedIds]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
