import React from 'react'
import { useNavigate } from "react-router-dom";

import './sidebarStyle.css'

// import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const Sidebar = () => {

  let navigate = useNavigate();

  return (
    <div className='sideBar'>
      <div className="top">
        <span className="logo">Distrito Recicla</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li>
            <HomeIcon className='icon' fontSize="large" />
            <span style={{ width: '100%' }} onClick={() => navigate('/')}>Home</span>
          </li>
          <li>
            <MapIcon className='icon' fontSize="large" />
            <span style={{ width: '100%' }} onClick={() => navigate('/maps')}>Maps</span>
          </li>
          <li>
            <TipsAndUpdatesIcon className='icon' fontSize="large" />
            <span style={{ width: '100%' }} onClick={() => navigate('/tips')}>Tips</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  )
}

export default Sidebar