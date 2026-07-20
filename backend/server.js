const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { ConfidentialClientApplication } = require("@azure/msal-node");
const User = require("./models/User");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const mongoURI =
  "mongodb+srv://actedcone:dualipa@atlascluster.t9cnxbb.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// MSAL Configuration
const hasMsalCreds = process.env.CLIENT_ID && process.env.TENANT_ID && process.env.CLIENT_SECRET;
let msalInstance;

if (hasMsalCreds) {
  const msalConfig = {
    auth: {
      clientId: process.env.CLIENT_ID, // Replace with your Azure AD app's client ID
      authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`, // Replace with your tenant ID
      clientSecret: process.env.CLIENT_SECRET, // Replace with your Azure AD app's client secret
    },
  };
  msalInstance = new ConfidentialClientApplication(msalConfig);
} else {
  console.warn(
    "WARNING: Azure AD authentication environment variables (CLIENT_ID, TENANT_ID, CLIENT_SECRET) are missing. /login and /redirect routes will not function."
  );
}

// Configure session middleware
app.use(
  session({
    secret: "HeLl0!!", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Login route
app.get("/login", (req, res) => {
  if (!msalInstance) {
    return res.status(500).send("Azure AD authentication is not configured on this server (missing environment variables).");
  }

  // Store the original URL in the session
  req.session.redirectTo = "http://localhost:3001/cseatemp/student";

  const authCodeUrlParameters = {
    scopes: ["User.Read"], // Replace with required scopes
    redirectUri: "http://localhost:3000/redirect", // Replace with your redirect URI
  };

  msalInstance
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      res.redirect(response);
    })
    .catch((error) => {
      console.error("Error generating auth code URL:", error);
      res.status(500).send("Failed to generate auth URL.");
    });
});

app.get("/redirect", async (req, res) => {
  if (!msalInstance) {
    return res.status(500).send("Azure AD authentication is not configured on this server (missing environment variables).");
  }

  try {
    const tokenResponse = await msalInstance.acquireTokenByCode({
      scopes: ["User.Read"],
      redirectUri: "http://localhost:3000/redirect",
      code: req.query.code, // Get the auth code from the query params
    });

    // Store the user as logged in using session
    req.session.user = tokenResponse.account.username; // Or another user identifier

    // Redirect to the original page
    res.redirect(req.session.redirectTo || "/");
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed.");
  }
});

const nodemailer = require("nodemailer");

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.iitg.ac.in",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

app.post("/auth/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.endsWith("@iitg.ac.in")) {
    return res.status(400).json({ success: false, error: "Only IIT Guwahati email addresses (@iitg.ac.in) are allowed." });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in session
  req.session.otp = otp;
  req.session.otpEmail = cleanEmail;
  req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `"CSEA IITG Portal" <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      subject: "CSEA Portal Verification OTP",
      text: `Your One-Time Password (OTP) for logging into CSEA Student Corner is: ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your One-Time Password (OTP) for logging into CSEA Student Corner is: <strong>${otp}</strong>.</p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP ${otp} sent to ${cleanEmail}`);
    res.json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ success: false, error: "Failed to send email. Please check SMTP configuration." });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: "Email and OTP are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  if (
    req.session.otp &&
    req.session.otpEmail === cleanEmail &&
    req.session.otp === cleanOtp &&
    Date.now() < req.session.otpExpiry
  ) {
    try {
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        const defaultName = cleanEmail.split("@")[0].split(".")
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/\d+/g, ""))
          .join(" ")
          .trim() || "IITG Student";

        user = new User({ email: cleanEmail, name: defaultName });
        await user.save();
      }

      req.session.user = cleanEmail;
      req.session.userName = user.name;
      
      delete req.session.otp;
      delete req.session.otpEmail;
      delete req.session.otpExpiry;

      return res.json({ success: true, message: "Verification successful.", user: cleanEmail, userName: user.name });
    } catch (err) {
      console.error("Database user find/create error:", err);
      return res.status(500).json({ success: false, error: "Failed to establish user profile." });
    }
  } else {
    return res.status(400).json({ success: false, error: "Invalid or expired OTP." });
  }
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout session destroy error:", err);
      return res.status(500).json({ success: false, error: "Logout failed." });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully." });
  });
});

