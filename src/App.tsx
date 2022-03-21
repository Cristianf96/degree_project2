// import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from './components/home/Home'
import Mapa from './components/mapa/Mapa'

const App = () =>{
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/map" element={<Mapa/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
