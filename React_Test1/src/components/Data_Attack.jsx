import React, { useEffect, useState } from "react";
import "./css/Data_Attack.css";
import axios from "axios";
import { setupDataAttackerAnimation } from "./JS/data_attackerFun";

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);

  useEffect(() => {
    const fetchAttackers = async () => {
      try {
        // เรียก API ด้วย Axios
        const response = await axios.get("http://localhost:5000/api/alerts");
        console.log(response.data); // Debug ข้อมูลที่ได้รับจาก API
        setAttackers(response.data); // ตั้งค่าข้อมูล attackers จาก response
      } catch (error) {
        console.error("Error fetching updated attackers data:", error);
      }
    };

    // ดึงข้อมูลครั้งแรก
    fetchAttackers();

    // ตั้ง Interval เพื่อดึงข้อมูลทุก 1 วินาที
    const intervalId = setInterval(fetchAttackers, 1000);

    // ล้าง Interval เมื่อ component ถูก unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupDataAttackerAnimation();
  }, []);

  return (
    <div className="On_container">
      <p className="DataAttacker_log">Data_Attacker_Log</p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            <div className="fa timestamp">Timestamp</div>
            <div className="fa description">Attack Type</div>
            <div className="fa country_name">Attack Country</div>
            <div className="fa agent_id">Agent ID</div>
            <div className="fa agent_ip">Agent IP</div>
            <div className="fa target_server">Target Server</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => {
              // ตรวจสอบการมีอยู่ของข้อมูลในแต่ละฟิลด์
              const source = attacker._source || {};
              const geoLocation = source.GeoLocation || {};
              const agent = source.agent || {};
              const rule = source.rule || {};

              return (
                <div key={index} className="row">
                  {/* Timestamp */}
                  <div className="fa timestamp">
                    {source["@timestamp"] || "N/A"}
                  </div>

                  {/* Attack Description */}
                  <div className="fa description">
                    {rule.description || "N/A"}
                  </div>

                  {/* GeoLocation: Country */}
                  <div className="fa country_name">
                    {geoLocation.country_name || "N/A"}
                  </div>

                  {/* Agent ID */}
                  <div className="fa agent_id">{agent.id || "N/A"}</div>

                  {/* Agent IP */}
                  <div className="fa agent_ip">{agent.ip || "N/A"}</div>

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
