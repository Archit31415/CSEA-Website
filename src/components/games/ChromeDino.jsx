import React, { useState, useEffect, useRef } from "react";

// Web Audio API helper for retro sound effects
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "jump") {
      // Short high pitch chirp
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "score") {
      // Double beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);

      setTimeout(() => {
        const ctx2 = new AudioContext();
        const osc2 = ctx2.createOscillator();
        const gain2 = ctx2.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx2.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1100, ctx2.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx2.currentTime);
        gain2.gain.linearRampToValueAtTime(0.01, ctx2.currentTime + 0.1);
        osc2.start(ctx2.currentTime);
        osc2.stop(ctx2.currentTime + 0.1);
      }, 90);
    } else if (type === "crash") {
      // Long low pitch buzz
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.35);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Ignore audio context errors if browser blocks it
  }
};

// Retro Pixel Art Sprite data (X = draw pixel, O = clear pixel/eye)
const SPRITES = {
  DINO_RUN_1: [
    "            XXXXXXXXXX",
    "            XXOXXXXXXX",
    "            XXXXXXXXXX",
    "            XXXX      ",
    "            XXXXXXX   ",
    "XX         XXXXXXXX   ",
    "XX        XXXXXXXXX   ",
    "XXX      XXXXXXXXX    ",
    "XXXXXXXXXXXXXXXX      ",
    " XXXXXXXXXXXXXX       ",
    "  XXXXXXXXXXXX        ",
    "   XXXXXXXXXX         ",
    "    XXXXXXXX          ",
    "     XXXXXX           ",
    "      XXXX            ",
    "      XX  X           ",
    "      XX              ",
    "      X               ",
    "      XX              ",
    "      X               ",
    "      XX              "
  ],
  DINO_RUN_2: [
    "            XXXXXXXXXX",
    "            XXOXXXXXXX",
    "            XXXXXXXXXX",
    "            XXXX      ",
    "            XXXXXXX   ",
    "XX         XXXXXXXX   ",
    "XX        XXXXXXXXX   ",
    "XXX      XXXXXXXXX    ",
    "XXXXXXXXXXXXXXXX      ",
    " XXXXXXXXXXXXXX       ",
    "  XXXXXXXXXXXX        ",
    "   XXXXXXXXXX         ",
    "    XXXXXXXX          ",
    "     XXXXXX           ",
    "      XXXX            ",
    "      X  XX           ",
    "         XX           ",
    "         X            ",
    "        XX            ",
    "        X             ",
    "       XX             "
  ],
  DINO_DUCK_1: [
    "                 XXXXXXXXXXXXXX",
    "                 XXOXXXXXXXXXXX",
    "                 XXXXXXXXXXXXXX",
    "                 XXXXXX        ",
    "XX             XXXXXXXXXX      ",
    "XXX           XXXXXXXXXXXX     ",
    "XXXXXXXXXXXXXXXXXXXXXXXXXX     ",
    " XXXXXXXXXXXXXXXXXXXXXXXX      ",
    "  XXXXXXXXXXXXXXXXXXXXXX       ",
    "   XXXXXXXXXXXXXXXXXXXX        ",
    "     XXXXXX    XXXXXX          ",
    "     XX        XX              ",
    "     XX        XX              ",
    "     X         X               "
  ],
  DINO_DUCK_2: [
    "                 XXXXXXXXXXXXXX",
    "                 XXOXXXXXXXXXXX",
    "                 XXXXXXXXXXXXXX",
    "                 XXXXXX        ",
    "XX             XXXXXXXXXX      ",
    "XXX           XXXXXXXXXXXX     ",
    "XXXXXXXXXXXXXXXXXXXXXXXXXX     ",
    " XXXXXXXXXXXXXXXXXXXXXXXX      ",
    "  XXXXXXXXXXXXXXXXXXXXXX       ",
    "   XXXXXXXXXXXXXXXXXXXX        ",
    "     XXXXXX    XXXXXX          ",
    "       XX        XX            ",
    "       XX        XX            ",
    "      XX        XX             "
  ],
  DINO_CRASH: [
    "            XXXXXXXXXX",
    "            XXOXXOXXXX",
    "            XXXXXXXXXX",
    "            XXXX      ",
    "            XXXXXXX   ",
    "XX         XXXXXXXX   ",
    "XX        XXXXXXXXX   ",
    "XXX      XXXXXXXXX    ",
    "XXXXXXXXXXXXXXXX      ",
    " XXXXXXXXXXXXXX       ",
    "  XXXXXXXXXXXX        ",
    "   XXXXXXXXXX         ",
    "    XXXXXXXX          ",
    "     XXXXXX           ",
    "      XXXX            ",
    "      XX  XX          ",
    "      XX  XX          ",
    "      X    X          ",
    "      X    X          ",
    "      XX   XX         ",
    "      XX   XX         "
  ],
  CACTUS_SMALL: [
    "   XXX   ",
    "  XXXXX  ",
    "  XX XX  ",
    "  XX XX  ",
    "  XXXXX  ",
    " XXXXXXX ",
    "XX XXX XX",
    "XX XXX XX",
    " XXXXXXX ",
    "  XXXXX  ",
    "  XXXXX  ",
    "  XXXXX  ",
    "  XXXXX  ",
    "  XXXXX  ",
    "  XXXXX  ",
    "  XXXXX  "
  ],
  CACTUS_LARGE: [
    "    XXXX    ",
    "   XXXXXX   ",
    "   XX  XX   ",
    "   XX  XX   ",
    "   XXXXXX   ",
    "  XXXXXXXX  ",
    " XX XXXX XX ",
    "XXX XXXX XXX",
    "XXX XXXX XXX",
    " XX XXXX XX ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   ",
    "   XXXXXX   "
  ],
  BIRD_WING_UP: [
    "      XX      ",
    "     XXXX     ",
    "    XXXXXX    ",
    "   XXXXXXXX   ",
    "  XXXXXXXXXX  ",
    "XXXXXXXXXXXXXX",
    " XX XXX XXX XX",
    "    XXX XXX   ",
    "    XXX       ",
    "    X         "
  ],
  BIRD_WING_DOWN: [
    "    X         ",
    "    XXX       ",
    "    XXX XXX   ",
    " XX XXX XXX XX",
    "XXXXXXXXXXXXXX",
    "  XXXXXXXXXX  ",
    "   XXXXXXXX   ",
    "    XXXXXX    ",
    "     XXXX     ",
    "      XX      "
  ],
  CLOUD: [
    "      XXXX      ",
    "    XXXXXXXX    ",
    "   XXXXXXXXXX   ",
    " XXXXXXXXXXXXXX ",
    "XXXXXXXXXXXXXXXX"
  ]
};

