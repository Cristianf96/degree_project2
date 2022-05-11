import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './appStyle.css'
import Maps from './content/maps/Maps'

const App = () => {

  return (
    <div className='app'>
      <BrowserRouter>
        <div className='container'>
          <Routes>
            <Route path="/" element={<Maps />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
