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

// MongoDB connection with logging and reconnecting
const connectToDatabase = () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 10000 })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB Atlas:", err);
      setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
    });
};

connectToDatabase();

// Reconnection logic for MongoDB
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  connectToDatabase();
});

// Debug route for backend testing
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend is working!" });
});

// API Routes for projects
app.use("/projects", projectRoutes);

// Route for undefined routes (404 handler)
app.use((req, res) => {
  console.log("404 Route not found:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

// Global error handler for debugging
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server and log successful deployment
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
