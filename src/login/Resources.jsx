import React, { useState, useEffect, useRef } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";
import JsonData from "../data login/data.json";
import SmoothScroll from "smooth-scroll";
import "../App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Resource = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [inView, setInView] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const handleScroll = () => {
    const element = galleryRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setInView(rect.top <= window.innerHeight * 0.8 && rect.bottom >= window.innerHeight * 0.7);
    }
  };

  // Semester data (8 semesters)
  const semesters = [
    { number: 1, label: "Semester 1", driveLink: "https://drive.google.com/drive/folders/semester1" },
    { number: 2, label: "Semester 2", driveLink: "https://drive.google.com/drive/folders/semester2" },
    { number: 3, label: "Semester 3", driveLink: "https://drive.google.com/drive/folders/semester3" },
    { number: 4, label: "Semester 4", driveLink: "https://drive.google.com/drive/folders/semester4" },
    { number: 5, label: "Semester 5", driveLink: "https://drive.google.com/drive/folders/semester5" },
    { number: 6, label: "Semester 6", driveLink: "https://drive.google.com/drive/folders/semester6" },
    { number: 7, label: "Semester 7", driveLink: "https://drive.google.com/drive/folders/semester7" },
    { number: 8, label: "Semester 8", driveLink: "https://drive.google.com/drive/folders/semester8" },
  ];

  const handleSemesterClick = (semester) => {
    if (semester.driveLink) {
      window.open(semester.driveLink, "_blank");
    }
  };

  const semesterBlockStyle = {
    width: "100%",
    maxWidth: "200px",
    height: "200px",
    backgroundColor: "#ffffff",
    border: "3px solid #e2e8f0",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const semesterBlockHoverStyle = {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(59, 130, 246, 0.3)",
    borderColor: "#3b82f6",
    backgroundColor: "#f8fafc",
  };

  const semesterBlockActiveStyle = {
    transform: "translateY(4px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    borderColor: "#3b82f6",
    backgroundColor: "#f8fafc",
  };

  const semesterNumberStyle = {
    fontSize: "48px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "12px",
    transition: "color 0.3s ease",
  };

  const semesterLabelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const containerStyle = {
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "60px",
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    justifyItems: "center",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px",
  };

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.ResourceHeader} />
      
      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Semester Resources</h2>
          <p style={subtitleStyle}>
            Click on any semester to access detailed academic resources !!
          </p>
        </div>

        <div ref={galleryRef}>
          <div style={gridStyle}>
            {semesters.map((semester) => (
              <div
                key={semester.number}
                style={semesterBlockStyle}
                onClick={() => handleSemesterClick(semester)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, semesterBlockHoverStyle);
                  e.currentTarget.querySelector(".semester-number").style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, semesterBlockStyle);
                  e.currentTarget.querySelector(".semester-number").style.color = "#1e293b";
                }}
                onMouseDown={(e) => {
                  Object.assign(e.currentTarget.style, semesterBlockActiveStyle);
                }}
                onMouseUp={(e) => {
                  Object.assign(e.currentTarget.style, semesterBlockHoverStyle);
                }}
              >
                {/* Background decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-50%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                    borderRadius: "50%",
                    opacity: "0",
                    transition: "opacity 0.3s ease",
                  }}
                ></div>

                <div className="semester-number" style={semesterNumberStyle}>
                  {semester.number}
                </div>
                <div style={semesterLabelStyle}>{semester.label}</div>
                <div style={semesterLabelStyle}>Click to View</div>

                {/* Small arrow icon */}
                <div
                  style={{
                    marginTop: "8px",
                    opacity: "0.6",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resource;