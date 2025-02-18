import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import "./css/Map.css";
import axiosInstance from "../utils/axiosInstance"; // ใช้ axiosInstance แทน axios

const Map = () => {
  const mapRef = useRef();
  const tooltipRef = useRef(); // สำหรับ Tooltip
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
//   const attackTypeColors = {
//     "Web server 400 error code.": "#FF5733", // Orange Red
//     "CMS (WordPress or Joomla) login attempt.": "#33FF57", // Bright Green
//     "Botnet Activity Detected and Blocked": "#FF2929", // Bright Blue
//     "High amount of POST requests in a small period of time (likely bot).": "#FF33A8", // Pink
//     "Multiple web server 400 error codes from same source ip.": "#A833FF", // Purple
//     "WAF Alert: Request Blocked.": "#33FFF3", // Cyan
//     "pure-ftpd: Multiple connection attempts from same source.": "#FFC300", // Yellow Gold
//     "pure-ftpd: FTP Authentication success.": "#C70039", // Crimson Red
//     "Query cache denied (probably config error).": "#900C3F", // Dark Red
//     "Simple shell.php command execution.": "#581845", // Dark Purple
//     "SQL injection attempt.": "#DAF7A6", // Light Green
//     "Vulnerability Scanning": "#FF7F50", // Coral
//     "Password Guessing": "#87CEEB", // Sky Blue
//     "Stored Data Manipulation": "#6495ED", // Cornflower Blue
//     "Exploit Public-Facing Application": "#FFD700", // Bright Gold
//     "Process Injection": "#FF4500", // Orange Red
//     "Data Destruction": "#2E8B57", // Sea Green
//     "File Deletion": "#20B2AA", // Light Sea Green
//     "Valid Accounts": "#7B68EE", // Medium Slate Blue
//     "SSH": "#6A5ACD", // Slate Blue
//     "File and Directory Discovery": "#00CED1", // Dark Turquoise
//     "Brute Force": "#FF6347", // Tomato
//     "Endpoint Denial of Service": "#4682B4", // Steel Blue
//     "Network Denial of Service": "#32CD32", // Lime Green
//     "JavaScript": "#BA55D3", // Medium Orchid
//     "Sudo and Sudo Caching": "#F08080", // Light Coral
//     "Remote Services": "#48D1CC", // Medium Turquoise
//     "Exploitation for Privilege Escalation": "#FF1493", // Deep Pink
//     "Exploitation of Remote Services": "#00FF7F", // Spring Green
//     "Exploitation for Client Execution": "#8B0000", // Dark Red
//     "Web Shell": "#CD853F", // Peru
//       Unknown: "#81BFDA" // Light Steel Blue
// };
const [attackTypeColors, setAttackTypeColors] = useState({});

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

const ATTACK_COLOR_URL = `https://${API_IP}:${API_PORT}/api/attack_colors`;

const getAttackColorFromDB = async (attackType) => {
  try {
    const response = await axiosInstance.get(`${ATTACK_COLOR_URL}/${encodeURIComponent(attackType)}`);
    return response.data.color;
  } catch (error) {
    console.error("Error fetching attack color:", error);
    return "#81BFDA"; // สีสำรองกรณี API ใช้งานไม่ได้
  }
};

// ดึงสีจากฐานข้อมูลเมื่อพบประเภทการโจมตีใหม่
useEffect(() => {
  const fetchColors = async () => {
    const attackTypes = new Set(attackData.map((item) => item.type));

    attackTypes.forEach(async (attackType) => {
      if (!attackTypeColors[attackType]) {
        const color = await getAttackColorFromDB(attackType);
        setAttackTypeColors((prevColors) => ({
          ...prevColors,
          [attackType]: color,
        }));
      }
    });
  };

  if (attackData.length > 0) {
    fetchColors();
  }
}, [attackData]);

  

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 40 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      // .style("background-color", "#1B213B");

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
    .attr("fill", "#DDDDDD") // ไม่มีสีพื้นหลังของประเทศ
    .attr("stroke", "#ffffff") // สีเขียวเรืองแสง
    .attr("stroke-width", 0.3) // ความกว้างของเส้นขอบ
  // .style("filter", "drop-shadow(0px 0px 6px #00ffcc)"); // เพิ่มแสงเรืองรอบเส้นขอบ


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

          // Add background for label (กรอบพื้นหลัง)
          svg
          .append("rect")
          .attr("x", fixedX + 7)
          .attr("y", fixedY - 11)
          .attr("width", position.label.length * 6)
          .attr("height", 16)
          .attr("rx", 8) // More rounded corners
          .attr("ry", 8)
          .attr("fill", "rgba(41, 167, 51, 0.9)") // Slightly more opaque
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))") // Subtle shadow
          .style("pointer-events", "none");
        
        svg
          .append("text")
          .attr("x", fixedX + 14)
          .attr("y", fixedY)
          .text(position.label)
          .attr("fill", "white")
          .style("font-size", "8px")
          .style("font-weight", "550") // Slightly bolder
          .style("font-family", "'Inter', Arial, sans-serif")
          .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.3)") // Text shadow for depth
          .style("pointer-events", "none");





    });

    const fetchAttackData = async () => {
      try {
        // ใช้ environment variables เพื่อสร้าง URL
        const API_IP = import.meta.env.VITE_API_IP;
        const API_PORT = import.meta.env.VITE_API_PORT;
        const LATEST_ALERT_URL = `https://${API_IP}:${API_PORT}/api/latest_alert`;
        const MITRE_ALERT_URL = `https://${API_IP}:${API_PORT}/api/mitre_alert`;
    
        console.log("Fetching data from:", LATEST_ALERT_URL, MITRE_ALERT_URL); // Debug URLs
    
        // ใช้ Promise.all กับ axiosInstance
        const [latestResponse, mitreResponse] = await Promise.all([
          axiosInstance.get(LATEST_ALERT_URL),
          axiosInstance.get(MITRE_ALERT_URL),
        ]);
    
        // ดึงข้อมูลจาก Response
        const latestData = latestResponse.data;
        const mitreData = mitreResponse.data;
    
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
    
    // เรียกใช้ฟังก์ชัน
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
        .curve(d3.curveNatural)
        .x((d) => projection(d)[0])
        .y((d) => projection(d)[1]);
  
      const baseDuration = 1200; // ความเร็วพื้นฐาน
      const speedFactor = Math.max(300, baseDuration / Math.log(data.length + 1));
      const delayBetweenLines = speedFactor / 8;
  
      console.log(`Adjusting animation speed: ${speedFactor} ms per line`);
  
      // กลุ่มข้อมูลตามพิกัดต้นทางและเป้าหมาย
      const groupedAttacks = d3.group(data, (d) => `${d.longitude},${d.latitude}-${d.targetLongitude},${d.targetLatitude}`);
  
      for (const [key, attacks] of groupedAttacks) {
        const { longitude, latitude, targetLatitude, targetLongitude } = attacks[0];
  
        if (!longitude || !latitude) continue;
  
        const source = [longitude, latitude];
        const target = [targetLongitude, targetLatitude];
        const midPoint = [
          (longitude + targetLongitude) / 2,
          (latitude + targetLatitude) / 2 + 23, // เพิ่มส่วนโค้ง
        ];
  
        for (let i = 0; i < attacks.length; i++) {
          const attack = attacks[i];
          const attackColor = attackTypeColors[attack.type] || "#81BFDA";
  
          // ไฮไลต์ประเทศต้นทาง
          const sourceCountry = svg
          .selectAll("path")
          .filter((d) => {
            return d3.geoContains(d, source);
          });
  
          
  
          // เพิ่มวงกลมรอบประเทศต้นทาง
          svg
            .append("circle")
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
  
          
            const linePath = svg
                .append("path")
                .datum([source, midPoint, target])
                .attr("d", curvedLine)
                .attr("fill", "none")
                .attr("stroke", "none");

            // Get total length for animation
            const totalLength = linePath.node().getTotalLength();
            const STROKE_WIDTH = 1.9; // กำหนดค่าคงที่สำหรับความหนาของเส้น

            // Create unique gradient ID to avoid conflicts
            const gradientId = `trailGradient-${Math.random().toString(36).substr(2, 9)}`;

            const gradient = svg.append("defs")
                .append("linearGradient")
                .attr("id", gradientId)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            // Convert attackColor to rgba format for consistent opacity handling
            const baseColor = d3.color(attackColor);
            const startColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`;
            const midColor = attackColor;
            const endColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`;

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", startColor);

            gradient.append("stop")
                .attr("offset", "50%")
                .attr("stop-color", midColor);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", endColor);

            const trailPath = svg
                .append("path")
                .attr("fill", "none")
                .attr("stroke", `url(#${gradientId})`)
                .attr("stroke-width", STROKE_WIDTH )
                .attr("stroke-linecap", "round")
                // .style("pointer-events", "none")
                .attr("opacity", 1)
                // .style("filter", `drop-shadow(0 0 20px ${attackColor})`); 

            // Animate trails
            trailPath
                .transition()
                .duration(speedFactor)
                .ease(d3.easeLinear)
                .attrTween("d", function() {
                    return function(t) {
                        const trailLength = 150;
                        const numPoints = 50;
                        const trailPoints = [];
                        
                        for (let i = 0; i <= numPoints; i++) {
                            const trailT = Math.max(0, t - (i / numPoints) * (trailLength / totalLength));
                            if (trailT >= 0) {
                                const point = linePath.node().getPointAtLength(trailT * totalLength);
                                point.opacity = 1 / numPoints;
                                trailPoints.push(point);
                            }
                        }
                        
                        const trailLine = d3.line()
                            .x(d => d.x)
                            .y(d => d.y)
                            .curve(d3.curveCatmullRom.alpha(0.5));
                        
                        const progress = trailPoints.length / numPoints;
                        const fadeIntensity = 1 - Math.pow(progress - 0.5, 2);
                        
                        trailPath
                            .attr("opacity", Math.min(0.8, fadeIntensity));
                        
                        return trailLine(trailPoints);
                    };
                })
                .on("start", () => {
                    const baseColor = d3.color(attackColor);
                    const lighterColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.5)`; // Reduced opacity to 0.2
                    sourceCountry.attr("fill", lighterColor);
                })
                // .style("opacity", 0)
                .on("end", function() {
                    trailPath.remove();
                    linePath.remove();
                    gradient.remove(); // Clean up gradient definition
                    sourceCountry.attr("fill", "#DDDDDD");
                });

            // Remove the original path
            linePath.remove();



  
          // เพิ่มวงกลมรอบเป้าหมาย
          svg
            .append("circle")
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
  
          // เพิ่มการหน่วงเวลาแอนิเมชัน
          await new Promise((resolve) => setTimeout(resolve, delayBetweenLines));
        }
      }
    };
  
    drawInvertedCurvedLine(attackData);
  }, [attackData]);
  


  
  
  
  

  return <svg ref={mapRef}></svg>;
};

export default Map;