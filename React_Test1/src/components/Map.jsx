import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [processedIds, setProcessedIds] = useState(new Set()); // Track processed IDs
  const [attackersData, setAttackersData] = useState([]); // Store attackers data
  const [selfLocation, setSelfLocation] = useState(null); // Store user's location

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

    const renderNewMarkers = (newData) => {
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

      newData.forEach((entry) => {
        if (processedIds.has(entry.id)) return;

        const { latitude, longitude, id, type } = entry;
        if (!latitude || !longitude) return; // Skip invalid data
        const [x, y] = projection([longitude, latitude]);

        if (selfLocation) {
          const [selfX, selfY] = projection([selfLocation.longitude, selfLocation.latitude]);

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
          svg
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
    };

    // Fetch attackers data from the API in real-time
    const fetchAttackersData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alerts");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Map attackers data to include latitude, longitude, and type
        const processedData = data.map((item) => {
          const source = item._source || {};
          const geoLocation = source.GeoLocation || {};
          const rule = source.rule || {};

          return {
            id: item._id || "Unknown ID",
            latitude: geoLocation.location?.lat || 0,
            longitude: geoLocation.location?.lon || 0,
            country: geoLocation.country_name || "Unknown Country",
            type: rule.description || "Unknown Type",
          };
        });

        setAttackersData(processedData);
        renderNewMarkers(processedData); // Render new markers
      } catch (error) {
        console.error("Error fetching attackers data:", error);
      }
    };

    // Fetch user's location
    const fetchLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const { lat, lon } = data;

        setSelfLocation({
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(lon) || 0,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
    fetchAttackersData();

    // Set interval to fetch data every second
    const intervalId = setInterval(fetchAttackersData, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [processedIds, selfLocation]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
