import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Student from "./login/Home";
import Home from "./components/Home";
import Intern from "./login/Intern";
import Resource from "./login/Resources";
import SAIL from "./login/SAIL";
import "./App.css";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main landing page route */}
        <Route path="/cseatemp/" element={<Home />}/>

        {/* Student page route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/cseatemp/student" element={<Student />} />
        {/* </Route> */}

        {/* Intern page route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/cseatemp/student/intern" element={<Intern />} />
        {/* </Route> */}

        {/* Resource page route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/cseatemp/student/resource" element={<Resource />} />
        {/* </Route> */}

        {/* Resource page route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/cseatemp/student/sail" element={<SAIL />} />
        {/* </Route> */}
        
      </Routes>
    </Router>
  );
};

export default App;
