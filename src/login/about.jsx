import React, { useEffect } from "react";

export const About = (props) => {
  useEffect(() => {
    const aboutText = document.querySelector(".about-text");

    const handleScroll = () => {
      const rect = aboutText.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        aboutText.classList.add("show");
      } else {
        aboutText.classList.remove("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial render

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <img src={`${process.env.PUBLIC_URL}/img/about.png`} className="img-responsive" alt="" />
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>About</h2>
              {/* <p>{props.data ? props.data.paragraph : "loading..."}</p> */}
              <h3> This is the resource hub for all CSE students. </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
