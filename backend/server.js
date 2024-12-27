const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Routes
app.use('/projects', projectRoutes);

// Add root route to check if server is working
app.get("/", (req, res) => {
  res.json("Backend is working!");
});

// Export a handler for Vercel
module.exports = (req, res) => app(req, res);
