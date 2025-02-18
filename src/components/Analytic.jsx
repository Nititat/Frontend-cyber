import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "../components/css/analytic.css";
import axiosInstance from "../utils/axiosInstance"; // ใช้ axiosInstance แทน axios
import { DateTime } from "luxon";
import { getOffsetLeft } from "@mui/material";

const Dashboard = () => {
  const [topIncidents, setTopIncidents] = useState([]);
  const [selectedDays, setSelectedDays] = useState(200); // ค่าเริ่มต้นเป็น 200 วัน
  const [selectedDays2, setSelectedDays2] = useState(200); // ค่าเริ่มต้นเป็น 200 วัน
  const [selectedDays3, setSelectedDays3] = useState(200); // ค่าเริ่มต้นเป็น 200 วัน
  const [selectedDays4, setSelectedDays4] = useState(200); // ค่าเริ่มต้นเป็น 200 วัน
  


  // MITRE Tactic Chart Options
  const [mitreTacticOptions, setMitreTacticOptions] = useState({
    chart: { type: "bar" },
    colors: ["#2ecc71"],
    xaxis: { categories: [], labels: { style: { colors: "#fff" } } },
    yaxis: {
      labels: {
        style: { colors: "#fff" },
        formatter: (value) => {
          // ฟอร์แมตค่าตัวเลขให้สวยงาม
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + "M"; // ใช้ M สำหรับล้าน
          } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + "K"; // ใช้ K สำหรับพัน
          }
          return value;
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
      formatter: (val) => {
        return val; // แสดงค่าตัวเลขที่ชัดเจนบนกราฟ
      },
    },
    plotOptions: {
      bar: {
        horizontal: true, // ถ้าคุณต้องการกราฟเป็นแนวตั้ง
        columnWidth: "60%", // ปรับขนาดแถบกราฟ
        endingShape: "rounded", // ทำให้แถบกราฟมีมุมโค้ง
      }
    },
  });

  const [mitreTacticData, setMitreTacticData] = useState([{ data: [] }]);

  // Severity Pie Chart Options
  const [severityOptions, setSeverityOptions] = useState({
    chart: { type: "donut" },
    labels: [], // Labels will be dynamically set based on agent_name
    colors: [
      "#e74c3c", // Red
      "#f1c40f", // Yellow
      "#3498db", // Blue
      "#2ecc71", // Green
      "#9b59b6", // Purple
      "#f39c12"  // Orange
    ]
    
  });

  const [severityData, setSeverityData] = useState([]);

  // Vulnerable Endpoints Chart Options
  const [endpointOptions, setEndpointOptions] = useState({
    chart: { type: "donut" },
    labels: [], // Dynamic labels (techniques)
    colors: [
      "#00c6ff", // Light Blue
      "#17ead9", // Aqua
      "#f7971e", // Orange
      "#ff7675", // Light Red
      "#6c5ce7", // Purple
      "#e74c3c", // Red
      "#3498db", // Blue
      "#2ecc71", // Green
      "#f1c40f", // Yellow
      "#9b59b6"  // Violet
    ]
    
  });

  const [endpointData, setEndpointData] = useState([]);

  // Incident Timeline Chart Options
  const incidentTimelineOptions = {
    chart: {
      type: "line",
      animations: { enabled: true, dynamicAnimation: { speed: 1000 } },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "datetime", labels: { style: { colors: "#fff" } } },
    yaxis: { labels: { style: { colors: "#fff" } } },
    colors: ["#1abc9c", "#9b59b6", "#e74c3c", "#16a085", "#f39c12"]
  // กำหนดสีของกราฟ
  };
  const [incidentTimelineData, setIncidentTimelineData] = useState([]);


  // Real-Time Chart Options
  const [realTimeData, setRealTimeData] = useState([
    { name: "Real-Time", data: [] },
  ]);
  
  const realTimeChartOptions = {
    chart: {
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: { speed: 1000 },
      },
    },
    stroke: { 
      curve: "smooth", 
      width: 2 
    },
    xaxis: {
      type: "datetime",
      tickPlacement: "on", // ให้ tick ของแกน X อยู่ตรงกลาง
      labels: {
        style: { colors: "#fff" },
        formatter: function (val) {
          return DateTime.fromMillis(val).setZone("Asia/Bangkok").toFormat("HH:00"); // แสดงเวลาแบบชั่วโมงเต็ม
        },
      },
      tooltip: {
        enabled: true,
        formatter: function (val) {
          return DateTime.fromMillis(val).setZone("Asia/Bangkok").toFormat("dd MMM HH:00 น."); 
        },
      },
    },
    yaxis: { labels: { style: { colors: "#fff" } } },
    markers: {
      size: 5,
      colors: ["#ff0000"],
      strokeWidth: 2,
      hover: { size: 6 },
    },
    colors: ["#2ecc71"],
  };
  
  
  
  
  
  
  
  
  


  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-mitre-techniques?days=${selectedDays3}`;

        

        const response = await axiosInstance.get(API_ENDPOINT);
        const data = response.data;
  
        // Extract labels (techniques) and series data (counts)
        const labels = data.map((item) => item.technique); // Assuming "technique" is the label
        const seriesData = data.map((item) => item.count);
  
        // Update Chart Options and Data
        setEndpointOptions((prevOptions) => ({
          ...prevOptions,
          labels: labels,
        }));
  
        setEndpointData(seriesData);
      } catch (error) {
        console.error("Error fetching endpoint data:", error);
      }
    };
  
    // Fetch data immediately on component mount
    fetchEndpointData();
  
    // Set interval to fetch data every 1 minute
    const interval = setInterval(fetchEndpointData, 1000 * 60); // 1 minute
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedDays3]);
  



  useEffect(() => {
    const fetchSeverityData = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-agents?days=${selectedDays2}`;

        

        const response = await axiosInstance.get(API_ENDPOINT);
        const data = response.data;
        
        // Assuming the API returns data in this format:
        // [
        //   { "agent_name": "vps.thaischool.in.th", "count": 8556671 },
        //   { "agent_name": "th699.ruk-com.in.th", "count": 5527813 },
        //   { "agent_name": "th238.ruk-com.in.th", "count": 5496177 },
        //   ...
        // ]
  
        // Extract agent names and counts
        const agentNames = data.map(item => item.agent_name);
        const counts = data.map(item => item.count);
  
        // Update severity chart options with agent names
        setSeverityOptions(prevOptions => ({
          ...prevOptions,
          labels: agentNames,
        }));
  
        // Update the data for the chart
        setSeverityData(counts);
      } catch (error) {
        console.error("Error fetching severity data:", error);
      }
    };
  
    // Initial fetch
    fetchSeverityData();
  
    // Set interval to fetch data every 1 minute
    const interval = setInterval(fetchSeverityData, 1000 * 60); // 1 minute
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedDays2]);
  



  useEffect(() => {
    const fetchMitreData = async () => {
      try {
        
        
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-countries?days=${selectedDays}`;

        

        const response = await axiosInstance.get(API_ENDPOINT);
        const data = response.data;

        // Extract categories (countries) and series data (counts)
        const categories = data.map((item) => item.country); // Assuming API returns "country"
        const seriesData = data.map((item) => item.count); // Assuming API returns "count"
  
        // Update Chart Options and Data
        setMitreTacticOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: { ...prevOptions.xaxis, categories: categories },
        }));
  
        setMitreTacticData([{ data: seriesData }]);
      } catch (error) {
        console.error("Error fetching MITRE data:", error);
      }
    };
  
    // Initial fetch
    fetchMitreData();
  
    // Set interval to fetch data every 1 minute
    const interval = setInterval(fetchMitreData, 1000 * 60); // 1 minute
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedDays]);
  





  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-techniques?days=${selectedDays4}`;

      

        const response = await axiosInstance.get(API_ENDPOINT);
        const data = response.data;
        // แปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ ApexCharts รองรับ
        const chartData = data.map((item) => ({
          name: item.technique,
          data: item.histogram.map((bucket) => ({
            x: new Date(bucket.timestamp).getTime(), // แปลง timestamp เป็น Unix timestamp
            y: bucket.count, // จำนวนที่แสดงในแกน Y
          })),
        }));
  
        setIncidentTimelineData(chartData); // อัปเดตข้อมูลใน state
      } catch (error) {
        console.error("Error fetching incident data:", error);
      }
    };
  
    // Initial fetch
    fetchIncidentData();
  
    // Set interval to fetch data every 1 minute
    const interval = setInterval(fetchIncidentData, 1000 * 60); // 1 minute
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [selectedDays4]);
  
  
  




  

  const fetchRealTimeData = async () => {
    try {
      const API_IP = import.meta.env.VITE_API_IP;
      const API_PORT = import.meta.env.VITE_API_PORT;
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/peak-attack-periods`;
  
      const response = await axiosInstance.get(API_ENDPOINT);
      const data = response.data;
  
      // แปลง timestamp จาก API ให้เป็นค่า milliseconds ที่พอดีกับ `HH:00`
      const formattedData = data.map((item) => {
        const dateTime = DateTime.fromISO(item.timestamp, { zone: "Asia/Bangkok" }).startOf("hour"); // ปรับให้เป็นชั่วโมงเต็ม
        return {
          x: dateTime.toMillis(), // ใช้ timestamp ที่พอดีกับชั่วโมงเต็ม
          y: item.count,
        };
      });
  
      console.log("Formatted Data for Chart:", formattedData); // Debug ค่าก่อนส่งให้กราฟ
  
      setRealTimeData([
        {
          name: "Real-Time",
          data: formattedData,
        },
      ]);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 1000 * 60 * 60); // อัปเดตทุก 1 ชั่วโมง
    return () => clearInterval(interval);
  }, []);
  
  

  
  
  
  
  
  
  


  const fetchTopIncidents = async () => {
    try {
      // Fetch data from API
      

      const API_IP = import.meta.env.VITE_API_IP 
      const API_PORT = import.meta.env.VITE_API_PORT 
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/vulnerabilities`;

      

      const response = await axiosInstance.get(API_ENDPOINT);
      const data = response.data;
      // Format the data to match the required structure
      const formattedData = data.map((item) => ({
        severity: item.severity,
        description: `${item.count}`, // Combine count into description
      }));
  
      // Update the state
      setTopIncidents(formattedData);
    } catch (error) {
      console.error("Error fetching top incidents:", error);
    }
  };
  
  useEffect(() => {
    // Initial fetch
    fetchTopIncidents();
  
    // Set interval to fetch data every 1 minute
    const interval = setInterval(fetchTopIncidents, 1000 * 60); // 1 minute
  
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  return (
      <div className="container-fluid">





        {/* Top Incidents Table */}
<div className="p-3 grid-item-table">
  <h6> Vulnerability Detection </h6>
  <table className="table">
    <thead>
      <tr>
        <th>Severity</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody>
      {topIncidents.map((incident, index) => (
        <tr key={index}>
          <td>
            <span
              className={`severity-label ${
                incident.severity.toLowerCase() // Apply "high", "medium", or "low" class
              }`}
            >
              {incident.severity}
            </span>
          </td>
          <td>{incident.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Alerts by MITRE Tactic */}
      <div className="p-3 grid-item-chart">
        <div className="chart-header">
          <h6>Top 10 countries that attack the most</h6>
          <select
            id="timeRange"
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
          >
            <option value={1}>Last 1 Day</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={200}>Last 200 Days</option>
          </select>
        </div>
        <Chart options={mitreTacticOptions} series={mitreTacticData} type="bar" height={300} />
      </div>


      {/* Top 5 agents */}
      <div className="p-3 grid-item-pie1">
        <div className="chart-header">
        <h6>Top 5 agents </h6>
        <select
            id="timeRange"
            value={selectedDays2}
            onChange={(e) => setSelectedDays2(Number(e.target.value))}
          >
            <option value={1}>Last 1 Day</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={200}>Last 200 Days</option>
          </select>
        </div>
        <Chart options={severityOptions} series={severityData} type="donut" height={300} />
      </div>

      {/* Top 10 MITRE ATT&CKS */}
      <div className="p-3 grid-item-pie2">
        <div className="chart-header">
        <h6>Top 10 MITRE ATT&CKS </h6>
        <select
            id="timeRange"
            value={selectedDays3}
            onChange={(e) => setSelectedDays3(Number(e.target.value))}
          >
            <option value={1}>Last 1 Day</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={200}>Last 200 Days</option>
          </select>
        </div>
        <Chart options={endpointOptions} series={endpointData} type="donut" height={300} />
      </div>

      {/* Incident Timeline Chart */}
      <div className="p-3 grid-item-full">
      <div className="chart-header">
      <h6>The top MITRE techniques </h6>
      <select
            id="timeRange"
            value={selectedDays4}
            onChange={(e) => setSelectedDays4(Number(e.target.value))}
          >
            <option value={1}>Last 1 Day</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={200}>Last 200 Days</option>
          </select>
        </div>
      <Chart options={incidentTimelineOptions} series={incidentTimelineData} type="line" height={300} />
    </div>

      {/* Real-Time Chart */}
      <div className="p-3 grid-item-full">
        
        <h6>RECENT DAILY ATTACKS</h6>
        <Chart options={realTimeChartOptions} series={realTimeData} type="line" height={300} />
      </div>
    </div>
  );
};

export default Dashboard;
