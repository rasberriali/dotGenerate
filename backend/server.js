const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const projectRoutes = require("./routes/projectRoutes");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", 
  "https://dot-generate-frontend.vercel.app"
];

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit requests per IP
});
app.use(limiter);

// Body parsing
app.use(express.json());

// MongoDB connection with detailed logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Add reconnection logic for MongoDB
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  mongoose.connect(process.env.MONGO_URI);
});

// Add a global error handler for logging errors
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// API Routes
app.use("/projects", projectRoutes);

// Root route for testing API server
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend is working!" });
});

// Route for undefined routes
app.use((req, res) => {
  console.log("404 Route not found:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
