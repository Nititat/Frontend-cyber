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

    // Add SVG filter for glow effect
    svg
      .append("defs")
      .append("filter")
      .attr("id", "glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", 3)
      .attr("result", "coloredBlur");

    svg
      .select("filter")
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["coloredBlur", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);

    // Create a tooltip for country names
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(255, 255, 255, 0.9)")
      .style("color", "#000")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("font-size", "12px");

    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#f5f5f5") // Light white/gray for landmass
      .attr("stroke", "#e0e0e0") // Lighter gray for country borders
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("fill", "#dcdcdc"); // Change color on hover

        // Show tooltip with country name
        tooltip
          .style("visibility", "visible")
          .html(`<strong>Country:</strong> ${d.properties.name}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("fill", "#f5f5f5"); // Reset to original color
        tooltip.style("visibility", "hidden");
      });

    const renderNewMarkers = (newData, selfLocation) => {
      let index = 0; // Start index for batch rendering
      const batchSize = 1; // Number of data points to render at a time
      const interval = 1000; // Interval in milliseconds between batches

      const renderBatch = () => {
        if (index >= newData.length) return;

        const batchData = newData.slice(index, index + batchSize);

        batchData.forEach((entry) => {
          if (processedIds.has(entry.id)) return;

          const { latitude, longitude, type, country, id } = entry;
          if (!latitude || !longitude) return; // Skip invalid data
          const [x, y] = projection([longitude, latitude]);

          // Render attacker marker
          svg
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 5)
            .attr(
              "fill",
              type === "Botnet"
                ? "orange"
                : type === "Trojan"
                ? "yellow"
                : type === "Self"
                ? "red"
                : "green"
            )
            .attr("stroke", "#000")
            .attr("stroke-width", 1);

          // Add ripple effect
          svg
            .append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 0)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("opacity", 1)
            .transition()
            .duration(2000)
            .ease(d3.easeCubicOut)
            .attr("r", 15)
            .attr("opacity", 0)
            .remove();

          if (selfLocation) {
            const [selfX, selfY] = projection(selfLocation);

            const lineData = [
              [x, y],
              [selfX, selfY],
            ];

            svg
              .append("path")
              .datum(lineData)
              .attr("d", d3.line())
              .attr("stroke", "orange")
              .attr("stroke-width", 2)
              .attr("fill", "none")
              .attr("stroke-dasharray", function () {
                return this.getTotalLength();
              })
              .attr("stroke-dashoffset", function () {
                return this.getTotalLength();
              })
              .transition()
              .duration(3000)
              .ease(d3.easeCubicInOut)
              .attr("stroke-dashoffset", 0);
          }

          setProcessedIds((prev) => new Set(prev).add(id));
        });

        index += batchSize;
      };

      const intervalId = setInterval(() => {
        renderBatch();
        if (index >= newData.length) clearInterval(intervalId);
      }, interval);
    };

    fetch("https://api.findip.net/IP_Address/?token=42343e7777c0479c9360908fb3711252")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const { ip, latitude, longitude, country } = data;

        const selfData = {
          id: "self",
          ip: ip || "Unknown IP",
          country: country || "Unknown Country",
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
          type: "Self",
        };

        attackersData.push(selfData);

        renderNewMarkers(attackersData, [selfData.longitude, selfData.latitude]);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
        renderNewMarkers(attackersData, null);
      });
  }, [processedIds]);

  return <svg ref={mapRef}></svg>;
};

export default Map;
