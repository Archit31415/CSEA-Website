import React from "react";

export const Image = ({ title, Image: imgSrc }) => {
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    return `${process.env.PUBLIC_URL}/${url}`;
  };

  return (
    <div className="portfolio-item">
      <div className="hover-bg">
        {" "}
        
          <div className="hover-text">
            <h4>{title}</h4>
          </div>
          <img src={getImageUrl(imgSrc)} className="img-responsive" alt={title} />{" "}
        {" "}
      </div>
    </div>
  );
};
