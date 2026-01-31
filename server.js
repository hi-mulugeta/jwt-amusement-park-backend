const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5050;
const SECRET_KEY = "your_park_secret_key"; // In production, use environment variable

// Middleware - The Park Security
app.use(cors()); // Allows visitors from React town
app.use(express.json()); // Can read ID cards (JSON data)

// Database simulation - Park Membership Records
const users = [
  {
    id: 1,
    email: "visitor@park.com",
    password: "$2b$10$avEgQw/L5FRDs7zsz2SJCO93lgiPoA0FXvv3dSskwSSNRIpu1nXsO",
    role: "visitor",
  },
  {
    id: 2,
    email: "vip@park.com",
    password: "$2b$10$uHFoibqnN5lkzCscjvNAlOG.xJkO25oBviYxOELBZsbABMXuUW0cC",
    role: "vip",
  },
];

// Simulate password hashing
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Initialize with hashed passwords (run once)
//Password("password123").then(console.log);
//ashPassword("vipaccess").then(console.log);

// 1. LOGIN ENDPOINT - Get Your Wristband
app.post("/api/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  // Find member in records
  const user = users.find((u) => u.email === email);
  console.log("User found:", user ? user.email : "Not found");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check password (compare to stored hash)
  const validPassword = await bcrypt.compare(password, user.password);
  console.log("Password valid:", validPassword);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Issue wristband (JWT)
  const wristband = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1m" }, // Wristband expires in 2 hours
  );

  res.json({
    wristband,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

// 2. MIDDLEWARE - The Ride Attendant
const checkWristband = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer WRISTBAND_TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No wristband provided" });
  }

  try {
    // Verify wristband is authentic
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the ride
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired wristband" });
  }
};

// 3. AUTHORIZATION MIDDLEWARE - Check Wristband Color
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        message: `This ride requires ${role} wristband`,
      });
    }
    next();
  };
};

// PUBLIC RIDES - No wristband needed
app.get("/api/public-rides", (req, res) => {
  res.json(["Ferris Wheel", "Carousel", "Food Court"]);
});

// PROTECTED RIDES - Need any valid wristband
app.get("/api/protected-rides", checkWristband, (req, res) => {
  res.json(["Roller Coaster", "Haunted House", "Bumper Cars", "Co-opt"]);
});

// VIP RIDES - Need VIP wristband
app.get("/api/vip-rides", checkWristband, requireRole("vip"), (req, res) => {
  res.json([
    "Behind-the-Scenes Tour",
    "Express Lane Access",
    "VIP Lounge",
    "JWT Lounge",
  ]);
});

// 4. VERIFY ENDPOINT - Check if wristband is still valid
app.get("/api/verify", checkWristband, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`🎢 Amusement Park API running on port ${PORT}`);
});
