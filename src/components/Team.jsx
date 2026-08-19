import Zoom from 'react-reveal/Zoom';
import React, { useEffect, useRef, useState } from "react";

export const Team = (props) => {
  const [inView, setInView] = useState(false);
  const [data, setData] = useState(null);
  const galleryRef = useRef(null);

  const handleScroll = () => {
    const element = galleryRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setInView(rect.top <= window.innerHeight * 0.8 && rect.bottom >= window.innerHeight * 0.7);
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
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/teams');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [props.data]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    return `${process.env.PUBLIC_URL}/${url}`;
  };

  const containerStyle = {
    padding: "80px 20px",
    backgroundColor: "#ffffff",
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
    margin: "0 auto",
    lineHeight: "1.6",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f1f5f9",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardHoverStyle = {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
    borderColor: "#e2e8f0",
  };

  const imageContainerStyle = {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    overflow: "hidden",
    marginBottom: "24px",
    position: "relative",
    border: "4px solid #f8fafc",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  };

  const nameStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
    textAlign: "center",
  };

  const positionStyle = {
    fontSize: "16px",
    fontWeight: "500",
    color: "#3b82f6",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const backgroundDecorStyle = {
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "200%",
    height: "200%",
    background: "linear-gradient(45deg, rgba(59, 130, 246, 0.03), rgba(147, 51, 234, 0.03))",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    opacity: "0",
  };

  const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    fontSize: "18px",
    color: "#64748b",
  };

  const loadingSpinnerStyle = {
    width: "40px",
    height: "40px",
    border: "3px solid #f3f4f6",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "16px",
  };

  return (
    <div id="team" style={containerStyle}>
      <div className="container">
        <div style={sectionTitleStyle}>
          <h2 className="gallery-section-title" style={titleStyle}>
            <Zoom cascade when={inView}>
              Meet the Team
            </Zoom>
          </h2>
          <p style={subtitleStyle}>
            Get to know the amazing people behind our success
          </p>
        </div>

        <div ref={galleryRef}>
          {data ? (
            <div style={gridStyle}>
              {data.map((d, i) => (
                <div
                  key={`${d.name}-${i}`}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, { ...cardStyle, ...cardHoverStyle });
                    const bgDecor = e.currentTarget.querySelector('.bg-decor');
                    if (bgDecor) bgDecor.style.opacity = "1";
                    const img = e.currentTarget.querySelector('.team-image');
                    if (img) img.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, cardStyle);
                    const bgDecor = e.currentTarget.querySelector('.bg-decor');
                    if (bgDecor) bgDecor.style.opacity = "0";
                    const img = e.currentTarget.querySelector('.team-image');
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  {/* Background decoration */}
                  <div className="bg-decor" style={backgroundDecorStyle}></div>

                  <div style={imageContainerStyle}>
                    <img 
                      src={getImageUrl(d.url || d.img)} 
                      alt={d.name} 
                      className="team-image"
                      style={imageStyle}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150x150/3b82f6/ffffff?text=" + d.name.charAt(0);
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={nameStyle}>{d.name}</h3>
                    <p style={positionStyle}>{d.pos || d.job}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={loadingStyle}>
              <div style={loadingSpinnerStyle}></div>
              Loading amazing team members...
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