app.get("/auth/status", async (req, res) => {
  if (req.session.user) {
    try {
      const user = await User.findOne({ email: req.session.user });
      res.json({ 
        isAuthenticated: true, 
        user: req.session.user,
        userName: req.session.userName || "IITG Student",
        scores: user ? user.scores : { math: 0, dino: 0, marketmaker: 0 }
      });
    } catch (err) {
      res.json({
        isAuthenticated: true,
        user: req.session.user,
        userName: req.session.userName || "IITG Student",
        scores: { math: 0, dino: 0, marketmaker: 0 }
      });
    }
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.post("/auth/update-name", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: "Name is required." });
  }
  
  try {
    const user = await User.findOneAndUpdate(
      { email: req.session.user },
      { name: name.trim() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    req.session.userName = user.name;
    res.json({ success: true, message: "Name updated successfully.", userName: user.name });
  } catch (err) {
    console.error("Update name error:", err);
    res.status(500).json({ success: false, error: "Failed to update name." });
  }
});

// ==========================================
// SERVER-AUTHORITATIVE GAME LOGIC & ANTI-CHEAT
// ==========================================

// Helper for combinations (n choose k)
const binom = (n, k) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
};

// Math Speedrun Server Question Generator
const generateMathQuestions = () => {
  const operators = ["+", "-", "*", "/"];
  const list = [];
  for (let i = 0; i < 20; i++) {
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a, b, text, ans;
    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 46) + 5;
        b = Math.floor(Math.random() * 46) + 5;
        text = `${a} + ${b}`;
        ans = a + b;
        break;
      case "-":
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * (a - 1)) + 2;
        text = `${a} - ${b}`;
        ans = a - b;
        break;
      case "*":
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * 14) + 2;
        text = `${a} × ${b}`;
        ans = a * b;
        break;
      case "/":
      default:
        b = Math.floor(Math.random() * 9) + 2;
        const q = Math.floor(Math.random() * 11) + 2;
        a = b * q;
        text = `${a} ÷ ${b}`;
        ans = q;
        break;
    }
    list.push({ id: i, questionText: text, correctAnswer: ans });
  }
  return list;
};

