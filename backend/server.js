const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { ConfidentialClientApplication } = require("@azure/msal-node");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3001", 
  credentials: true // Must be true to send cookies
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

app.get("/auth/status", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
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
