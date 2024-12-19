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
    "Web server 400 error code.": "#FF5733", // Orange Red
    "CMS (WordPress or Joomla) login attempt.": "#33FF57", // Bright Green
    "Botnet Activity Detected and Blocked": "#3357FF", // Bright Blue
    "High amount of POST requests in a small period of time (likely bot).": "#FF33A8", // Pink
    "Multiple web server 400 error codes from same source ip.": "#A833FF", // Purple
    "WAF Alert: Request Blocked.": "#33FFF3", // Cyan
    "pure-ftpd: Multiple connection attempts from same source.": "#FFC300", // Yellow Gold
    "pure-ftpd: FTP Authentication success.": "#C70039", // Crimson Red
    "Query cache denied (probably config error).": "#900C3F", // Dark Red
    "Simple shell.php command execution.": "#581845", // Dark Purple
    "SQL injection attempt.": "#DAF7A6", // Light Green
    "Vulnerability Scanning": "#FF7F50", // Coral
    "Password Guessing": "#87CEEB", // Sky Blue
    "Stored Data Manipulation": "#6495ED", // Cornflower Blue
    "Exploit Public-Facing Application": "#FFD700", // Bright Gold
    "Process Injection": "#FF4500", // Orange Red
    "Data Destruction": "#2E8B57", // Sea Green
    "File Deletion": "#20B2AA", // Light Sea Green
    "Valid Accounts": "#7B68EE", // Medium Slate Blue
    "SSH": "#6A5ACD", // Slate Blue
    "File and Directory Discovery": "#00CED1", // Dark Turquoise
    "Brute Force": "#FF6347", // Tomato
    "Endpoint Denial of Service": "#4682B4", // Steel Blue
    "Network Denial of Service": "#32CD32", // Lime Green
    "JavaScript": "#BA55D3", // Medium Orchid
    "Sudo and Sudo Caching": "#F08080", // Light Coral
    "Remote Services": "#48D1CC", // Medium Turquoise
    "Exploitation for Privilege Escalation": "#FF1493", // Deep Pink
    "Exploitation of Remote Services": "#00FF7F", // Spring Green
    "Exploitation for Client Execution": "#8B0000", // Dark Red
    "Web Shell": "#CD853F", // Peru
      Unknown: "#B0C4DE" // Light Steel Blue
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
        // ใช้ environment variables เพื่อสร้าง URL
        const API_IP = import.meta.env.VITE_API_IP ;
        const API_PORT = import.meta.env.VITE_API_PORT ;
        const LATEST_ALERT_URL = `http://${API_IP}:${API_PORT}/api/latest_alert`;
        const MITRE_ALERT_URL = `http://${API_IP}:${API_PORT}/api/mitre_alert`;
    
        console.log("Fetching data from:", LATEST_ALERT_URL, MITRE_ALERT_URL); // Debug URLs
    
        const [latestResponse, mitreResponse] = await Promise.all([
          fetch(LATEST_ALERT_URL),
          fetch(MITRE_ALERT_URL),
        ]);
    
        // ตรวจสอบสถานะการตอบกลับ
        if (!latestResponse.ok || !mitreResponse.ok) {
          throw new Error("Error fetching API data");
        }
    
        // แปลงข้อมูลจาก JSON
        const latestData = await latestResponse.json();
        const mitreData = await mitreResponse.json();
    
        // รวมข้อมูลจากทั้งสอง API
        const combinedData = [...latestData, ...mitreData];
    
        // กรองข้อมูลและปรับโครงสร้าง
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
    
        // อัปเดต state
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
  
      // ปรับความเร็วตามจำนวนข้อมูล (ข้อมูลมาก -> ใช้เวลา animate น้อยลง)
      const baseDuration = 1500; // ระยะเวลาเริ่มต้น
      const speedFactor = Math.max(300, baseDuration / Math.log(data.length + 1)); // ลดความเร็วแบบลอการิทึม
      const delayBetweenLines = speedFactor / 8; // หน่วงเวลาแอนิเมชันระหว่างเส้น
  
      console.log(`Adjusting animation speed: ${speedFactor} ms per line`);
  
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
              const attackColor = attackTypeColors[attack.type] || "#B0C4DE";
  
              const offset = i * 2; // Offset for duplicate lines
  
              // Adjust midpoint to create separation for duplicate lines
              const adjustedMidPoint = [
                  midPoint[0],
                  midPoint[1] + offset,
              ];
  
              // Add source radiating circle
              svg.append("circle")
                  .attr("cx", projection(source)[0])
                  .attr("cy", projection(source)[1])
                  .attr("r", 0)
                  .attr("fill", attackColor)
                  .attr("opacity", 0.7)
                  .transition()
                  .duration(speedFactor / 2)
                  .attr("r", 10)
                  .attr("opacity", 0)
                  .remove();
  
              // Draw the curved line
              svg.append("path")
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
                  .duration(speedFactor)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0)
                  .on("end", function () {
                      d3.select(this)
                          .transition()
                          .duration(speedFactor / 2)
                          .attr("stroke-dashoffset", -this.getTotalLength())
                          .style("opacity", 0)
                          .remove();
                  });
  
              // Add target radiating circle
              svg.append("circle")
                  .attr("cx", projection(target)[0])
                  .attr("cy", projection(target)[1])
                  .attr("r", 0)
                  .attr("fill", attackColor)
                  .attr("opacity", 0.7)
                  .transition()
                  .duration(speedFactor / 2)
                  .attr("r", 10)
                  .attr("opacity", 0)
                  .remove();
  
              // Add a delay between animations
              await new Promise((resolve) => setTimeout(resolve, delayBetweenLines));
          }
      }
  };
  
  

    // Draw the animations with inverted arcs
    drawInvertedCurvedLine(attackData);
}, [attackData]);


  
  
  
  

  return <svg ref={mapRef}></svg>;
};

export default Map;