// import logo from './logo.svg';
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './appStyle.css'
import Home from './components/home/Home'
import Maps from './components/maps/Maps'
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'

const App = () => {


  const [sideB, setSideB] = React.useState(false)

  React.useEffect(() => {
    const side = localStorage.getItem('maps') ?? ""
    if (side) {
      setSideB(true)
    } else {
      setSideB(false)
    }
  }, [sideB])

  return (
    <div className='app'>
      <BrowserRouter>
        {sideB ? <Sidebar /> : null}
        <div className='container'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/maps" element={<Maps />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
