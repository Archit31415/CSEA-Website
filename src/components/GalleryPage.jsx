import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { Testimonials } from "./testimonials";
import JsonData from "../data/data.json";
import "../App.css";

const GalleryPage = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navigation />
      <Testimonials data={landingPageData.Testimonials} />
    </div>
  );
};

export default GalleryPage;
