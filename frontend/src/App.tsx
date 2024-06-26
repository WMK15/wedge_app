import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <div className="main">
        <div className="bg">
          <div className="star-field">
            <div className="layer"></div>
            <div className="layer"></div>
            <div className="layer"></div>
          </div>
        </div>
        <Outlet />
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default App;
