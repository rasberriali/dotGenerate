const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const projectRoutes = require("./routes/projectRoutes");
require("dotenv").config(); // Ensure dotenv is at the top of the file

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// Set trust proxy to avoid X-Forwarded-For issues
app.set("trust proxy", 1);

// CORS Configuration
const allowedOrigins = [
  "https://dot-generate-frontend.vercel.app",
  "*",
];

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
    credentials: true,
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

// MongoDB connection with retry logic and detailed logging
const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  // Debug: Ensure we can see what MONGO_URI is being used
  console.log(
    "Environment Variables at Startup:",
    JSON.stringify(process.env, null, 2) // Prints available env vars during app initialization
  );

  if (!mongoUri) {
    console.error("MONGO_URI is not defined in the environment variables!");
    throw new Error(
      "Critical Error: MongoDB connection string is missing. Please verify Vercel env configuration."
    );
  }

  try {
    console.log("Attempting to connect to MongoDB with URI:", mongoUri);
    await mongoose.connect(mongoUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Successfully connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    console.error("Retrying MongoDB connection in 5 seconds...");
    setTimeout(() => connectToDatabase(), 5000); // Retry after 5 seconds
  }
};

// Initial database connection attempt
connectToDatabase().then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Backend is running on http://localhost:${port}`);
  });
});

// Handle favicon.ico requests
app.get("/favicon.ico", (req, res) => res.status(204).send());

// Test route for backend health check
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend is working!" });
});

// API Routes for projects
app.use("/projects", projectRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  console.log("404 Route not found:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});
