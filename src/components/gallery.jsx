import { Image } from "./image";
import React, { useEffect, useRef, useState } from "react";
import Zoom from 'react-reveal/Zoom';

export const Gallery = (props) => {
  const [inView, setInView] = useState(false);
  const [data, setData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const galleryRef = useRef(null);

  const handleScroll = () => {
    const element = galleryRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setInView(rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (props.data && props.data.length > 0) {
        setData(props.data);
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/events');
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [props.data]);

  // Filter events based on selection
  let filteredEvents = data?.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'past') return event.status === 'past';
    if (selectedFilter === 'upcoming') return event.status === 'upcoming';
    return event.category === selectedFilter;
  });

  // Sort events from latest to oldest
  if (filteredEvents) {
    filteredEvents = [...filteredEvents].sort((a, b) => {
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);
      
      const isAValid = !isNaN(dateA);
      const isBValid = !isNaN(dateB);
      
      if (!isAValid && !isBValid) return 0;
      if (!isAValid) return 1;
      if (!isBValid) return -1;
      
      return dateB - dateA;
    });
  }

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    return `${process.env.PUBLIC_URL}/${url}`;
  };

  const containerStyle = {
    padding: "100px 0",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  };

  const sectionTitleStyle = {
    textAlign: "center",
    marginBottom: "60px",
  };

  const titleStyle = {
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto 40px auto",
    lineHeight: "1.6",
  };

  const filterContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "50px",
    flexWrap: "wrap",
  };

  const filterButtonStyle = {
    padding: "12px 24px",
    borderRadius: "50px",
    border: "2px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#64748b",
    fontWeight: "500",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const filterButtonActiveStyle = {
    ...filterButtonStyle,
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderColor: "#3b82f6",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f1f5f9",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    height: "400px",
  };

  const cardHoverStyle = {
    transform: "translateY(-12px)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    borderColor: "#e2e8f0",
  };

  const imageContainerStyle = {
    position: "relative",
    height: "250px",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
    opacity: "0",
    transition: "opacity 0.3s ease",
    display: "flex",
    alignItems: "end",
    padding: "20px",
  };

  const contentStyle = {
    padding: "24px",
    height: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const titleCardStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "12px",
    lineHeight: "1.3",
  };

  const dateStyle = {
    fontSize: "14px",
    color: "#3b82f6",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const viewMoreButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 32px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
  };

  const viewMoreHoverStyle = {
    backgroundColor: "#2563eb",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(59, 130, 246, 0.4)",
  };

  const loadingStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    gap: "20px",
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f4f6",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const loadingTextStyle = {
    fontSize: "18px",
    color: "#64748b",
    fontWeight: "500",
  };

  const buttonContainerStyle = {
    textAlign: "center",
    marginTop: "60px",
    marginBottom: "40px",
  };

  return (
    <div id="portfolio" style={containerStyle}>
      <div className="container">
        <div style={sectionTitleStyle}>
          <h2 className="gallery-section-title" style={titleStyle}>
            <Zoom cascade when={inView}>
              Events Gallery
            </Zoom>
          </h2>
          <p style={subtitleStyle}>
            Discover our amazing upcoming events and relive the memories of past celebrations
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={filterContainerStyle}>
          {['all', 'upcoming', 'past', 'academic', 'social'].map((filter) => (
            <button
              key={filter}
              style={selectedFilter === filter ? filterButtonActiveStyle : filterButtonStyle}
              onClick={() => setSelectedFilter(filter)}
              onMouseEnter={(e) => {
                if (selectedFilter !== filter) {
                  e.target.style.backgroundColor = "#f1f5f9";
                  e.target.style.color = "#3b82f6";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFilter !== filter) {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.color = "#64748b";
                }
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* View More Button */}
        <div style={buttonContainerStyle}>
          <a 
            href="#about" 
            style={viewMoreButtonStyle}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, viewMoreHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, viewMoreButtonStyle);
            }}
          >
            View All Events
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </a>
        </div>

        {/* Gallery Grid */}
        <div ref={galleryRef}>
          {isLoading ? (
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              <p style={loadingTextStyle}>Loading amazing events...</p>
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div style={gridStyle}>
              {filteredEvents.map((d, i) => (
                <div
                  key={`${d.event_name}-${i}`}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyle);
                    const img = e.currentTarget.querySelector('.event-image');
                    const overlay = e.currentTarget.querySelector('.image-overlay');
                    if (img) img.style.transform = "scale(1.1)";
                    if (overlay) overlay.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, cardStyle);
                    const img = e.currentTarget.querySelector('.event-image');
                    const overlay = e.currentTarget.querySelector('.image-overlay');
                    if (img) img.style.transform = "scale(1)";
                    if (overlay) overlay.style.opacity = "0";
                  }}
                >
                  <div style={imageContainerStyle}>
                    <img 
                      src={getImageUrl(d.url || d.Image)} 
                      alt={d.event_name || d.title}
                      className="event-image"
                      style={imageStyle}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x250/3b82f6/ffffff?text=${encodeURIComponent(d.event_name || d.title)}`;
                      }}
                    />
                    <div className="image-overlay" style={overlayStyle}>
                      <div style={{ color: 'white', fontWeight: '600' }}>
                        View Details
                      </div>
                    </div>
                  </div>
                  
                  <div style={contentStyle}>
                    <div>
                      <h3 style={titleCardStyle}>{d.event_name || d.title}</h3>
                      <p style={dateStyle}>
                        {d.date || 'Coming Soon'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={loadingStyle}>
              <p style={loadingTextStyle}>No events found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};