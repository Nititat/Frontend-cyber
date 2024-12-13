import React, { useEffect, useState } from "react";
import "./css/Data_Attack.css";
import axios from "axios";
import { setupDataAttackerAnimation } from "./JS/data_attackerFun";

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);

  // ฟังก์ชันสำหรับบวกเวลา 7 ชั่วโมง
  const addHours = (timestamp, hours) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    date.setHours(date.getHours() + hours);
    return date.toISOString().replace("T", " ").replace("Z", ""); // ปรับรูปแบบเวลาให้เข้าใจง่ายขึ้น
  };

  useEffect(() => {
    const fetchAttackers = async () => {
      try {
        // ดึงข้อมูลจาก API
        const [latestResponse, mitreResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/latest_alert"),
          axios.get("http://localhost:5000/api/mitre_alert"),
        ]);

        const latestData = latestResponse.data || [];
        const mitreData = mitreResponse.data || [];

        // รวมข้อมูลใหม่เข้ากับข้อมูลเก่า โดยเพิ่มข้อมูลใหม่ที่ด้านบน
        setAttackers((prevAttackers) => {
          const updatedAttackers = [
            ...latestData,
            ...mitreData,
            ...prevAttackers,
          ];

          // เก็บข้อมูลไว้สูงสุด 20 รายการ
          return updatedAttackers.slice(0, 20);
        });
      } catch (error) {
        console.error("Error fetching updated attackers data:", error);
      }
    };

    // ดึงข้อมูลครั้งแรก
    fetchAttackers();

    // ตั้ง Interval เพื่อดึงข้อมูลใหม่ทุก 1 วินาที
    const intervalId = setInterval(fetchAttackers, 1000);

    // ล้าง Interval เมื่อ component ถูก unmount
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
                  {/* Timestamp */}
                  <div className="fa timestamp">
                    {addHours(source["@timestamp"], 7)}
                  </div>
                  {/* Attack Description */}
                  <div className="fa description">
                    {rule.description || "N/A"}
                  </div>
                  {/* GeoLocation: Country */}
                  <div className="fa country_name">
                    {geoLocation.country_name || "N/A"}
                  </div>
                  {/* Agent IP */}
                  <div className="fa agent_ip">{agentIP.srcip || "N/A"}</div>
                  {/* Agent ID */}
                  <div className="fa agent_id">{agent.id || "N/A"}</div>
                  {/* Target Server */}
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