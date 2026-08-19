import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Student from "./login/Home";
import Home from "./components/Home";
import EventsPage from "./components/EventsPage";
import GalleryPage from "./components/GalleryPage";
import TeamPage from "./components/TeamPage";
import GamesPage from "./components/GamesPage";
import LoginPage from "./components/LoginPage";
import LeaderboardPage from "./login/LeaderboardPage";
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

        {/* Public sub-pages */}
        <Route path="/cseatemp/events" element={<EventsPage />} />
        <Route path="/cseatemp/gallery" element={<GalleryPage />} />
        <Route path="/cseatemp/team" element={<TeamPage />} />
        <Route path="/cseatemp/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cseatemp/games" element={<GamesPage />} />
          <Route path="/cseatemp/student" element={<Student />} />
          <Route path="/cseatemp/student/intern" element={<Intern />} />
          <Route path="/cseatemp/student/resource" element={<Resource />} />
          <Route path="/cseatemp/student/sail" element={<SAIL />} />
          <Route path="/cseatemp/student/games" element={<GamesPage />} />
          <Route path="/cseatemp/student/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