export const ChromeDino = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10);
  });
  const [isNightMode, setIsNightMode] = useState(false);

  // References for keeping track of game loop values without state re-triggering
  const gameStateRef = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    speed: 6,
    dinoY: 0,
    dinoVelocityY: 0,
    isJumping: false,
    isDucking: false,
    obstacles: [],
    clouds: [],
    groundX: 0,
    frameIndex: 0,
    timeSinceLastObstacle: 0,
    scoreNotificationMilestone: 100,
    themeNight: false,
  });

  // Load and sync highscore
  useEffect(() => {
    gameStateRef.current.highScore = highScore;
  }, [highScore]);

  // Draw sprite on canvas context
  const drawSprite = (ctx, spriteName, x, y, scale = 2, isNight = false) => {
    const sprite = SPRITES[spriteName];
    if (!sprite) return;

    ctx.fillStyle = isNight ? "#00f2fe" : "#555555";
    
    // Customize Dino colors in night/day modes
    if (spriteName.startsWith("DINO_")) {
      ctx.fillStyle = isNight ? "#00f2fe" : "#222222";
    } else if (spriteName.startsWith("CACTUS_")) {
      ctx.fillStyle = isNight ? "#ff3366" : "#32cd32";
    } else if (spriteName.startsWith("BIRD_")) {
      ctx.fillStyle = isNight ? "#ffb199" : "#ff7f50";
    } else if (spriteName === "CLOUD") {
      ctx.fillStyle = isNight ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.08)";
    }

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        if (sprite[r][c] === "X") {
          ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
        } else if (sprite[r][c] === "O") {
          // Dino's eye! Invert to match background
          ctx.fillStyle = isNight ? "#111111" : "#f7f7f7";
          ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
          // Restore color
          if (spriteName.startsWith("DINO_")) {
            ctx.fillStyle = isNight ? "#00f2fe" : "#222222";
          }
        }
      }
    }
  };

  const jump = () => {
    const state = gameStateRef.current;
    if (!state.isJumping && !state.isDucking && state.isPlaying && !state.isGameOver) {
      state.dinoVelocityY = -12; // Jump force
      state.isJumping = true;
      playSound("jump");
    }
  };

  const duck = (duckState) => {
    const state = gameStateRef.current;
    if (state.isPlaying && !state.isGameOver) {
      state.isDucking = duckState;
    }
  };

  const startNewGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset values
    gameStateRef.current = {
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10),
      speed: 6,
      dinoY: 0,
      dinoVelocityY: 0,
      isJumping: false,
      isDucking: false,
      obstacles: [],
      clouds: [
        { x: 200, y: 30, speed: 0.5 },
        { x: 500, y: 50, speed: 0.3 },
        { x: 800, y: 20, speed: 0.6 }
      ],
      groundX: 0,
      frameIndex: 0,
      timeSinceLastObstacle: 0,
      scoreNotificationMilestone: 100,
      themeNight: false,
    };

    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setIsNightMode(false);
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!gameStateRef.current.isPlaying) {
          startNewGame();
        } else {
          jump();
        }
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        duck(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowDown") {
        e.preventDefault();
        duck(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main Canvas Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const canvasWidth = 800;
    const canvasHeight = 220;
    const groundY = 190;
    const dinoX = 60;
    const pixelScale = 2; // Sprite rendering scale factor

    const gameLoop = () => {
      const state = gameStateRef.current;

      // Handle calculations if playing
      if (state.isPlaying && !state.isGameOver) {
        state.frameIndex++;

        // Increase score slowly
        if (state.frameIndex % 5 === 0) {
          state.score += 1;
          setScore(state.score);

          // Milestone beep
          if (state.score >= state.scoreNotificationMilestone) {
            playSound("score");
            state.scoreNotificationMilestone += 100;
            // Gradually increase speed
            state.speed = Math.min(15, state.speed + 0.5);
          }

          // Day/Night Cycle inversion every 500 points
          const shouldBeNight = Math.floor(state.score / 500) % 2 === 1;
          if (shouldBeNight !== state.themeNight) {
            state.themeNight = shouldBeNight;
            setIsNightMode(shouldBeNight);
          }
        }

        // Apply physics to Jump
        if (state.isJumping) {
          state.dinoY += state.dinoVelocityY;
          state.dinoVelocityY += 0.6; // Gravity

          // Check landing
          if (state.dinoY >= 0) {
            state.dinoY = 0;
            state.dinoVelocityY = 0;
            state.isJumping = false;
          }
        }

        // Move background clouds
        state.clouds.forEach((cloud) => {
          cloud.x -= cloud.speed;
          if (cloud.x < -100) {
            cloud.x = canvasWidth + Math.random() * 200;
            cloud.y = 20 + Math.random() * 60;
          }
        });

        // Move ground
        state.groundX = (state.groundX - state.speed) % canvasWidth;

        // Obstacle Spawning
        state.timeSinceLastObstacle++;
        const obstacleSpawnInterval = Math.max(50, 150 - Math.floor(state.speed * 6));
        if (state.timeSinceLastObstacle > obstacleSpawnInterval && Math.random() < 0.02) {
          // Select obstacle: small cactus, large cactus, or birds (birds trigger only after score > 150)
          let obsType = "CACTUS_SMALL";
          const roll = Math.random();
          if (state.score > 200 && roll < 0.3) {
            obsType = "BIRD";
          } else if (roll < 0.65) {
            obsType = "CACTUS_LARGE";
          }

          let spawnY = groundY;
          let width = 0;
          let height = 0;

          if (obsType === "CACTUS_SMALL") {
            const cactusData = SPRITES.CACTUS_SMALL;
            width = cactusData[0].length * pixelScale;
            height = cactusData.length * pixelScale;
            spawnY = groundY - height;
          } else if (obsType === "CACTUS_LARGE") {
            const cactusData = SPRITES.CACTUS_LARGE;
            width = cactusData[0].length * pixelScale;
            height = cactusData.length * pixelScale;
            spawnY = groundY - height;
          } else if (obsType === "BIRD") {
            const birdData = SPRITES.BIRD_WING_UP;
            width = birdData[0].length * pixelScale;
            height = birdData.length * pixelScale;
            
            // Random bird flying paths: low (duck), mid (jump/duck), high (run under)
            const paths = [groundY - height - 10, groundY - height - 40, groundY - height - 70];
            spawnY = paths[Math.floor(Math.random() * paths.length)];
          }

          state.obstacles.push({
            type: obsType,
            x: canvasWidth,
            y: spawnY,
            width,
            height,
            frame: 0
          });
          state.timeSinceLastObstacle = 0;
        }

        // Move Obstacles
        state.obstacles.forEach((obs) => {
          obs.x -= state.speed;
        });

        // Clear off-screen obstacles
        state.obstacles = state.obstacles.filter((obs) => obs.x + obs.width > 0);

        // Check Collisions
        const dinoBoxWidth = state.isDucking ? SPRITES.DINO_DUCK_1[0].length * pixelScale : SPRITES.DINO_RUN_1[0].length * pixelScale;
        const dinoBoxHeight = state.isDucking ? SPRITES.DINO_DUCK_1.length * pixelScale : SPRITES.DINO_RUN_1.length * pixelScale;
        const dinoBoxX = dinoX;
        const dinoBoxY = groundY - dinoBoxHeight + state.dinoY;

        // Visual hitbox padding (shrink hitboxes slightly to make game fair and rewarding!)
        const shrinkFactor = 4;
        const dHitbox = {
          left: dinoBoxX + shrinkFactor,
          right: dinoBoxX + dinoBoxWidth - shrinkFactor,
          top: dinoBoxY + shrinkFactor,
          bottom: dinoBoxY + dinoBoxHeight - shrinkFactor
        };

        state.obstacles.forEach((obs) => {
          const oHitbox = {
            left: obs.x + shrinkFactor,
            right: obs.x + obs.width - shrinkFactor,
            top: obs.y + shrinkFactor,
            bottom: obs.y + obs.height - shrinkFactor
          };

          // Overlap check
          if (
            dHitbox.right > oHitbox.left &&
            dHitbox.left < oHitbox.right &&
            dHitbox.bottom > oHitbox.top &&
            dHitbox.top < oHitbox.bottom
          ) {
            // Collision detected! Game Over
            state.isGameOver = true;
            setIsGameOver(true);
            playSound("crash");

            // Update highscore persistence
            if (state.score > state.highScore) {
              localStorage.setItem("chrome_dino_high_score", state.score.toString());
              setHighScore(state.score);
            }
          }
        });
      }

      // Draw Everything
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw Background
      if (state.themeNight) {
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      } else {
        ctx.fillStyle = "#f7f7f7";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // Draw Night stars
      if (state.themeNight) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillRect(100, 40, 2, 2);
        ctx.fillRect(250, 20, 3, 3);
        ctx.fillRect(400, 60, 1, 1);
        ctx.fillRect(600, 30, 2, 2);
        ctx.fillRect(720, 50, 3, 3);
      }

      // 2. Draw Clouds
      state.clouds.forEach((cloud) => {
        drawSprite(ctx, "CLOUD", cloud.x, cloud.y, pixelScale, state.themeNight);
      });

      // 3. Draw Ground Line
      ctx.strokeStyle = state.themeNight ? "#00f2fe" : "#777777";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvasWidth, groundY);
      ctx.stroke();

      // Simple ground details
      ctx.fillStyle = state.themeNight ? "rgba(0, 242, 254, 0.4)" : "rgba(0, 0, 0, 0.2)";
      for (let i = 0; i < canvasWidth; i += 120) {
        let gx = (state.groundX + i) % canvasWidth;
        if (gx < 0) gx += canvasWidth;
        ctx.fillRect(gx, groundY + 5, 20, 2);
        ctx.fillRect(gx + 40, groundY + 12, 10, 2);
      }

      // 4. Draw Dino
      const dinoHeight = state.isDucking ? SPRITES.DINO_DUCK_1.length * pixelScale : SPRITES.DINO_RUN_1.length * pixelScale;
      const drawY = groundY - dinoHeight + state.dinoY;

      if (state.isGameOver) {
        drawSprite(ctx, "DINO_CRASH", dinoX, drawY, pixelScale, state.themeNight);
      } else if (state.isJumping) {
        // Draw standing frame when jumping
        drawSprite(ctx, "DINO_RUN_1", dinoX, drawY, pixelScale, state.themeNight);
      } else if (state.isDucking) {
        // Ducking animation leg frames
        const frameName = Math.floor(state.frameIndex / 6) % 2 === 0 ? "DINO_DUCK_1" : "DINO_DUCK_2";
        drawSprite(ctx, frameName, dinoX, drawY, pixelScale, state.themeNight);
      } else {
        // Running animation leg frames
        const frameName = Math.floor(state.frameIndex / 6) % 2 === 0 ? "DINO_RUN_1" : "DINO_RUN_2";
        drawSprite(ctx, frameName, dinoX, drawY, pixelScale, state.themeNight);
      }

      // 5. Draw Obstacles
      state.obstacles.forEach((obs) => {
        if (obs.type === "CACTUS_SMALL") {
          drawSprite(ctx, "CACTUS_SMALL", obs.x, obs.y, pixelScale, state.themeNight);
        } else if (obs.type === "CACTUS_LARGE") {
          drawSprite(ctx, "CACTUS_LARGE", obs.x, obs.y, pixelScale, state.themeNight);
        } else if (obs.type === "BIRD") {
          const flapFrame = Math.floor(state.frameIndex / 10) % 2 === 0 ? "BIRD_WING_UP" : "BIRD_WING_DOWN";
          drawSprite(ctx, flapFrame, obs.x, obs.y, pixelScale, state.themeNight);
        }
      });

      // 6. Draw Retro Hud text on canvas if start screen
      if (!state.isPlaying) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.font = "bold 20px 'Raleway', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE OR TAP TO RUN", canvasWidth / 2, canvasHeight / 2);
      }

      if (state.isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.font = "bold 28px 'Raleway', sans-serif";
        ctx.fillStyle = "#ff1744";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);

        ctx.font = "16px 'Raleway', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("PRESS SPACE OR TAP TO RESTART", canvasWidth / 2, canvasHeight / 2 + 20);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle mobile canvas tapping
  const handleCanvasClick = () => {
    if (!gameStateRef.current.isPlaying || gameStateRef.current.isGameOver) {
      startNewGame();
    } else {
      jump();
    }
  };

  return (
    <div className="game-play-area">
      <div className="dino-arena">
        <div className="math-info-bar" style={{ width: "100%", maxWidth: "800px" }}>
          <div className="math-score">
            Score: {score.toString().padStart(5, "0")}
          </div>
          <div className="math-score" style={{ color: "#ffb199" }}>
            HI: {highScore.toString().padStart(5, "0")}
          </div>
        </div>

        <div
          ref={containerRef}
          className={`dino-canvas-container ${isNightMode ? "night-mode" : ""}`}
          onClick={handleCanvasClick}
          style={{ cursor: "pointer" }}
        >
          <canvas
            ref={canvasRef}
            className="dino-canvas"
            width="800"
            height="220"
          />
        </div>

        <div className="dino-instructions">
          <div className="instruction-item">
            <span className="key-badge">Space</span> or <span className="key-badge">↑</span> Jump
          </div>
          <div className="instruction-item">
            <span className="key-badge">↓</span> Duck (Avoid birds)
          </div>
          <div className="instruction-item">
            <span className="key-badge">Tap / Click</span> Action for Mobile
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromeDino;
