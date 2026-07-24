import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Navigation as MainNavigation } from "./navigation";
import { Navigation as StudentNavigation } from "../login/navigation";
import Particle from "../login/Particle";
import TwentyInTwo from "./games/TwentyInTwo";
import ChromeDino from "./games/ChromeDino";
import MarketMaker from "./games/MarketMaker";
import "./games/Games.css";

export const GamesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGame = searchParams.get("game");
  const location = useLocation();
  const isStudentCorner = location.pathname.startsWith("/cseatemp/student");

  const [mathHighScore, setMathHighScore] = useState(0);
  const [dinoHighScore, setDinoHighScore] = useState(0);
  const [mmHighScore, setMmHighScore] = useState(0);

  // Sync high scores from localStorage when page mounts or when activeGame changes
  useEffect(() => {
    setMathHighScore(parseInt(localStorage.getItem("twenty_in_two_high_score") || "0", 10));
    setDinoHighScore(parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10));
    setMmHighScore(parseInt(localStorage.getItem("csea_market_maker_high_score") || "0", 10));
    window.scrollTo(0, 0);
  }, [activeGame]);

  const selectGame = (gameKey) => {
    if (gameKey) {
      setSearchParams({ game: gameKey });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="games-page">
      <Particle />
      {isStudentCorner ? <StudentNavigation /> : <MainNavigation />}
      
      <div className="games-container">
        {activeGame ? (
          <div>
            <button className="btn-back" onClick={() => selectGame(null)}>
              ← Back to Arcade
            </button>
            
            {activeGame === "20in2" && <TwentyInTwo />}
            {activeGame === "dino" && <ChromeDino />}
            {activeGame === "marketmaker" && <MarketMaker />}
          </div>
        ) : (
          <div>
            <div className="games-header">
              <h1>CSEA Arcade</h1>
              <p>
                Take a break, challenge your mind, or test your reflexes! Try our custom arcade challenges built right into the browser.
              </p>
            </div>

            <div className="games-grid">
              {/* Card 1: 20 in 2 */}
              <div className="game-card">
                <div>
                  <span className="game-icon">⚡</span>
                  <h3>20 in 2 Math Speedrun</h3>
                  <p>
                    Solve 20 addition, subtraction, multiplication, and division problems within 2 minutes. Focus on speed and accuracy. Correct answers add points, wrong answers deduct them!
                  </p>
                </div>
                <div>
                  <div className="game-stats">
                    High Score: {mathHighScore} points
                  </div>
                  <button className="btn-game-primary" onClick={() => selectGame("20in2")}>
                    Play Speedrun
                  </button>
                </div>
              </div>

              {/* Card 2: Chrome Dino */}
              <div className="game-card dino-card">
                <div>
                  <span className="game-icon">🦖</span>
                  <h3>CSEA Dino Run</h3>
                  <p>
                    A customized browser dinosaur side-scroller. Run through the desert landscape, jump over cacti, duck under flying birds, and survive the day/night cycle as speed escalates.
                  </p>
                </div>
                <div>
                  <div className="game-stats">
                    High Score: {dinoHighScore.toString().padStart(5, "0")}
                  </div>
                  <button className="btn-game-primary" onClick={() => selectGame("dino")}>
                    Play Dino Run
                  </button>
                </div>
              </div>

              {/* Card 3: Market Maker */}
              <div className="game-card">
                <div>
                  <span className="game-icon">📊</span>
                  <h3>CSEA Market Maker</h3>
                  <p>
                    A real-time simulated order book trading game! Trade contracts on Fermi estimation questions. Quoting limit orders to bots while managing inventory risk and reacting to hints.
                  </p>
                </div>
                <div>
                  <div className="game-stats">
                    High Score: ${mmHighScore.toLocaleString()} P&L
                  </div>
                  <button className="btn-game-primary" onClick={() => selectGame("marketmaker")}>
                    Open Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