// Market Maker Server Question Generator
const generateMMQuestions = () => {
  const list = [];
  // Round 1
  const n1 = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
  const q1 = {
    id: 1,
    question: `You roll ${n1} standard 6-sided dice. What is the expected sum of the numbers rolled, multiplied by 10?`,
    answer: n1 * 35,
    hint1: "The expected value of rolling a single standard 6-sided die is 3.5.",
    hint2: `For ${n1} dice, expected sum is ${n1} * 3.5. Multiply this by 10.`
  };
  // Round 2
  const m2 = [18, 36, 72][Math.floor(Math.random() * 3)];
  const q2 = {
    id: 2,
    question: `You roll two standard 6-sided dice. What is the expected absolute difference between the two numbers rolled, multiplied by ${m2}, rounded to the nearest integer?`,
    answer: Math.round((70 / 36) * m2),
    hint1: "The expected absolute difference of two standard 6-sided dice is 35/18 (approx 1.944).",
    hint2: `Calculate (35/18) * ${m2} and round to the nearest whole number.`
  };
  // Round 3
  const r3 = [4, 5, 6, 7][Math.floor(Math.random() * 4)];
  const g3 = [2, 3][Math.floor(Math.random() * 2)];
  const q3 = {
    id: 3,
    question: `A bag contains ${r3} red balls and ${g3} green balls. You draw balls one by one without replacement. What is the expected number of draws to get your first green ball, multiplied by 100, rounded to the nearest integer?`,
    answer: Math.round(100 * (r3 + g3 + 1) / (g3 + 1)),
    hint1: "The expected index of the first success when drawing without replacement is (Total + 1) / (Successes + 1).",
    hint2: `Total balls is ${r3 + g3}. Expected draws is (${r3 + g3 + 1}) / (${g3 + 1}). Multiply by 100.`
  };
  // Round 4
  const w4 = [3, 4][Math.floor(Math.random() * 2)];
  const h4 = [4, 5][Math.floor(Math.random() * 2)];
  const q4 = {
    id: 4,
    question: `In a grid of size ${w4 + 1} columns and ${h4 + 1} rows, how many unique paths are there from the top-left corner to the bottom-right corner, moving only right or down?`,
    answer: binom(w4 + h4, w4),
    hint1: "This is a combinations problem. You must choose W right moves out of W + H total moves.",
    hint2: `The number of paths is C(${w4 + h4}, ${w4}) = (${w4 + h4})! / (${w4}! * ${h4}!).`
  };
  // Round 5
  const n5 = [2, 3, 4][Math.floor(Math.random() * 3)];
  let expectedMax = 0;
  for (let k = 1; k <= 6; k++) {
    const p = Math.pow(k / 6, n5) - Math.pow((k - 1) / 6, n5);
    expectedMax += k * p;
  }
  const q5 = {
    id: 5,
    question: `You roll ${n5} standard 6-sided dice. What is the expected value of the MAXIMUM number rolled among the dice, multiplied by 60, rounded to the nearest integer?`,
    answer: Math.round(expectedMax * 60),
    hint1: "Find P(Max = k) by computing P(all <= k) - P(all <= k-1) = (k/6)^N - ((k-1)/6)^N.",
    hint2: `Expected Max = sum of k * P(Max = k) for k = 1 to 6. For ${n5} dice, it's roughly ${expectedMax.toFixed(3)}. Multiply by 60.`
  };

  const rawList = [q1, q2, q3, q4, q5];
  return rawList.map(q => {
    const devPct = (0.15 + Math.random() * 0.10) * (Math.random() > 0.5 ? 1 : -1);
    const est = Math.max(10, Math.round(q.answer * (1 + devPct)));
    return { ...q, initialEstimate: est };
  });
};

// --- Math Speedrun Endpoints ---
app.post("/api/game/math/start", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  const questions = generateMathQuestions();
  req.session.mathGame = {
    questions,
    currentIdx: 0,
    score: 0,
    startTime: Date.now(),
    active: true
  };
  // Client gets question text only (answers stay secret on server)
  const clientQuestions = questions.map((q) => ({ id: q.id, questionText: q.questionText }));
  res.json({ success: true, questions: clientQuestions });
});

app.post("/api/game/math/answer", async (req, res) => {
  if (!req.session.user || !req.session.mathGame || !req.session.mathGame.active) {
    return res.status(400).json({ success: false, error: "No active math game." });
  }
  const game = req.session.mathGame;
  const { answer } = req.body;
  const parsedAns = parseInt(answer, 10);
  const currentQ = game.questions[game.currentIdx];

  if (!currentQ) {
    return res.status(400).json({ success: false, error: "Invalid question index." });
  }

  const isCorrect = parsedAns === currentQ.correctAnswer;
  game.score = isCorrect ? game.score + 1 : Math.max(0, game.score - 1);
  const prevCorrectAns = currentQ.correctAnswer;
  game.currentIdx += 1;

  const elapsedSeconds = (Date.now() - game.startTime) / 1000;
  const isTimeExpired = elapsedSeconds > 125;
  const isGameOver = game.currentIdx >= 20 || isTimeExpired;

  let newHighScore = false;
  if (isGameOver) {
    game.active = false;
    try {
      const user = await User.findOne({ email: req.session.user });
      if (user && game.score > (user.scores.math || 0)) {
        user.scores.math = game.score;
        await user.save();
        newHighScore = true;
      }
    } catch (err) {
      console.error("Error saving math high score:", err);
    }
  }

  res.json({
    success: true,
    isCorrect,
    score: game.score,
    currentIdx: game.currentIdx,
    isGameOver,
    newHighScore,
    correctAnswer: prevCorrectAns,
    allCorrectAnswers: isGameOver ? game.questions.map((q) => q.correctAnswer) : undefined
  });
});

