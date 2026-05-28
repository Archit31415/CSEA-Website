import React, { useState, useEffect, useRef } from "react";
import stuff from "../data/data.json";

const images = stuff.Testimonials || [];

export const Testimonials = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const galleryRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = galleryRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const containerStyle = {
    padding: "100px 0",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  };

  const backgroundPatternStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundImage: `
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  };

  const sectionTitleStyle = {
    textAlign: "center",
    marginBottom: "80px",
    position: "relative",
    zIndex: 2,
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "16px",
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s ease",
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#94a3b8",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s ease 0.2s",
  };

  const galleryContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 2,
  };

  const mainImageContainerStyle = {
    position: "relative",
    width: "100%",
    height: "600px",
    borderRadius: "24px",
    overflow: "hidden",
    marginBottom: "40px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
    transform: isVisible ? "scale(1)" : "scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all 1s ease 0.4s",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  };

  const overlayStyle = {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
    padding: "40px",
    color: "#ffffff",
  };

  const imageInfoStyle = {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "8px",
  };

  const imageDescriptionStyle = {
    fontSize: "14px",
    color: "#e2e8f0",
    opacity: "0.9",
  };

  const controlsStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
  };

  const navButtonStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  const navButtonHoverStyle = {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    transform: "scale(1.1)",
  };

  const playButtonStyle = {
    ...navButtonStyle,
    width: "60px",
    height: "60px",
  };

  const thumbnailContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "20px",
  };

  const thumbnailStyle = {
    width: "80px",
    height: "60px",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    border: "3px solid transparent",
    transition: "all 0.3s ease",
    opacity: "0.7",
  };

  const activeThumbnailStyle = {
    ...thumbnailStyle,
    border: "3px solid #3b82f6",
    opacity: "1",
    transform: "scale(1.05)",
  };

  const thumbnailImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const indicatorDotsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "30px",
  };

  const dotStyle = {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const activeDotStyle = {
    ...dotStyle,
    backgroundColor: "#3b82f6",
    transform: "scale(1.2)",
  };

  const progressBarStyle = {
    width: "100%",
    height: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    overflow: "hidden",
    marginTop: "20px",
  };

  const progressFillStyle = {
    height: "100%",
    backgroundColor: "#3b82f6",
    width: `${((currentIndex + 1) / images.length) * 100}%`,
    transition: "width 0.3s ease",
    borderRadius: "2px",
  };

  if (!images || images.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={backgroundPatternStyle}></div>
        <div style={sectionTitleStyle}>
          <h2 style={titleStyle}>Gallery</h2>
          <p style={subtitleStyle}>No images available at the moment.</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    return `${process.env.PUBLIC_URL}/${url}`;
  };

  const currentImage = images[currentIndex];

  return (
    <div id="testimonials" style={containerStyle}>
      <div style={backgroundPatternStyle}></div>
      
      <div className="container">
        <div style={sectionTitleStyle} ref={galleryRef}>
          <h2 style={titleStyle}>Gallery</h2>
          <p style={subtitleStyle}>
            Explore our collection of memorable moments and events
          </p>
        </div>

        <div style={galleryContainerStyle}>
          {/* Main Image Display */}
          <div style={mainImageContainerStyle}>
            <img
              src={getImageUrl(currentImage.original || currentImage.url)}
              alt={currentImage.description || `Gallery image ${currentIndex + 1}`}
              style={imageStyle}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/1200x600/3b82f6/ffffff?text=Gallery+Image+${currentIndex + 1}`;
              }}
            />
            {(currentImage.description || currentImage.title) && (
              <div style={overlayStyle}>
                {currentImage.title && (
                  <div style={imageInfoStyle}>{currentImage.title}</div>
                )}
                {currentImage.description && (
                  <div style={imageDescriptionStyle}>{currentImage.description}</div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div style={controlsStyle}>
            <button
              style={navButtonStyle}
              onClick={goToPrevious}
              onMouseEnter={(e) => Object.assign(e.target.style, navButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, navButtonStyle)}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            <button
              style={playButtonStyle}
              onClick={togglePlayPause}
              onMouseEnter={(e) => Object.assign(e.target.style, navButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, playButtonStyle)}
            >
              {isPlaying ? (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button
              style={navButtonStyle}
              onClick={goToNext}
              onMouseEnter={(e) => Object.assign(e.target.style, navButtonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, navButtonStyle)}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div style={progressBarStyle}>
            <div style={progressFillStyle}></div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div style={thumbnailContainerStyle}>
              {images.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  style={index === currentIndex ? activeThumbnailStyle : thumbnailStyle}
                  onClick={() => goToSlide(index)}
                  onMouseEnter={(e) => {
                    if (index !== currentIndex) {
                      e.target.style.opacity = "1";
                      e.target.style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentIndex) {
                      e.target.style.opacity = "0.7";
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  <img
                    src={getImageUrl(image.thumbnail || image.original || image.url)}
                    alt={`Thumbnail ${index + 1}`}
                    style={thumbnailImageStyle}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/80x60/64748b/ffffff?text=${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Indicator Dots */}
          <div style={indicatorDotsStyle}>
            {images.map((_, index) => (
              <div
                key={index}
                style={index === currentIndex ? activeDotStyle : dotStyle}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
