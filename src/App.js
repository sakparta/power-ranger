import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClanWarlog from "./components/ClanWarlog";  // Import the ClanWarlog component
import CurrentWar from "./components/CurrentWar";  // Import the CurrentWar component
import Navbar from "./components/Navbar";  // Import the Navbar component
import ClanInfo from "./components/ClanInfo";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar component */}
        <Routes>
          <Route 
            path="/" 
            element={<ClanInfo />} 
          />
          <Route path="/previous-wars" element={<ClanWarlog />} />
          <Route path="/current-war" element={<CurrentWar />} />
        </Routes>
   
    </Router>
  );
}

export default App;