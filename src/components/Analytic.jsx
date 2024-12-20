import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "../components/css/analytic.css";
import axios from "axios";

const Dashboard = () => {
  const [topIncidents, setTopIncidents] = useState([]);

  // MITRE Tactic Chart Options
  const [mitreTacticOptions, setMitreTacticOptions] = useState({
    chart: { type: "bar" },
    colors: ["#03a9f4"],
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
      animations: { enabled: true, easing: "linear", dynamicAnimation: { speed: 1000 } },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#fff" },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM yyyy",
          day: "dd MMM",
          hour: "HH:mm", // แสดงชั่วโมงและนาที
        },
      },
    },
    
    yaxis: { labels: { style: { colors: "#fff" } } },
    colors: ["#2ecc71"],
  };


  useEffect(() => {
    const fetchEndpointData = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-mitre-techniques`;

        

        const response = await axios.get(API_ENDPOINT);
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
  }, []);
  



  useEffect(() => {
    const fetchSeverityData = async () => {
      try {
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-agents`;

        

        const response = await axios.get(API_ENDPOINT);
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
  }, []);
  



  useEffect(() => {
    const fetchMitreData = async () => {
      try {
        
        
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-countries`;

        

        const response = await axios.get(API_ENDPOINT);
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
  }, []);
  





  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        
        const API_IP = import.meta.env.VITE_API_IP 
        const API_PORT = import.meta.env.VITE_API_PORT 
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/top-techniques`;

      

        const response = await axios.get(API_ENDPOINT);
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
  }, []);
  
  
  




  const fetchRealTimeData = async () => {
    try {
      // Fetch data from API
      
      const API_IP = import.meta.env.VITE_API_IP 
      const API_PORT = import.meta.env.VITE_API_PORT 
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/peak-attack-periods`;

      

      const response = await axios.get(API_ENDPOINT);
      const data = response.data;
      // Get current time in Thailand (GMT+7)
      const now = new Date(); // Current local time
      const thailandNow = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Adjust to GMT+7
  
      // Format API response into chart-compatible format
      const formattedData = data.map((item) => {
        const utcDate = new Date(item.timestamp); // Convert timestamp to Date object in UTC
        const thailandDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000); // Adjust to GMT+7
        return {
          x: thailandDate, // Use adjusted time
          y: item.count,
        };
      });
  
      // Ensure the latest point matches the current time
      const latestDataPoint = { x: thailandNow, y: 0 }; // Add a placeholder point for the current time
      const updatedData = [...formattedData, latestDataPoint].slice(-24); // Include latest point and keep only the last 20
  
      setRealTimeData([{ name: "Real-Time", data: updatedData }]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchRealTimeData(); // Initial fetch
    const interval = setInterval(fetchRealTimeData, 1000 * 60); // Fetch data every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  
  


  const fetchTopIncidents = async () => {
    try {
      // Fetch data from API
      

      const API_IP = import.meta.env.VITE_API_IP 
      const API_PORT = import.meta.env.VITE_API_PORT 
      const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/vulnerabilities`;

      

      const response = await axios.get(API_ENDPOINT);
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
        
      </thead>
      <tbody>
      <th>Severity</th>
      <th>Count</th>
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
        <h6>Top 10 countries that attack the most (200day) </h6>
        <Chart options={mitreTacticOptions} series={mitreTacticData} type="bar" height={300} />
      </div>

      {/* Top 5 agents */}
      <div className="p-3 grid-item-pie1">
        <h6>Top 5 agents (200day)</h6>
        <Chart options={severityOptions} series={severityData} type="donut" height={300} />
      </div>

      {/* Top 10 MITRE ATT&CKS */}
      <div className="p-3 grid-item-pie2">
        <h6>Top 10 MITRE ATT&CKS (200day)</h6>
        <Chart options={endpointOptions} series={endpointData} type="donut" height={300} />
      </div>

      {/* Incident Timeline Chart */}
      <div className="p-3 grid-item-full">
      <h6>The top MITRE techniques (7day)</h6>
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
