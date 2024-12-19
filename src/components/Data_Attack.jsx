import React, { useEffect, useState } from "react";
import "./css/Data_attack.css";

import axios from "axios";
import { setupDataAttackerAnimation } from "./JS/data_attackerFun";

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
  Unknown: "#B0C4DE", // Light Steel Blue
};

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);

  const addHours = (timestamp, hours) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    date.setHours(date.getHours() + hours);
    return date.toISOString().replace("T", " ").replace("Z", "");
  };

  useEffect(() => {
    const fetchAttackers = async () => {
      try {
        const [latestResponse, mitreResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/latest_alert"),
          axios.get("http://localhost:5000/api/mitre_alert"),
        ]);

        const latestData = latestResponse.data || [];
        const mitreData = mitreResponse.data || [];

        setAttackers((prevAttackers) => {
          const updatedAttackers = [
            ...latestData,
            ...mitreData,
            ...prevAttackers,
          ];
          return updatedAttackers.slice(0, 20);
        });
      } catch (error) {
        console.error("Error fetching updated attackers data:", error);
      }
    };

    fetchAttackers();
    const intervalId = setInterval(fetchAttackers, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupDataAttackerAnimation();
  }, []);

  return (
    <div className="On_container">
      <p className="DataAttacker_log">DATA_ATTACKER_LOG</p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            <div className="fa timestamp">Timestamp</div>
            <div className="fa description">Attack Type</div>
            <div className="fa country_name">Attack Country</div>
            <div className="fa agent_ip">Attacker IP</div>
            <div className="fa agent_id">Agent ID</div>
            <div className="fa target_server">Target Server</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => {
              const source = attacker._source || {};
              const geoLocation = source.GeoLocation || {};
              const agent = source.agent || {};
              const agentIP = source.data || {};
              const rule = source.rule || {};

              return (
                <div key={index} className="row">
                  <div className="fa timestamp">
                    {addHours(source["@timestamp"], 7)}
                  </div>
                  <div
                    className="fa description"
                    style={{
                      color: attackTypeColors[rule.description] || "#B0C4DE",
                      fontWeight: "bold",
                    }}
                  >
                    {rule.description || "N/A"}
                  </div>
                  <div className="fa country_name">
                    {geoLocation.country_name || "N/A"}
                  </div>
                  <div className="fa agent_ip">{agentIP.srcip || "N/A"}</div>
                  <div className="fa agent_id">{agent.id || "N/A"}</div>
                  <div className="fa target_server">{agent.name || "N/A"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data_Attack;
