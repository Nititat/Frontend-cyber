import React, { useEffect, useState } from "react";
import "./css/Classification.css";
import axiosInstance from "../utils/axiosInstance"; // ใช้ axiosInstance แทน axios
import { setupClassificationAnimation } from "./JS/classification_Fun";

function Classification() {
  const [mitreCounts, setMitreCounts] = useState([]);

  useEffect(() => {
    const fetchMitreTechniques = async () => {
      try {
        console.log("Fetching MITRE techniques...");
        
        const API_IP = import.meta.env.VITE_API_IP ;
        const API_PORT = import.meta.env.VITE_API_PORT;
        const API_ENDPOINT = `https://${API_IP}:${API_PORT}/api/today_mitre_techniques`;

        

        const response = await axiosInstance.get(API_ENDPOINT);

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