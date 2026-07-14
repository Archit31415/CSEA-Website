import React, { useState, useEffect, useRef } from "react";

const DIFFICULTY = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const GAME_STATE = {
  START: "START",
  PLAYING: "PLAYING",
  GAMEOVER: "GAMEOVER",
};

export const TwentyInTwo = () => {
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [difficulty, setDifficulty] = useState(DIFFICULTY.EASY);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("twenty_in_two_high_score") || "0", 10);
  });
  
  // Visual feedback animation states
  const [flashState, setFlashState] = useState(null); // 'correct', 'incorrect', or null
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Generate a math question based on difficulty
  const generateQuestion = (diff) => {
    const operators = ["+", "-", "*", "/"];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a, b, text, ans;

    switch (op) {
      case "+":
        if (diff === DIFFICULTY.EASY) {
          a = Math.floor(Math.random() * 46) + 5; // 5-50
          b = Math.floor(Math.random() * 46) + 5; // 5-50
        } else if (diff === DIFFICULTY.MEDIUM) {
          a = Math.floor(Math.random() * 181) + 20; // 20-200
          b = Math.floor(Math.random() * 181) + 20;
        } else {
          a = Math.floor(Math.random() * 900) + 100; // 100-999
          b = Math.floor(Math.random() * 900) + 100;
        }
        text = `${a} + ${b}`;
        ans = a + b;
        break;

      case "-":
        if (diff === DIFFICULTY.EASY) {
          a = Math.floor(Math.random() * 90) + 10; // 10-99
          b = Math.floor(Math.random() * (a - 1)) + 2; // 2 to a-1
        } else if (diff === DIFFICULTY.MEDIUM) {
          a = Math.floor(Math.random() * 251) + 50; // 50-300
          b = Math.floor(Math.random() * (a - 5)) + 10;
        } else {
          a = Math.floor(Math.random() * 800) + 200; // 200-999
          b = Math.floor(Math.random() * (a - 20)) + 50;
        }
        text = `${a} - ${b}`;
        ans = a - b;
        break;

      case "*":
        if (diff === DIFFICULTY.EASY) {
          a = Math.floor(Math.random() * 9) + 2; // 2-10
          b = Math.floor(Math.random() * 14) + 2; // 2-15
        } else if (diff === DIFFICULTY.MEDIUM) {
          a = Math.floor(Math.random() * 12) + 4; // 4-15
          b = Math.floor(Math.random() * 21) + 5; // 5-25
        } else {
          a = Math.floor(Math.random() * 25) + 11; // 11-35
          b = Math.floor(Math.random() * 25) + 11; // 11-35
        }
        text = `${a} × ${b}`;
        ans = a * b;
        break;

      case "/":
      default:
        let quotient;
        if (diff === DIFFICULTY.EASY) {
          b = Math.floor(Math.random() * 9) + 2; // 2-10 divisor
          quotient = Math.floor(Math.random() * 11) + 2; // 2-12 quotient
        } else if (diff === DIFFICULTY.MEDIUM) {
          b = Math.floor(Math.random() * 11) + 4; // 4-15 divisor
          quotient = Math.floor(Math.random() * 16) + 5; // 5-20 quotient
        } else {
          b = Math.floor(Math.random() * 18) + 8; // 8-25 divisor
          quotient = Math.floor(Math.random() * 20) + 11; // 11-30 quotient
        }
        a = b * quotient; // dividend
        text = `${a} ÷ ${b}`;
        ans = quotient;
        break;
    }

    return { questionText: text, correctAnswer: ans, userAns: null, correct: null };
  };

  // Start the game
  const startGame = () => {
    const list = [];
    for (let i = 0; i < 20; i++) {
      list.push(generateQuestion(difficulty));
    }
    setQuestions(list);
    setCurrentIdx(0);
    setUserInput("");
    setScore(0);
    setSecondsLeft(120);
    setGameState(GAME_STATE.PLAYING);
    setFlashState(null);
  };

  // End the game
  const endGame = () => {
    setGameState(GAME_STATE.GAMEOVER);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Timer tick
  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Autofocus the input box
  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentIdx]);

  // Handle high score updates
  useEffect(() => {
    if (gameState === GAME_STATE.GAMEOVER) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("twenty_in_two_high_score", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  // Handle user response submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() === "" || gameState !== GAME_STATE.PLAYING) return;

    const currentQuestion = questions[currentIdx];
    const parsedAns = parseInt(userInput.trim(), 10);
    const isCorrect = parsedAns === currentQuestion.correctAnswer;

    // Update questions array with user answers
    const updatedQuestions = [...questions];
    updatedQuestions[currentIdx] = {
      ...currentQuestion,
      userAns: parsedAns,
      correct: isCorrect,
    };
    setQuestions(updatedQuestions);

    // Scoring: +1 for correct, -1 for wrong. Minimum score is 0.
    const newScore = isCorrect ? score + 1 : Math.max(0, score - 1);
    setScore(newScore);

    // Apply quick feedback flash
    setFlashState(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFlashState(null);
      setUserInput("");

      // Advance or endGame
      if (currentIdx < 19) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        endGame();
      }
    }, 200);
  };

  // Copy results summary to clipboard
  const handleShare = () => {
    const correctCount = questions.filter((q) => q.correct).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const timeTaken = 120 - secondsLeft;
    const text = `🧩 CSEA Arithmetic Challenge: 20 in 2 🧩\nDifficulty: ${difficulty}\nScore: ${score} pts\nAccuracy: ${correctCount}/20 (${accuracy}%)\nTime: ${timeTaken} seconds\nCan you beat my score? Play at CSEA website!`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Results copied to clipboard! Share it with your friends.");
    }).catch(() => {
      alert("Could not copy stats. Please select and copy manually.");
    });
  };

  return (
    <div className="game-play-area">
      {gameState === GAME_STATE.START && (
        <div className="math-setup">
          <span className="game-icon">⚡</span>
          <h3>20 in 2 Challenge</h3>
          <p>
            Test your numerical instincts! You will face <b>20 arithmetic questions</b>. 
            You have <b>2 minutes (120 seconds)</b> to finish. 
            <br />
            <br />
            <b>Scoring:</b> Correct answers add <b>1 point</b>. Incorrect answers deduct <b>1 point</b>. Accuracy and speed both matter!
          </p>

          <div className="game-stats">
            Personal High Score: {highScore} points
          </div>

          <div style={{ color: "#a49fc6", fontWeight: "600" }}>Select Difficulty:</div>
          <div className="difficulty-selector">
            {Object.values(DIFFICULTY).map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? "active" : ""}`}
                onClick={() => setDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <button className="btn-game-primary" onClick={startGame}>
            Start Speedrun
          </button>
        </div>
      )}

      {gameState === GAME_STATE.PLAYING && questions.length > 0 && (
        <div className="math-arena">
          <div className="math-info-bar">
            <div className="math-score">Score: {score}</div>
            <div className="math-timer-wrapper">
              <div className="math-timer-text">
                {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
              </div>
              <div className="math-timer-bar-bg">
                <div
                  className={`math-timer-bar-fill ${secondsLeft <= 30 ? "warning" : ""}`}
                  style={{ width: `${(secondsLeft / 120) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Timeline tracker */}
          <div className="math-timeline">
            {questions.map((q, idx) => {
              let dotClass = "timeline-dot";
              if (idx === currentIdx) dotClass += " active";
              else if (q.correct === true) dotClass += " correct";
              else if (q.correct === false) dotClass += " incorrect";

              return <div key={idx} className={dotClass}></div>;
            })}
          </div>

          <div className="math-expression-box">
            <div className="math-expression">
              {questions[currentIdx]?.questionText} = ?
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="math-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                pattern="[0-9\-]*"
                inputMode="numeric"
                className={`math-input ${
                  flashState === "correct" ? "flash-correct" : ""
                } ${flashState === "incorrect" ? "flash-incorrect" : ""}`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={flashState !== null}
                placeholder="?"
                autoComplete="off"
              />
              <div className="math-input-hint">Press Enter to Submit</div>
            </div>
          </form>
        </div>
      )}

      {gameState === GAME_STATE.GAMEOVER && (
        <div className="math-results">
          <span className="game-icon" style={{ fontSize: "60px" }}>🏆</span>
          <h3>Speedrun Completed!</h3>
          <p style={{ color: "#a49fc6" }}>Here is your performance breakdown under pressure.</p>

          <div className="results-grid">
            <div className="results-stat-card">
              <div className="results-stat-val">{score}</div>
              <div className="results-stat-label">Total Score</div>
            </div>
            <div className="results-stat-card">
              <div className="results-stat-val">
                {questions.filter((q) => q.correct).length}/20
              </div>
              <div className="results-stat-label">Accuracy</div>
            </div>
            <div className="results-stat-card">
              <div className="results-stat-val">
                {120 - secondsLeft}s
              </div>
              <div className="results-stat-label">Time Taken</div>
            </div>
          </div>

          <div className="results-message">
            {score >= 18 ? (
              <span style={{ color: "#00e676" }}>🚀 Quant Master! Brilliant speed & accuracy.</span>
            ) : score >= 12 ? (
              <span style={{ color: "#00f2fe" }}>👏 Mental Math Wizard! Excellent run.</span>
            ) : score >= 6 ? (
              <span style={{ color: "#ffb199" }}>👍 Good Job! Keep practicing to get faster.</span>
            ) : (
              <span style={{ color: "#ff1744" }}>💪 Don't give up! Practice makes perfect.</span>
            )}
          </div>

          <div className="results-actions">
            <button className="btn-game-primary" onClick={startGame}>
              Try Again
            </button>
            <button className="btn-game-secondary" onClick={handleShare}>
              Share Stats
            </button>
          </div>

          <div className="review-section">
            <h4>Question Review</h4>
            <div className="review-table-container">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Equation</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => (
                    <tr
                      key={idx}
                      className={q.correct ? "correct" : "incorrect"}
                    >
                      <td>{idx + 1}</td>
                      <td>{q.questionText}</td>
                      <td>{q.userAns !== null ? q.userAns : "Skipped"}</td>
                      <td>{q.correctAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwentyInTwo;
