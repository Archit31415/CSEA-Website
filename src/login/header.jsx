import React from "react";
import Particle from "./Particle";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro" style={{ position: "relative" }}>
        <Particle />
        <div className="overlay" style={{ position: "relative", zIndex: 2 }}>
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>

                {props.userName && (
                  <div style={{ marginTop: "15px", marginBottom: "25px" }}>
                    <h3 style={{ color: "#60a5fa", margin: "0 0 10px 0", fontWeight: "700", fontSize: "24px" }}>
                      Welcome, {props.userName}!
                    </h3>
                    <button 
                      type="button"
                      onClick={props.onEditName}
                      className="btn btn-default btn-xs"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#b0a9df",
                        borderRadius: "6px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        outline: "none",
                        fontFamily: "inherit"
                      }}
                    >
                      Edit Name
                    </button>
                  </div>
                )}

                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a href="#about" className="btn btn-custom btn-lg page-scroll">
                  Learn More
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
