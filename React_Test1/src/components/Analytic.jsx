import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "../components/css/analytic.css";
import axios from "axios";

const Dashboard = () => {
  // Data for Top Incidents Table
  const topIncidents = [
    { severity: "High", description: "Possible LSASS Memory Attack", alerts: 111 },
    { severity: "High", description: "29 HTTP /etc/password Access", alerts: 29 },
    { severity: "Medium", description: "Behavioral Threat", alerts: 15 },
    { severity: "Medium", description: "Recurring DNS Queries", alerts: 13 },
  ];

  // MITRE Tactic Chart Options
  const mitreTacticOptions = {
    chart: { type: "bar" },
    colors: ["#03a9f4"],
    xaxis: {
      categories: ["USA", "Thailand", "Japan", "Germany", "India", "Brazil", "Russia", "Australia", "France", "Canada"],
      labels: { style: { colors: "#fff" } },
    },
    yaxis: { labels: { style: { colors: "#fff" } } },
  };

  const mitreTacticData = [{ data: [106, 81, 65, 26, 6, 10, 100, 5, 4, 6] }];

  // Severity Pie Chart Options
  const severityOptions = {
    chart: { type: "donut" },
    labels: ["High", "Medium", "Low"],
    colors: ["#e74c3c", "#f1c40f", "#3498db"],
  };

  const severityData = [7, 8, 7];

  // Vulnerable Endpoints Chart Options
  const endpointOptions = {
    chart: { type: "donut" },
    labels: ["centos-srv-122", "centos-prod", "PC23"],
    colors: ["#00c6ff", "#17ead9", "#f7971e"],
  };

  const endpointData = [1984, 1769, 1581];

  // Incident Timeline Chart Options
  const incidentTimelineOptions = {
    chart: {
      type: "line",
      animations: { enabled: true, dynamicAnimation: { speed: 1000 } },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "datetime", labels: { style: { colors: "#fff" } } },
    yaxis: { labels: { style: { colors: "#fff" } } },
    colors: ["#17ead9", "#f02fc2"],
  };

  const incidentTimelineData = [
    { name: "Aged", data: [[Date.now(), 10], [Date.now() + 60000, 20]] },
    { name: "Unresolved", data: [[Date.now(), 5], [Date.now() + 60000, 15]] },
  ];

  // Real-Time Chart Options
  const realTimeChartOptions = {
    chart: {
      type: "line",
      animations: { enabled: true, easing: "linear", dynamicAnimation: { speed: 1000 } },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "datetime", labels: { style: { colors: "#fff" } } },
    yaxis: { labels: { style: { colors: "#fff" } } },
    colors: ["#2ecc71"],
  };

  const [realTimeData, setRealTimeData] = useState([{ name: "Real-Time", data: [] }]);

  // Simulate Real-Time Data
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prevData) => {
        const newPoint = { x: Date.now(), y: Math.floor(Math.random() * 100) + 1 }; // Random y-value
        const updatedData = [...prevData[0].data, newPoint].slice(-20); // Keep last 20 points
        return [{ name: "Real-Time", data: updatedData }];
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
      <div className="container-fluid">
        {/* Top Incidents Table */}
        <div className="p-3 grid-item-table">
    <h6> Incidents </h6>
    <table className="table">
      <thead>
        <tr>
          <th>Severity</th>
          <th>Description</th>
          <th>Alerts</th>
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
            <td>{incident.alerts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


      {/* Alerts by MITRE Tactic */}
      <div className="p-3 grid-item-chart">
        <h6>Top 10 countries that attack the most</h6>
        <Chart options={mitreTacticOptions} series={mitreTacticData} type="bar" height={300} />
      </div>

      {/* Open Incidents by Severity */}
      <div className="p-3 grid-item-pie1">
        <h6>Open Incidents by Severity</h6>
        <Chart options={severityOptions} series={severityData} type="donut" height={300} />
      </div>

      {/* Top 10 Vulnerable Endpoints */}
      <div className="p-3 grid-item-pie2">
        <h6>Top 10 Vulnerable Endpoints</h6>
        <Chart options={endpointOptions} series={endpointData} type="donut" height={300} />
      </div>

      {/* Incident Timeline Chart */}
      <div className="p-3 grid-item-full">
        <h6>Incident Timeline</h6>
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
