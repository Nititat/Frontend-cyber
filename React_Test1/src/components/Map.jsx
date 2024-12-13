import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import "./css/Map.css";

const Map = () => {
  const mapRef = useRef();
  const [selfLocation] = useState({
    latitude: 13.736717, // Fixed latitude (Example: Bangkok, Thailand)
    longitude: 100.523186, // Fixed longitude (Example: Bangkok, Thailand)
  });
  const [attackData, setAttackData] = useState([]);

  // Fixed Positions for Thailand and Singapore
  const fixedPositions = [
    {
      latitude: 13.736717,
      longitude: 100.523186,
      label: "Thailand",
      color: "#FF0000", // สีทอง (หรือปรับตามความต้องการ)
    },
    {
      latitude: 1.290270,
      longitude: 103.851959,
      label: "Singapore",
      color: "#FF4500", // สีแดงส้ม
    },
  ];
  

  // Colors for attack types
  const attackTypeColors = {
    "Web server 400 error code.": "#FFD700", // Bright Gold
    "CMS (WordPress or Joomla) login attempt.": "#2ECC71", // Emerald Green
    "Botnet Activity Detected and Blocked": "#E74C3C", // Bright Red
    "High amount of POST requests in a small period of time (likely bot).": "#F39C12", // Sunset Orange
    "Multiple web server 400 error codes from same source ip.": "#E67E22", // Deep Orange
    "WAF Alert: Request Blocked.": "#1ABC9C", // Light Turquoise
    "pure-ftpd: Multiple connection attempts from same source.": "#3498DB", // Sky Blue
    "pure-ftpd: FTP Authentication success.": "#16A085", // Teal Green
    "Query cache denied (probably config error).": "#9B59B6", // Amethyst Purple
    "Simple shell.php command execution.": "#2C3E50", // Navy Blue
    "SQL injection attempt.": "#27AE60", // Forest Green
    Unknown: "#F1C40F", // Bright Yellow
};

  

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 40 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background-color", "#1B213B");

    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countries = feature(topojsonData, topojsonData.objects.countries);

    // Draw the world map
    svg
  .selectAll("path")
  .data(countries.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("fill", "none") // ไม่มีสีพื้นหลังของประเทศ
  .attr("stroke", "#00ffcc") // สีเขียวเรืองแสง
  .attr("stroke-width", 0.7) // ความกว้างของเส้นขอบ
  .style("filter", "drop-shadow(0px 0px 6px #00ffcc)"); // เพิ่มแสงเรืองรอบเส้นขอบ


    // Add fixed positions for Thailand and Singapore
    fixedPositions.forEach((position) => {
      const [fixedX, fixedY] = projection([position.longitude, position.latitude]);

      // Add marker (circle)
      svg
        .append("circle")
        .attr("cx", fixedX)
        .attr("cy", fixedY)
        .attr("r", 2.5)
        .attr("fill", position.color) // Use specified color
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 0);

      // Add label
      svg
        .append("text")
        .attr("x", fixedX + 7)
        .attr("y", fixedY)
        .text(position.label)
        .attr("fill", "#FFFFFF")
        .style("font-size", "12px");
    });

    const fetchAttackData = async () => {
      try {
        const [latestResponse, mitreResponse] = await Promise.all([
          fetch("http://localhost:5000/api/latest_alert"),
          fetch("http://localhost:5000/api/mitre_alert"),
        ]);

        if (!latestResponse.ok || !mitreResponse.ok) {
          throw new Error("Error fetching API data");
        }

        const latestData = await latestResponse.json();
        const mitreData = await mitreResponse.json();

        const combinedData = [...latestData, ...mitreData];

        const filteredData = combinedData
          .map((item) => {
            const geoLocation = item._source.GeoLocation || {};
            const agentName = item._source.agent?.name || "";
            const target = agentName.startsWith("sg")
              ? fixedPositions[1] // Singapore
              : fixedPositions[0]; // Default to Thailand

            return {
              id: item._id,
              latitude: geoLocation.location?.lat,
              longitude: geoLocation.location?.lon,
              type: item._source?.rule?.description || "Unknown",
              targetLatitude: target.latitude,
              targetLongitude: target.longitude,
            };
          })
          .filter((item) => item.latitude && item.longitude);

        setAttackData(filteredData);
      } catch (error) {
        console.error("Error fetching attack data:", error);
      }
    };

    fetchAttackData();

    const intervalId = setInterval(fetchAttackData, 1000); // Fetch data every second

    return () => clearInterval(intervalId); // Cleanup interval
  }, []);

  useEffect(() => {
    const svg = d3.select(mapRef.current);

    const drawInvertedCurvedLine = async (data) => {
        const projection = d3
            .geoNaturalEarth1()
            .scale(150)
            .translate([960 / 2, 500 / 2]);

        const curvedLine = d3
            .line()
            .curve(d3.curveBasis)
            .x((d) => projection(d)[0])
            .y((d) => projection(d)[1]);

        // Group data by source and target coordinates
        const groupedAttacks = d3.group(data, d => `${d.longitude},${d.latitude}-${d.targetLongitude},${d.targetLatitude}`);

        for (const [key, attacks] of groupedAttacks) {
            const { longitude, latitude, targetLatitude, targetLongitude } = attacks[0];

            if (!longitude || !latitude) continue;

            const source = [longitude, latitude];
            const target = [targetLongitude, targetLatitude];
            const midPoint = [
                (longitude + targetLongitude) / 2,
                (latitude + targetLatitude) / 2 + 23, // Adjust for "inverted" arc
            ];

            for (let i = 0; i < attacks.length; i++) {
                const attack = attacks[i];
                const attackColor = attackTypeColors[attack.type] || "#FFBA08";

                const offset = i * 2; // Offset for duplicate lines

                // Adjust midpoint to create separation for duplicate lines
                const adjustedMidPoint = [
                    midPoint[0],
                    midPoint[1] + offset,
                ];

                // Add source radiating circle
                svg
                    .append("circle")
                    .attr("cx", projection(source)[0])
                    .attr("cy", projection(source)[1])
                    .attr("r", 0)
                    .attr("fill", attackColor)
                    .attr("opacity", 0.7)
                    .transition()
                    .duration(800)
                    .attr("r", 10)
                    .attr("opacity", 0)
                    .remove();

                // Draw the curved line
                const path = svg
                    .append("path")
                    .datum([source, adjustedMidPoint, target])
                    .attr("d", curvedLine)
                    .attr("fill", "none")
                    .attr("stroke", attackColor)
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", function () {
                        return this.getTotalLength();
                    })
                    .attr("stroke-dashoffset", function () {
                        return this.getTotalLength();
                    })
                    .transition()
                    .duration(1500)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0)
                    .on("end", function () {
                        d3.select(this)
                            .transition()
                            .duration(800)
                            .attr("stroke-dashoffset", -this.getTotalLength()) // Remove the stroke gradually from the start
                            .style("opacity", 0)
                            .remove();
                    });

                // Add target radiating circle
                svg
                    .append("circle")
                    .attr("cx", projection(target)[0])
                    .attr("cy", projection(target)[1])
                    .attr("r", 0)
                    .attr("fill", attackColor)
                    .attr("opacity", 0.7)
                    .transition()
                    .duration(800)
                    .attr("r", 10)
                    .attr("opacity", 0)
                    .remove();

                // Add a delay between animations
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
        }
    };

    // Draw the animations with inverted arcs
    drawInvertedCurvedLine(attackData);
}, [attackData]);


  
  
  
  

  return <svg ref={mapRef}></svg>;
};

export default Map;