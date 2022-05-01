import React from 'react'
import { useNavigate } from "react-router-dom";

import './navbarStyle.css'

import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import MapIcon from '@mui/icons-material/Map';

const Navbar = () => {

  let navigate = useNavigate();

  return (
    <div className='navBar'>
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder='Search...' />
          <SearchIcon sx={{ fontSize: 30 }} />
        </div>
        <div className="items">
          <div className="item">
            <Button onClick={() => navigate('/maps')} startIcon={<MapIcon sx={{ fontSize: 30, background: 'transparent' }} />} color="inherit" variant="contained">
              Maps
            </Button>
          </div>
          <div className="item">
            <LanguageIcon sx={{ fontSize: 30 }} />
            English
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar