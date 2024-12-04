import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import moment from "moment"; // Import Moment.js
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
              return "#0066cc"; // Bright blue
            case "Trojan":
              return "#28a745"; // Fresh green
            case "Self":
              return "#ff5733"; // Vibrant red
            default:
              return "#f39c12"; // Warm golden yellow
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
                  d3.select(this).remove(); // Remove the line after animation ends
                });
      
              // Add attacker (source) point
              const attackerPoint = svg
                .append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 2)
                .attr("fill", "red") // Color for attacker point
                .attr("opacity", 0.8)
                .transition()
                .duration(3000) // Same duration as line animation
                .style("opacity", 0)
                .on("end", function () {
                  d3.select(this).remove(); // Remove attacker point after animation
                });
      
              // Add target (destination) point
              const targetPoint = svg
                .append("circle")
                .attr("cx", selfX)
                .attr("cy", selfY)
                .attr("r", 2)
                .attr("fill", "blue") // Color for target point
                .attr("opacity", 0.8)
                .transition()
                .duration(3000) // Same duration as line animation
                .style("opacity", 0)
                .on("end", function () {
                  d3.select(this).remove(); // Remove target point after animation
                });
            }
      
            setProcessedIds((prev) => new Set(prev).add(id)); // Mark the current ID as processed
          });
      
          index += batchSize;
        };
      
        const intervalId = setInterval(() => {
          renderBatch();
          if (index >= newData.length) clearInterval(intervalId); // Clear the interval when done
        }, interval);
      };
      

      fetch("http://www.geoplugin.net/json.gp")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Ensure the data has the required fields before using them
        const {
          geoplugin_request,       // IP address of the client
          geoplugin_latitude,      // Latitude
          geoplugin_longitude,     // Longitude
          geoplugin_countryName,   // Country Name
        } = data;
    
        // Create the selfData object with the available data
        const selfData = {
          id: "self", // Static ID for the user's location
          ip: geoplugin_request || "Unknown IP", // Fallback if the IP is missing
          country: geoplugin_countryName || "Unknown Country", // Fallback if the country is missing
          latitude: parseFloat(geoplugin_latitude) || 0, // Parse latitude, default to 0 if invalid
          longitude: parseFloat(geoplugin_longitude) || 0, // Parse longitude, default to 0 if invalid
          type: "Self", // Static type for the user's location
        };
    
        // Add this selfData to the attackersData array
        attackersData.push(selfData);
    
        // Call renderNewMarkers to render the new markers, passing the location coordinates
        renderNewMarkers(attackersData, [selfData.longitude, selfData.latitude]);
      })
      .catch((error) => {
        // Handle errors in fetching the data (e.g., network issue, invalid response)
        console.error("Error fetching location:", error);
    
        // In case of failure, render the markers without the self location
        renderNewMarkers(attackersData, null);
      });
    
  }, [processedIds]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
