import React, { useState, useEffect, useRef } from "react";
import Zoom from 'react-reveal/Zoom';

export const UpcomingEvent = () => {
  const [event, setEvent] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const handleScroll = () => {
    const element = sectionRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setInView(rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchLatestUpcomingEvent = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        const data = await response.json();
        
        // Filter to find upcoming events
        const upcomingEvents = data.filter(e => e.status === "upcoming");
        
        if (upcomingEvents.length > 0) {
          // Sort chronologically ascending (closest upcoming event first)
          upcomingEvents.sort((a, b) => {
            const dateA = Date.parse(a.date);
            const dateB = Date.parse(b.date);
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateA - dateB;
          });
          setEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error("Error fetching upcoming event:", error);
      }
    };

    fetchLatestUpcomingEvent();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    return `${process.env.PUBLIC_URL}/${url}`;
  };

  // If there's no upcoming event, don't render anything
  if (!event) return null;

  const sectionStyle = {
    padding: "80px 0",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", // Rich dark slate gradient
    color: "#f8fafc",
    position: "relative",
    overflow: "hidden",
  };

  const containerStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const badgeStyle = {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "20px",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  };

  const mainRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "50px",
    flexWrap: "wrap",
    marginTop: "20px",
  };

  const imageColStyle = {
    flex: "1",
    minWidth: "320px",
    position: "relative",
  };

  const imageWrapperStyle = {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: "450px", // Match maximum height to prevent layout shifting
  };

  const imgStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
    transition: "transform 0.5s ease",
  };

  const contentColStyle = {
    flex: "1.2",
    minWidth: "320px",
  };

  const titleStyle = {
    fontSize: "38px",
    fontWeight: "800",
    lineHeight: "1.2",
    marginBottom: "16px",
    background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const metaRowStyle = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    marginBottom: "24px",
  };

  const metaItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
    color: "#94a3b8",
  };

  const categoryPillStyle = {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    backgroundColor: event.category === "academic" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
    color: event.category === "academic" ? "#34d399" : "#fbbf24",
    border: event.category === "academic" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
  };

  const descStyle = {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#94a3b8",
    marginBottom: "36px",
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 36px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    borderRadius: "50px",
    fontWeight: "700",
    fontSize: "16px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s ease",
  };

  const buttonHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: "0 20px 35px -5px rgba(59, 130, 246, 0.5)",
    background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
  };

  return (
    <div id="upcoming-event" ref={sectionRef} style={sectionStyle}>
      <div style={containerStyle}>
        <div style={{ textAlign: "center" }}>
          <span style={badgeStyle}>Featured Upcoming Event</span>
        </div>

        <div style={mainRowStyle}>
          {/* Poster Column */}
          <div style={imageColStyle}>
            <Zoom>
              <div 
                style={imageWrapperStyle}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img 
                  src={getImageUrl(event.url)} 
                  alt={event.event_name} 
                  style={imgStyle}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/600x400/1e293b/ffffff?text=${encodeURIComponent(event.event_name)}`;
                  }}
                />
              </div>
            </Zoom>
          </div>

          {/* Details Column */}
          <div style={contentColStyle}>
            <div>
              <h2 style={titleStyle}>{event.event_name}</h2>
              
              <div style={metaRowStyle}>
                <div style={metaItemStyle}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{event.date || "Coming Soon"}</span>
                </div>
                <span style={categoryPillStyle}>{event.category}</span>
              </div>

              <p style={descStyle}>
                Join us for our upcoming event! Be sure to register below to reserve your slot. We look forward to seeing you there.
              </p>

              {event.registrationLink ? (
                <a 
                  href={event.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.target.style, buttonHoverStyle);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.target.style, buttonStyle);
                  }}
                >
                  Register Now
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span style={{ fontSize: "16px", color: "#64748b", fontWeight: "600" }}>
                  Registration link will be available soon.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
