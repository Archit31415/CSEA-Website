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

app.get("/auth/status", (req, res) => {
  if (req.session.user) {
    res.json({ 
      isAuthenticated: true, 
      user: req.session.user,
      userName: req.session.userName || "IITG Student"
    });
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

app.post("/api/scores", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  const { game, score } = req.body;
  if (!game || score === undefined) {
    return res.status(400).json({ success: false, error: "Game and score are required." });
  }
  if (!["math", "dino", "marketmaker"].includes(game)) {
    return res.status(400).json({ success: false, error: "Invalid game key." });
  }
  
  const scoreVal = parseInt(score, 10);
  
  try {
    const user = await User.findOne({ email: req.session.user });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    
    const currentHighScore = user.scores[game] || 0;
    
    if (scoreVal > currentHighScore) {
      user.scores[game] = scoreVal;
      await user.save();
      return res.json({ success: true, message: "High score updated!", scores: user.scores });
    }
    
    res.json({ success: true, message: "Score submitted, no update needed.", scores: user.scores });
  } catch (err) {
    console.error("Save score error:", err);
    res.status(500).json({ success: false, error: "Failed to submit score." });
  }
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
