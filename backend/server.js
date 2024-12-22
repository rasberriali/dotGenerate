const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const projectRoutes = require("./routes/projectRoutes"); 

// Initialize app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Project");


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.use("/projects", projectRoutes); 



// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
