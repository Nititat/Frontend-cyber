import React, { useEffect, useState } from "react";
import "./css/Classification.css";
import axios from "axios"; // ใช้ Axios สำหรับการดึงข้อมูล
import { setupClassificationAnimation } from "./JS/classification_Fun";

function Classification() {
  const [mitreCounts, setMitreCounts] = useState([]);

  useEffect(() => {
    const fetchMitreTechniques = async () => {
      try {
        console.log("Fetching MITRE techniques...");
        
        const API_IP = import.meta.env.VITE_API_IP || "127.0.0.1";
        const API_PORT = import.meta.env.VITE_API_PORT || "5000";
        const API_ENDPOINT = `http://${API_IP}:${API_PORT}/api/today_mitre_techniques`;

        

        const response = await axios.get(API_ENDPOINT);

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
            <p key={index}>
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