import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Login } from "./Login";

export const Navigation = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/cseatemp" || path === "/cseatemp/";
  const isEvents = path === "/cseatemp/events" || path === "/cseatemp/events/";
  const isGallery = path === "/cseatemp/gallery" || path === "/cseatemp/gallery/";
  const isTeam = path === "/cseatemp/team" || path === "/cseatemp/team/";
  const isGames = path.startsWith("/cseatemp/games");

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className={`navbar-toggle ${collapsed ? "collapsed" : ""}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href={isHome ? "#page-top" : "/cseatemp/"} onClick={() => setCollapsed(true)}>
            Welcome
          </a>{" "}
        </div>

        <div
          className={`collapse navbar-collapse ${collapsed ? "" : "in"}`}
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
           
            <li>
              <a href={isHome ? "#about" : "/cseatemp/#about"} className="page-scroll" onClick={() => setCollapsed(true)}>
                About
              </a>
            </li>
            <li>
              <a href={isEvents ? "#portfolio" : "/cseatemp/events"} className="page-scroll" onClick={() => setCollapsed(true)}>
               Events
              </a>
            </li>
            <li>
              <a href={isGallery ? "#testimonials" : "/cseatemp/gallery"} className="page-scroll" onClick={() => setCollapsed(true)}>
                Gallery
              </a>
            </li>
            <li>
              <a href={isTeam ? "#team" : "/cseatemp/team"} className="page-scroll" onClick={() => setCollapsed(true)}>
                Team
              </a>
            </li>
            <li className={isGames ? "active" : ""}>
              <a href="/cseatemp/games" className="page-scroll" onClick={() => setCollapsed(true)}>
                Games
              </a>
            </li>
            <li>
              <a href={isHome ? "#contact" : "/cseatemp/#contact"} className="page-scroll" onClick={() => setCollapsed(true)}>
                Contact
              </a>
            </li>
            <li onClick={() => setCollapsed(true)}>
              <Login />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

