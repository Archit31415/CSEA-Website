import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { Gallery } from "./gallery";
import JsonData from "../data/data.json";
import "../App.css";

const EventsPage = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navigation />
      <Gallery data={landingPageData.Gallery} />
    </div>
  );
};

export default EventsPage;
