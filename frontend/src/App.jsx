import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mainpage from "./components/userside/mainpage";
import Admin_crud from "./components/adminside/admin_crud";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/admin_crud" element={<Admin_crud/>}/>
      </Routes>
    </Router>
  );
};

export default App;
