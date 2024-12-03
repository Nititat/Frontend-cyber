import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import $ from 'jquery'; 
// import { setupAppsAnimation } from './JS/data_attackerFun'; 

// นำเข้า Navbar และ Map จากโฟลเดอร์ components
import Navbar from './components/Navbar'
import Analytic from './components/Analytic'
import Map from './components/Map'
import Classification from './components/Classification'
import Country_Attack from './components/Country_Attack'
import Data_Attack from './components/Data_Attack'
import "./components/JS/data_attackerFun.js"


function App() {
  const [count, setCount] = useState(0)



  
  return (
    <Router>  {/* ใช้ Router เพื่อจัดการการนำทาง */}
      <div className="App">
        <Navbar />
        <Routes>
          {/* เส้นทางสำหรับหน้าแรก */}
          <Route path="/" element={<div className='main_page'>
            <div className="container">
            <div className="Map">
                <Map />
              </div>
              <div className="container_bottom">
                  <div className="bottom_left">
                    <Classification />
                  </div>
                  <div className="bottom_right">
                    <Data_Attack />
                  </div>
              </div>
              <div className="rightsize">
                <Country_Attack />
              </div>
            </div>
          </div>} />
          {/* ตั้งเส้นทางที่ตรงกับ /map ไปยังหน้า Map */}
          <Route path="/Analytic" element={<Analytic />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App