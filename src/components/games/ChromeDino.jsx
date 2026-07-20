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
    hasShield: false,
    canDoubleJump: false,
    obstacles: [],
    powerUps: [],
    particles: [],
    clouds: [],
    groundX: 0,
    frameIndex: 0,
    timeSinceLastObstacle: 0,
    timeSinceLastPowerUp: 0,
    scoreNotificationMilestone: 100,
    themeNight: false,
  });

  // Load and sync highscore
  useEffect(() => {
    gameStateRef.current.highScore = highScore;
  }, [highScore]);

  // Fetch server high score on mount
  useEffect(() => {
    fetch("http://localhost:3000/auth/status", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated && data.scores && typeof data.scores.dino === "number") {
          const currentLocal = parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10);
          const best = Math.max(currentLocal, data.scores.dino);
          setHighScore(best);
          localStorage.setItem("chrome_dino_high_score", best.toString());
        }
      })
      .catch(err => console.error("Error fetching dino server high score:", err));
  }, []);

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
    if (state.isPlaying && !state.isGameOver) {
      if (!state.isJumping && !state.isDucking) {
        state.dinoVelocityY = -12.5;
        state.isJumping = true;
        playSound("jump");
      } else if (state.isJumping && state.canDoubleJump) {
        state.dinoVelocityY = -11.5;
        state.canDoubleJump = false;
        playSound("jump");
        state.particles.push({
          x: 100,
          y: 200 - state.dinoY - 20,
          text: "🚀 DOUBLE JUMP!",
          color: "#b026ff",
          life: 40
        });
      }
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

    fetch("http://localhost:3000/api/game/dino/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    }).catch(err => console.error("Dino session start error:", err));

    gameStateRef.current = {
      isPlaying: true,
      isGameOver: false,
      score: 0,
      highScore: parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10),
      speed: 9.5,
      dinoY: 0,
      dinoVelocityY: 0,
      isJumping: false,
      isDucking: false,
      hasShield: false,
      canDoubleJump: false,
      obstacles: [],
      powerUps: [],
      particles: [],
      clouds: [
        { x: 200, y: 30, speed: 0.5 },
        { x: 500, y: 50, speed: 0.3 },
        { x: 800, y: 20, speed: 0.6 }
      ],
      groundX: 0,
      frameIndex: 0,
      timeSinceLastObstacle: 0,
      timeSinceLastPowerUp: 0,
      scoreNotificationMilestone: 100,
      themeNight: false,
    };

    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setIsNightMode(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!gameStateRef.current.isPlaying || gameStateRef.current.isGameOver) {
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

  useEffect(() => {
    let animationFrameId;

    const canvasWidth = 800;
    const canvasHeight = 220;
    const groundY = 195;
    const dinoX = 60;
    const pixelScale = 2;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const state = gameStateRef.current;

      if (state.isPlaying && !state.isGameOver) {
        state.frameIndex += 1;
        state.timeSinceLastObstacle += 1;
        state.timeSinceLastPowerUp += 1;

        state.speed += 0.0025;

        if (state.frameIndex % 3 === 0) {
          state.score += 1;
          setScore(state.score);

          if (state.score > 0 && state.score % 500 === 0) {
            state.themeNight = !state.themeNight;
            setIsNightMode(state.themeNight);
          } else if (state.score >= state.scoreNotificationMilestone) {
            state.scoreNotificationMilestone += 100;
          }
        }

        if (state.isJumping) {
          state.dinoY += state.dinoVelocityY;
          state.dinoVelocityY += 0.7;

          if (state.dinoY >= 0) {
            state.dinoY = 0;
            state.dinoVelocityY = 0;
            state.isJumping = false;
          }
        }

        state.groundX -= state.speed;
        if (state.groundX <= -20) state.groundX = 0;

        state.clouds.forEach((cloud) => {
          cloud.x -= cloud.speed;
          if (cloud.x + 50 < 0) {
            cloud.x = canvasWidth + Math.random() * 100;
            cloud.y = 15 + Math.random() * 45;
          }
        });

        const minGap = Math.max(260, Math.round(450 - state.speed * 8));
        const obstacleSpawnInterval = Math.round(minGap / state.speed);

        if (state.timeSinceLastObstacle > obstacleSpawnInterval && Math.random() < 0.03) {
          let obsType = "CACTUS_SMALL";
          const roll = Math.random();
          if (state.score > 150 && roll < 0.35) {
            obsType = "BIRD";
          } else if (roll < 0.7) {
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

        if (state.timeSinceLastPowerUp > 280 && Math.random() < 0.03) {
          const types = ["SHIELD", "DOUBLE_JUMP", "STAR"];
          const pType = types[Math.floor(Math.random() * types.length)];
          state.powerUps.push({
            type: pType,
            x: canvasWidth,
            y: groundY - 60 - Math.random() * 45,
            width: 24,
            height: 24
          });
          state.timeSinceLastPowerUp = 0;
        }

        state.obstacles.forEach((obs) => { obs.x -= state.speed; });
        state.obstacles = state.obstacles.filter((obs) => obs.x + obs.width > 0);

        state.powerUps.forEach((pow) => { pow.x -= state.speed; });
        state.powerUps = state.powerUps.filter((pow) => pow.x + pow.width > 0);

        const dinoBoxWidth = state.isDucking ? SPRITES.DINO_DUCK_1[0].length * pixelScale : SPRITES.DINO_RUN_1[0].length * pixelScale;
        const dinoBoxHeight = state.isDucking ? SPRITES.DINO_DUCK_1.length * pixelScale : SPRITES.DINO_RUN_1.length * pixelScale;
        const dinoBoxY = groundY - dinoBoxHeight + state.dinoY;

        const shrinkFactor = 4;
        const dHitbox = {
          left: dinoX + shrinkFactor,
          right: dinoX + dinoBoxWidth - shrinkFactor,
          top: dinoBoxY + shrinkFactor,
          bottom: dinoBoxY + dinoBoxHeight - shrinkFactor
        };

        state.powerUps.forEach((pow, idx) => {
          if (
            dHitbox.right > pow.x &&
            dHitbox.left < pow.x + pow.width &&
            dHitbox.bottom > pow.y &&
            dHitbox.top < pow.y + pow.height
          ) {
            if (pow.type === "SHIELD") {
              state.hasShield = true;
              state.particles.push({ x: dinoX, y: dinoBoxY - 15, text: "🛡️ CYBER SHIELD!", color: "#00f2fe", life: 45 });
            } else if (pow.type === "DOUBLE_JUMP") {
              state.canDoubleJump = true;
              state.particles.push({ x: dinoX, y: dinoBoxY - 15, text: "🚀 DOUBLE JUMP!", color: "#b026ff", life: 45 });
            } else if (pow.type === "STAR") {
              state.score += 50;
              state.particles.push({ x: dinoX, y: dinoBoxY - 15, text: "+50 STAR GEM!", color: "#ffd700", life: 45 });
            }
            state.powerUps.splice(idx, 1);
          }
        });

        state.obstacles.forEach((obs) => {
          const oHitbox = {
            left: obs.x + shrinkFactor,
            right: obs.x + obs.width - shrinkFactor,
            top: obs.y + shrinkFactor,
            bottom: obs.y + obs.height - shrinkFactor
          };

          if (
            dHitbox.right > oHitbox.left &&
            dHitbox.left < oHitbox.right &&
            dHitbox.bottom > oHitbox.top &&
            dHitbox.top < oHitbox.bottom
          ) {
            if (state.hasShield) {
              state.hasShield = false;
              state.particles.push({ x: dinoX, y: dinoBoxY - 15, text: "🛡️ SHIELD ABSORBED!", color: "#ff1744", life: 45 });
              state.obstacles = state.obstacles.filter((o) => o !== obs);
            } else {
              state.isGameOver = true;
              setIsGameOver(true);
              fetch("http://localhost:3000/api/game/dino/end", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: state.score }),
                credentials: "include"
              })
              .then(res => res.json())
              .then(data => {
                if (data.success && typeof data.score === "number") {
                  const currentHigh = parseInt(localStorage.getItem("chrome_dino_high_score") || "0", 10);
                  if (data.newHighScore || data.score > currentHigh) {
                    setHighScore(data.score);
                    localStorage.setItem("chrome_dino_high_score", data.score.toString());
                  }
                }
              })
              .catch(err => console.error("Dino end session error:", err));
            }
          }
        });
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = state.themeNight ? "#111111" : "#f7f7f7";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      state.clouds.forEach((cloud) => { drawSprite(ctx, "CLOUD", cloud.x, cloud.y, pixelScale, state.themeNight); });
      ctx.fillStyle = state.themeNight ? "#00f2fe" : "#555555";
      ctx.fillRect(0, groundY, canvasWidth, 2);

      const drawY = groundY - (state.isDucking ? SPRITES.DINO_DUCK_1.length : SPRITES.DINO_RUN_1.length) * pixelScale + state.dinoY;
      const curDinoW = state.isDucking ? SPRITES.DINO_DUCK_1[0].length * pixelScale : SPRITES.DINO_RUN_1[0].length * pixelScale;
      const curDinoH = state.isDucking ? SPRITES.DINO_DUCK_1.length * pixelScale : SPRITES.DINO_RUN_1.length * pixelScale;

      if (state.hasShield) {
        ctx.save(); ctx.strokeStyle = "#00f2fe"; ctx.lineWidth = 3; ctx.shadowColor = "#00f2fe"; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(dinoX + curDinoW / 2, drawY + curDinoH / 2, Math.max(curDinoW, curDinoH) / 1.3, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      } else if (state.canDoubleJump) {
        ctx.save(); ctx.strokeStyle = "#b026ff"; ctx.lineWidth = 2.5; ctx.shadowColor = "#b026ff"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(dinoX + curDinoW / 2, drawY + curDinoH / 2, Math.max(curDinoW, curDinoH) / 1.4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }

      if (state.isGameOver) { drawSprite(ctx, "DINO_CRASH", dinoX, drawY, pixelScale, state.themeNight); }
      else if (state.isJumping) { drawSprite(ctx, "DINO_RUN_1", dinoX, drawY, pixelScale, state.themeNight); }
      else if (state.isDucking) { const df = Math.floor(state.frameIndex / 6) % 2 === 0 ? "DINO_DUCK_1" : "DINO_DUCK_2"; drawSprite(ctx, df, dinoX, drawY, pixelScale, state.themeNight); }
      else { const fn = Math.floor(state.frameIndex / 6) % 2 === 0 ? "DINO_RUN_1" : "DINO_RUN_2"; drawSprite(ctx, fn, dinoX, drawY, pixelScale, state.themeNight); }

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

      // Draw Power-Up Gems
      (state.powerUps || []).forEach((pow) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pow.x + 12, pow.y + 12, 10, 0, Math.PI * 2);
        if (pow.type === "SHIELD") {
          ctx.fillStyle = "#00f2fe";
          ctx.shadowColor = "#00f2fe";
        } else if (pow.type === "DOUBLE_JUMP") {
          ctx.fillStyle = "#b026ff";
          ctx.shadowColor = "#b026ff";
        } else {
          ctx.fillStyle = "#ffd700";
          ctx.shadowColor = "#ffd700";
        }
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pow.type === "SHIELD" ? "🛡️" : pow.type === "DOUBLE_JUMP" ? "🚀" : "💎", pow.x + 12, pow.y + 12);
        ctx.restore();
      });

      // Draw Floating Particles
      (state.particles || []).forEach((p) => {
        p.y -= 0.8;
        p.life -= 1;
        ctx.save();
        ctx.font = "bold 13px 'Raleway', sans-serif";
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0, p.life / 45);
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      });
      state.particles = (state.particles || []).filter((p) => p.life > 0);

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

        <div className="dino-powerup-legend" style={{ marginTop: "15px", display: "flex", gap: "18px", justifyContent: "center", flexWrap: "wrap", fontSize: "13px", color: "#a49fc6" }}>
          <div className="powerup-item">🛡️ <b>Shield:</b> Protects against 1 obstacle hit</div>
          <div className="powerup-item">🚀 <b>Double Jump:</b> Enables mid-air extra jump</div>
          <div className="powerup-item">💎 <b>Star Gem:</b> +50 bonus points</div>
        </div>
      </div>
    </div>
  );
};

export default ChromeDino;
