import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";

export const About = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutElement = aboutRef.current;
      const imageElement = imageRef.current;
      
      if (aboutElement) {
        const rect = aboutElement.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom >= 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial render
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerStyle = {
    padding: "100px 0",
    backgroundColor: "#ffffff",
    position: "relative",
    overflow: "hidden",
  };

  const backgroundDecorStyle = {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "120%",
    height: "120%",
    background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.02) 0%, transparent 70%)",
    pointerEvents: "none",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    gap: "60px",
    flexWrap: "wrap",
  };

  const imageColumnStyle = {
    flex: "1",
    minWidth: "300px",
    position: "relative",
  };

  const imageContainerStyle = {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    transform: isVisible ? "translateX(0) scale(1)" : "translateX(-50px) scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    display: "block",
    transition: "transform 0.5s ease",
  };

  const imageOverlayStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
    opacity: "0",
    transition: "opacity 0.3s ease",
  };

  const textColumnStyle = {
    flex: "1",
    minWidth: "300px",
  };

  const aboutTextStyle = {
    transform: isVisible ? "translateX(0)" : "translateX(50px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    position: "relative",
    paddingBottom: "16px",
  };

  const titleUnderlineStyle = {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: isVisible ? "60px" : "0",
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    borderRadius: "2px",
    transition: "width 0.8s ease 0.5s",
  };

  const paragraphStyle = {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#475569",
    marginBottom: "32px",
    fontWeight: "400",
  };

  const highlightTextStyle = {
    fontSize: "20px",
    lineHeight: "1.7",
    color: "#1e293b",
    fontWeight: "500",
    padding: "24px",
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    borderLeft: "4px solid #3b82f6",
    position: "relative",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  };

  const statsContainerStyle = {
    display: "flex",
    gap: "32px",
    marginTop: "40px",
    flexWrap: "wrap",
  };

  const statItemStyle = {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    flex: "1",
    minWidth: "120px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const statNumberStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#3b82f6",
    display: "block",
    marginBottom: "8px",
  };

  const statLabelStyle = {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div id="about" style={containerStyle}>
      {/* Background decoration */}
      <div style={backgroundDecorStyle}></div>
      
      <div className="container">
        <div style={rowStyle}>
          {/* Image Column */}
          <div style={imageColumnStyle}>
            <div 
              ref={imageRef}
              style={imageContainerStyle}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.image-overlay');
                if (img) img.style.transform = "scale(1.05)";
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                const overlay = e.currentTarget.querySelector('.image-overlay');
                if (img) img.style.transform = "scale(1)";
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              <img 
                src={`${process.env.PUBLIC_URL}/img/about.png`} 
                style={imageStyle}
                alt="About us - CSE Department team" 
              />
              <div className="image-overlay" style={imageOverlayStyle}></div>
            </div>
          </div>

          {/* Text Column */}
          <div style={textColumnStyle}>
            <div ref={aboutRef} style={aboutTextStyle}>
              <h2 style={titleStyle}>
                About Us
                <div style={titleUnderlineStyle}></div>
              </h2>
              
              <p style={paragraphStyle}>
                {props.data ? props.data.paragraph : "Loading our story..."}
              </p>
              
              <div style={highlightTextStyle}>
                We're the team behind the fun and learning in the CSE department, organizing everything from Fresher's and Farewell parties to academic talks. We also organize a myriad of fun events and intra-branch sports tournaments.
              </div>

              {/* Stats Section */}
              <div style={statsContainerStyle}>
                <div 
                  style={statItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={statNumberStyle}>50+</span>
                  <span style={statLabelStyle}>Events</span>
                </div>
                
                <div 
                  style={statItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={statNumberStyle}>500+</span>
                  <span style={statLabelStyle}>Students</span>
                </div>
                
                <div 
                  style={statItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={statNumberStyle}>5+</span>
                  <span style={statLabelStyle}>Years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};