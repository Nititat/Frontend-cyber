import React, { useEffect, useState } from 'react';
import './css/Classification.css';
import axios from 'axios'; // ใช้ Axios สำหรับการดึงข้อมูล
import { setupClassificationAnimation } from './JS/classification_Fun';

function Classification() {
  const [attackCounts, setAttackCounts] = useState([]); // เก็บข้อมูลประเภทและจำนวนการโจมตี

  useEffect(() => {
    const fetchAttackers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alerts'); // ดึงข้อมูลจาก API
        const data = response.data;

        // คำนวณจำนวนการโจมตีแต่ละประเภท
        const counts = data.reduce((acc, attacker) => {
          const description = attacker._source?.rule?.description || "Unknown"; // ดึงข้อมูล description
          if (acc[description]) {
            acc[description] += 1; // เพิ่มจำนวนในประเภทที่มีอยู่แล้ว
          } else {
            acc[description] = 1; // สร้างประเภทใหม่ใน accumulator
          }
          return acc;
        }, {});

        // แปลง Object เป็น Array และเรียงลำดับจากมากไปน้อย
        const sortedCounts = Object.entries(counts)
          .map(([description, count]) => ({ description, count }))
          .sort((a, b) => b.count - a.count); // เรียงจากมากไปน้อย

        setAttackCounts(sortedCounts); // อัปเดต state
      } catch (error) {
        console.error('Error fetching attackers data:', error);
      }
    };

    fetchAttackers(); // เรียก API ครั้งแรก

    // ตั้ง Interval เพื่อดึงข้อมูลทุก 1 วินาที
    const intervalId = setInterval(fetchAttackers, 1000);

    // ล้าง Interval เมื่อ component ถูก unmount
    return () => clearInterval(intervalId);
  }, []);

  // เรียกฟังก์ชัน Animation จาก classification.js
  useEffect(() => {
    setupClassificationAnimation();
  }, []);

  return (
    <div>
      <div className="border">
        <p className="Classification">Classification</p>
        <div className="container-item">
          {attackCounts.map((attack, index) => (
            <p key={index}>
              {attack.description}: {attack.count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classification;
