import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { Team } from "./Team";
import JsonData from "../data/data.json";
import "../App.css";

const TeamPage = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navigation />
      <Team data={landingPageData.Team} />
    </div>
  );
};

export default TeamPage;
//