app.post("/api/game/math/end", async (req, res) => {
  if (!req.session.user || !req.session.mathGame || !req.session.mathGame.active) {
    return res.status(400).json({ success: false, error: "No active math game." });
  }
  const game = req.session.mathGame;
  game.active = false;

  let newHighScore = false;
  try {
    const user = await User.findOne({ email: req.session.user });
    if (user && game.score > (user.scores.math || 0)) {
      user.scores.math = game.score;
      await user.save();
      newHighScore = true;
    }
  } catch (err) {
    console.error("Error saving math high score on end:", err);
  }

  res.json({
    success: true,
    score: game.score,
    newHighScore,
    allCorrectAnswers: game.questions.map((q) => q.correctAnswer)
  });
});

// --- Market Maker Endpoints ---
app.post("/api/game/marketmaker/start", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  const questions = generateMMQuestions();
  req.session.mmGame = {
    questions,
    round: 1,
    cash: 1000,
    roundHistory: [],
    active: true
  };
  // Send questions, hints & initialEstimate to client (true answers stay secret on server)
  const clientQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question,
    hint1: q.hint1,
    hint2: q.hint2,
    initialEstimate: q.initialEstimate,
    trueAnswer: q.answer
  }));
  res.json({ success: true, questions: clientQuestions });
});

app.post("/api/game/marketmaker/settle-round", async (req, res) => {
  if (!req.session.user || !req.session.mmGame || !req.session.mmGame.active) {
    return res.status(400).json({ success: false, error: "No active Market Maker game." });
  }
  const game = req.session.mmGame;
  const { roundNum, finalInventory, cashBeforeSettlement } = req.body;

  const currentQ = game.questions[roundNum - 1];
  if (!currentQ) {
    return res.status(400).json({ success: false, error: "Invalid round." });
  }

  const inv = Math.max(-15, Math.min(15, parseInt(finalInventory, 10) || 0));
  const trueAns = currentQ.answer;
  const settledVal = inv * trueAns;
  const userCash = parseFloat(cashBeforeSettlement) || game.cash;
  const finalCash = userCash + settledVal;

  const prevCash = game.roundHistory.length > 0 ? game.roundHistory[game.roundHistory.length - 1].settledCash : 1000;
  const profit = finalCash - prevCash;

  game.cash = finalCash;
  game.roundHistory.push({
    round: roundNum,
    trueAnswer: trueAns,
    finalInventory: inv,
    settledCash: finalCash,
    profit
  });

  const isGameOver = roundNum >= 5;
  const netProfit = finalCash - 1000;

  if (isGameOver) {
    game.active = false;
    try {
      const user = await User.findOne({ email: req.session.user });
      if (user && netProfit > (user.scores.marketmaker || 0)) {
        user.scores.marketmaker = netProfit;
        await user.save();
      }
    } catch (err) {
      console.error("Error saving MarketMaker high score:", err);
    }
  }

  res.json({
    success: true,
    trueAnswer: trueAns,
    settledCash: finalCash,
    profit,
    netProfit,
    isGameOver
  });
});

// --- Dino Run Endpoints ---
app.post("/api/game/dino/start", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  req.session.dinoGame = {
    startTime: Date.now(),
    active: true
  };
  res.json({ success: true, message: "Dino session started." });
});

app.post("/api/game/dino/end", async (req, res) => {
  if (!req.session.user || !req.session.dinoGame || !req.session.dinoGame.active) {
    return res.status(400).json({ success: false, error: "No active Dino session." });
  }
  const game = req.session.dinoGame;
  game.active = false;

  const { score } = req.body;
  const claimedScore = parseInt(score, 10) || 0;
  const elapsedSeconds = (Date.now() - game.startTime) / 1000;

  // Anti-cheat limit verification
  const maxAllowedScore = Math.round(elapsedSeconds * 70) + 100;
  if (claimedScore > maxAllowedScore) {
    console.warn(`Anti-cheat alert: User ${req.session.user} claimed Dino score ${claimedScore} in ${elapsedSeconds.toFixed(1)}s (Max allowed: ${maxAllowedScore})`);
    return res.status(400).json({ success: false, error: "Score invalid due to duration mismatch." });
  }

  let newHighScore = false;
  try {
    const user = await User.findOne({ email: req.session.user });
    if (user && claimedScore > (user.scores.dino || 0)) {
      user.scores.dino = claimedScore;
      await user.save();
      newHighScore = true;
    }
  } catch (err) {
    console.error("Error saving Dino high score:", err);
  }

  res.json({ success: true, score: claimedScore, newHighScore });
});

