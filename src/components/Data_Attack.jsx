import React, { useEffect, useState } from "react";
import "./css/Data_attack.css";
import axiosInstance from "../utils/axiosInstance"; // ใช้ axiosInstance แทน axios
import { setupDataAttackerAnimation } from "./JS/data_attackerFun";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;
const ATTACK_COLOR_URL = `https://${API_IP}:${API_PORT}/api/attack_colors`;

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);
  const [attackTypeColors, setAttackTypeColors] = useState({});

  const addHours = (timestamp, hours) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    date.setHours(date.getHours() + hours);
    return date.toISOString().replace("T", " ").replace("Z", "");
  };

  const getAttackColorFromDB = async (attackType) => {
    try {
      const response = await axiosInstance.get(`${ATTACK_COLOR_URL}/${encodeURIComponent(attackType)}`);
      return response.data.color;
    } catch (error) {
      console.error("Error fetching attack color:", error);
      return "#81BFDA"; // สีสำรองกรณี API ใช้งานไม่ได้
    }
  };

  useEffect(() => {
    const fetchAttackers = async () => {
      try {
        const LATEST_ALERT_URL = `https://${API_IP}:${API_PORT}/api/latest_alert`;
        const MITRE_ALERT_URL = `https://${API_IP}:${API_PORT}/api/mitre_alert`;

        console.log("Fetching data from:", LATEST_ALERT_URL, MITRE_ALERT_URL);

        const [latestResponse, mitreResponse] = await Promise.all([
          axiosInstance.get(LATEST_ALERT_URL),
          axiosInstance.get(MITRE_ALERT_URL),
        ]);

        const latestData = latestResponse.data || [];
        const mitreData = mitreResponse.data || [];

        const newAttackers = [...latestData, ...mitreData];

        // ดึงสีของประเภทการโจมตีจากฐานข้อมูล
        const uniqueAttackTypes = [...new Set(newAttackers.map(a => a._source?.rule?.description || "Unknown"))];

        uniqueAttackTypes.forEach(async (attackType) => {
          if (!attackTypeColors[attackType]) {
            const color = await getAttackColorFromDB(attackType);
            setAttackTypeColors((prevColors) => ({
              ...prevColors,
              [attackType]: color,
            }));
          }
        });

        setAttackers((prevAttackers) => [...newAttackers, ...prevAttackers].slice(0, 20));
      } catch (error) {
        console.error("Error fetching updated attackers data:", error);
      }
    };

    fetchAttackers();
    const intervalId = setInterval(fetchAttackers, 1000);
    return () => clearInterval(intervalId);
  }, [attackTypeColors]);

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
              const attackColor = attackTypeColors[rule.description] || "#81BFDA";

              return (
                <div key={index} className="row">
                  <div className="fa timestamp">
                    {addHours(source["@timestamp"], 7)}
                  </div>
                  <div
                    className="fa description"
                    style={{ color: attackColor, fontWeight: "bold" }}
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
