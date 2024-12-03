import React, { useEffect, useState } from 'react';
import './css/Data_Attack.css';
// Import attackers.json from src/assets
import attackersData from '../assets/attackers.json'; // Import attackers JSON
import $ from 'jquery'; 
import { setupDataAttackerAnimation } from './JS/data_attackerFun'; 
// Import ฟังก์ชัน jQuery

function Data_Attack() {
  const [attackers, setAttackers] = useState(attackersData); // Initialize state with imported data

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fetch the data again to get updates from attackers.json
      fetch('/src/assets/attackers.json') // Make sure this path is correct, depending on how your build tool handles assets
        .then((response) => response.json())
        .then((data) => {
          // Sort data by ID in descending order (from high to low)
          const sortedData = data.sort((a, b) => b.id - a.id);
          setAttackers(sortedData); // Update state with sorted data
        })
        .catch((error) => console.error('Error fetching updated attackers data:', error));
    }, 1000); // Fetch new data every 1 second

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setupDataAttackerAnimation();
  }, []);

  return (
    <div className='On_container'>
      <p className='DataAttacker_log'>Data_Attacker_Log</p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            <div className='fa ID'>ID</div>
            <div className='fa time'>Time</div>
            <div className='fa attack_type'>Attack type</div>
            <div className='fa attack_country'>Attack country</div>
            <div className='fa target_My_location'>Target Server</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => (
              <div key={index} className="row">
                <div className="fa ID">{attacker.id}</div>
                <div className="fa time">{attacker.time || 'N/A'}</div>
                <div className="fa attack_type">{attacker.type || 'N/A'}</div>
                <div className="fa attack_country">{attacker.country}</div>
                <div className="fa target_My_location">{attacker.target || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data_Attack;