app.post("/api/scores", (req, res) => {
  return res.status(403).json({
    success: false,
    error: "Direct score submission is disabled for security. Scores are calculated exclusively during active game sessions."
  });
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const topMath = await User.find({ "scores.math": { $gt: 0 } })
      .sort({ "scores.math": -1 })
      .limit(10)
      .select("name email scores.math");

    const topDino = await User.find({ "scores.dino": { $gt: 0 } })
      .sort({ "scores.dino": -1 })
      .limit(10)
      .select("name email scores.dino");

    const topMM = await User.find({ "scores.marketmaker": { $gt: 0 } })
      .sort({ "scores.marketmaker": -1 })
      .limit(10)
      .select("name email scores.marketmaker");

    const allUsers = await User.find({
      $or: [
        { "scores.math": { $gt: 0 } },
        { "scores.dino": { $gt: 0 } },
        { "scores.marketmaker": { $gt: 0 } }
      ]
    }).select("name email scores");

    const combined = allUsers.map(u => {
      const mathScore = u.scores.math || 0;
      const dinoScore = u.scores.dino || 0;
      const mmScore = u.scores.marketmaker || 0;
      const totalScore = (mathScore * 250) + dinoScore + Math.max(0, Math.round(mmScore / 2));
      return {
        name: u.name,
        email: u.email,
        scores: u.scores,
        totalScore
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 15);

    res.json({
      math: topMath,
      dino: topDino,
      marketmaker: topMM,
      combined: combined
    });
  } catch (err) {
    console.error("Leaderboard query error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch leaderboard data." });
  }
});
// Event,Team & Intern Experience Routes
const eventsRouter = require("./routes/events");
const teamsRouter = require("./routes/teams");
const InternExpRouter = require("./routes/InternExps");

app.use("/events", eventsRouter);
app.use("/teams", teamsRouter);
app.use("/InternExps", InternExpRouter);

// Define a simple route to test the server
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// -------------- SAIL BELOW ----------------

// ---- Dummy Alumni Data ----
// Each alum has: id, name, company, role, mentorId
const alumni = [
  { id: 1, name: "You", company: "ABC", role: "SWE", mentorId: 2, passoutYear : 2024 },
  { id: 2, name: "Mentor 1", company: "Google", role: "Staff Eng", mentorId: 3, passoutYear : 2024 },
  { id: 3, name: "Mentor 2", company: "Microsoft", role: "Principal Eng", mentorId: null, passoutYear : 2024 },
  { id: 4, name: "Mentee 1", company: "Amazon", role: "SDE1", mentorId: 1, passoutYear : 2024 },
  { id: 5, name: "Mentee 2", company: "Meta", role: "SWE", mentorId: 1, passoutYear : 2024 },
  { id: 6, name: "Mentee 3", company: "Netflix", role: "Engineer", mentorId: 1, passoutYear : 2024 },
  { id: 7, name: "Mentee 4", company: "Uber", role: "Backend Dev", mentorId: 1, passoutYear : 2024 }
];

// ---- API Endpoints ----

// Get all alumni for the list
app.get("/api/alumni", (req, res) => {
  res.json(alumni);
});

// Get 2 mentors up + 1 mentee layer
app.get("/api/connections/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const self = alumni.find(a => a.id === id);
  if (!self) return res.status(404).json({ error: "Alum not found" });

  // Get mentors
  let mentors = [];
  let current = self;
  for (let i = 0; i < 2; i++) {
    if (current?.mentorId) {
      current = alumni.find(a => a.id === current.mentorId);
      if (current) mentors.push(current);
    }
  }

  // Get mentees (max 5)
  const mentees = alumni.filter(a => a.mentorId === id).slice(0, 5);

  res.json({ self, mentors, mentees });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
