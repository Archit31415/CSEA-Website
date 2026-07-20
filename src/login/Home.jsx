import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";
import { About } from "./about";
import JsonData from "../data login/data.json";
import SmoothScroll from "smooth-scroll";
import "../App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000,
    speedAsDuration: true,
  });

const Home = () => {
    const [landingPageData, setLandingPageData] = useState({});
    const [userName, setUserName] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [tempName, setTempName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setLandingPageData(JsonData);
        // Fetch user profile status
        fetch("http://localhost:3000/auth/status", { credentials: "include" })
          .then(res => res.json())
          .then(data => {
            if (data.isAuthenticated) {
              setUserName(data.userName);
              setTempName(data.userName);
            }
          })
          .catch(err => console.error("Error checking auth status:", err));
    }, []);

    const handleUpdateName = (e) => {
      e.preventDefault();
      setErrorMsg("");
      if (!tempName.trim()) {
        setErrorMsg("Name cannot be empty.");
        return;
      }

      fetch("http://localhost:3000/auth/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempName.trim() }),
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserName(data.userName);
          setShowEditModal(false);
        } else {
          setErrorMsg(data.error || "Failed to update name.");
        }
      })
      .catch(err => {
        console.error("Update name error:", err);
        setErrorMsg("Server error. Please try again.");
      });
    };

    return (
        <div>
            <Navigation />
            <Header 
              data={landingPageData.Header} 
              userName={userName} 
              onEditName={() => {
                setTempName(userName);
                setErrorMsg("");
                setShowEditModal(true);
              }} 
            />
            <About data={landingPageData.About} />

            {showEditModal && (
              <div className="mm-help-overlay" style={{ zIndex: 2000 }} onClick={() => setShowEditModal(false)}>
                <div className="mm-help-modal" style={{ maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
                  <div className="mm-help-header">
                    <h4>Edit Display Name</h4>
                    <button type="button" className="mm-help-close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
                  </div>
                  <form onSubmit={handleUpdateName}>
                    <div className="mm-help-content" style={{ gap: "15px" }}>
                      <div className="login-form-group" style={{ margin: 0 }}>
                        <label htmlFor="custom-name">Display Name</label>
                        <input
                          id="custom-name"
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="login-input"
                          required
                        />
                      </div>
                      {errorMsg && (
                        <div style={{ color: "#ff1744", fontSize: "13px" }}>{errorMsg}</div>
                      )}
                    </div>
                    <div className="mm-help-footer" style={{ gap: "10px" }}>
                      <button type="submit" className="btn-game-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Save Name</button>
                      <button type="button" className="btn btn-default" style={{ color: "#fff", background: "rgba(255,255,255,0.05)", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px" }} onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
    );
};

export default Home;