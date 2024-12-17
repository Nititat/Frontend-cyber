import React, { useEffect, useState } from "react";
import "./css/Classification.css";
import axios from "axios";
import { setupClassificationAnimation } from "./JS/classification_Fun";

// สีตามประเภทการโจมตี
const attackTypeColors = {
  "Web server 400 error code.": "#FF5733",
  "CMS (WordPress or Joomla) login attempt.": "#33FF57",
  "Botnet Activity Detected and Blocked": "#3357FF",
  "High amount of POST requests in a small period of time (likely bot).": "#FF33A8",
  "Multiple web server 400 error codes from same source ip.": "#A833FF",
  "WAF Alert: Request Blocked.": "#33FFF3",
  "pure-ftpd: Multiple connection attempts from same source.": "#FFC300",
  "pure-ftpd: FTP Authentication success.": "#C70039",
  "Query cache denied (probably config error).": "#900C3F",
  "Simple shell.php command execution.": "#581845",
  "SQL injection attempt.": "#DAF7A6",
  "Vulnerability Scanning": "#FF7F50",
  "Password Guessing": "#87CEEB",
  "Stored Data Manipulation": "#6495ED",
  "Exploit Public-Facing Application": "#FFD700",
  "Process Injection": "#FF4500",
  "Data Destruction": "#2E8B57",
  "File Deletion": "#20B2AA",
  "Valid Accounts": "#7B68EE",
  "SSH": "#6A5ACD",
  "File and Directory Discovery": "#00CED1",
  "Brute Force": "#FF6347",
  "Endpoint Denial of Service": "#4682B4",
  "Network Denial of Service": "#32CD32",
  "JavaScript": "#BA55D3",
  "Sudo and Sudo Caching": "#F08080",
  "Remote Services": "#48D1CC",
  "Exploitation for Privilege Escalation": "#FF1493",
  "Exploitation of Remote Services": "#00FF7F",
  "Exploitation for Client Execution": "#8B0000",
  "Web Shell": "#CD853F",
  Unknown: "#B0C4DE",
};

function Classification() {
  const [mitreCounts, setMitreCounts] = useState([]);

  useEffect(() => {
    const fetchMitreTechniques = async () => {
      try {
        console.log("Fetching MITRE techniques...");
        const response = await axios.get("http://localhost:5000/api/today_mitre_techniques");
        const mitreData = response.data;
        console.log("Fetched MITRE techniques:", mitreData);
        setMitreCounts(mitreData);
      } catch (error) {
        console.error("Error fetching MITRE techniques data:", error);
      }
    };

    fetchMitreTechniques();
    const intervalId = setInterval(fetchMitreTechniques, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupClassificationAnimation();
  }, []);

  return (
    <div>
      <div className="border">
        <p className="Classification">Classification</p>
        <div className="container-item">
          {mitreCounts.map((item, index) => (
            <p key={index} style={{ color: attackTypeColors[item.key] || attackTypeColors["Unknown"] }}>
              <span className="key">{item.key}</span>
              <span className="count">{item.doc_count.toLocaleString()}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classification;
