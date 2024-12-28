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

const allowedOrigins = [
  "http://localhost:5173", // Local development URL
  "https://dot-generate-frontend.vercel.app"
];

// CORS configuration (only one block needed)
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
    credentials: true, // Allow credentials like cookies, authorization headers
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Body parsing
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
  mongoose.connect(process.env.MONGO_URI);
});

// Routes
app.use("/projects", projectRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend is working!" });
});

// Unknown route handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Port configuration
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
