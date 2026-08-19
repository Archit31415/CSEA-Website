import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import "../../src/App.css";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("combined");
  const [data, setData] = useState({ math: [], dino: [], marketmaker: [], combined: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/leaderboard", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard data.");
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not load standings. Verify the server is running.");
        setLoading(false);
      });
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return { text: "1st", color: "#ffd700", textShadow: "0 0 10px rgba(255,215,0,0.3)" };
    if (rank === 2) return { text: "2nd", color: "#c0c0c0", textShadow: "0 0 10px rgba(192,192,192,0.3)" };
    if (rank === 3) return { text: "3rd", color: "#cd7f32", textShadow: "0 0 10px rgba(205,127,50,0.3)" };
    return { text: `${rank}`, color: "#b0a9df", textShadow: "none" };
  };

  const activeStandings = data[activeTab] || [];

  return (
    <div>
      <Navigation />
      <div className="login-page-container" style={{ paddingBottom: "60px" }}>
        <div className="login-card" style={{ maxWidth: "800px", padding: "35px 25px" }}>
          <h2>CSEA Arcade Leaderboard</h2>
          <p>Global student standings across all browser games</p>

          <div className="mm-onboarding-tabs" style={{ marginBottom: "25px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
            <button
              type="button"
              className={`mm-onboarding-tab-btn ${activeTab === "combined" ? "active" : ""}`}
              onClick={() => setActiveTab("combined")}
              style={{ padding: "10px 5px", fontSize: "13px" }}
            >
              Combined
            </button>
            <button
              type="button"
              className={`mm-onboarding-tab-btn ${activeTab === "math" ? "active" : ""}`}
              onClick={() => setActiveTab("math")}
              style={{ padding: "10px 5px", fontSize: "13px" }}
            >
              Math Speedrun
            </button>
            <button
              type="button"
              className={`mm-onboarding-tab-btn ${activeTab === "dino" ? "active" : ""}`}
              onClick={() => setActiveTab("dino")}
              style={{ padding: "10px 5px", fontSize: "13px" }}
            >
              Dino Run
            </button>
            <button
              type="button"
              className={`mm-onboarding-tab-btn ${activeTab === "marketmaker" ? "active" : ""}`}
              onClick={() => setActiveTab("marketmaker")}
              style={{ padding: "10px 5px", fontSize: "13px" }}
            >
              Market Maker
            </button>
          </div>

          {loading ? (
            <h3 style={{ color: "#a49fc6", margin: "40px 0" }}>Loading Standings...</h3>
          ) : error ? (
            <div className="login-alert error" style={{ margin: "20px 0" }}>{error}</div>
          ) : activeStandings.length === 0 ? (
            <div style={{ padding: "40px 20px", color: "#b0a9df" }}>
              <h4>No scores recorded yet!</h4>
              <p style={{ fontSize: "13px", marginTop: "5px" }}>Be the first to secure a spot on the standings by playing a game.</p>
            </div>
          ) : (
            <div className="review-table-container" style={{ margin: 0, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="review-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase" }}>Rank</th>
                    <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase", textAlign: "left" }}>Name</th>
                    {activeTab === "combined" && (
                      <>
                        <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase" }}>Math</th>
                        <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase" }}>Dino</th>
                        <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase" }}>Market Maker</th>
                      </>
                    )}
                    <th style={{ padding: "14px 10px", color: "#a49fc6", fontSize: "12.5px", fontWeight: "700", textTransform: "uppercase", textAlign: "right" }}>
                      {activeTab === "combined" ? "Total Standings Index" : "High Score"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeStandings.map((user, idx) => {
                    const rankInfo = getRankBadge(idx + 1);
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          background: idx % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                          transition: "background 0.2s ease"
                        }}
                        className="leaderboard-row-hover"
                      >
                        <td style={{ padding: "14px 10px", fontWeight: "800", color: rankInfo.color, textShadow: rankInfo.textShadow, fontSize: "14px" }}>
                          {rankInfo.text}
                        </td>
                        <td style={{ padding: "14px 10px", textAlign: "left" }}>
                          <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{user.name}</div>
                          <div style={{ color: "#8c85b5", fontSize: "11px", marginTop: "2px" }}>{user.email}</div>
                        </td>
                        {activeTab === "combined" && (
                          <>
                            <td style={{ padding: "14px 10px", color: "#b0a9df", fontSize: "13.5px" }}>{user.scores.math || "-"}</td>
                            <td style={{ padding: "14px 10px", color: "#b0a9df", fontSize: "13.5px" }}>{user.scores.dino || "-"}</td>
                            <td style={{ padding: "14px 10px", color: "#b0a9df", fontSize: "13.5px" }}>
                              {user.scores.marketmaker !== undefined ? user.scores.marketmaker : "-"}
                            </td>
                          </>
                        )}
                        <td style={{ padding: "14px 10px", textAlign: "right", color: "#00f2fe", fontWeight: "800", fontSize: "14px" }}>
                          {activeTab === "combined" ? (
                            <span>{Math.round(user.totalScore).toLocaleString()}</span>
                          ) : activeTab === "marketmaker" ? (
                            <span>${user.scores.marketmaker.toLocaleString()}</span>
                          ) : activeTab === "math" ? (
                            <span>{user.scores.math}</span>
                          ) : (
                            <span>{user.scores.dino}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
