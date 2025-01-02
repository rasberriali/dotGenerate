const mongoose = require("mongoose");

// Define Project Schema
const projectSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true, // Mark as required
  },
  projectType: {
    type: String,
    required: true, // Mark as required
  },
  idea: {
    type: String,
    required: true, // Mark as required
  },
  description: {
    type: String,
    required: true, // Mark as required
  },
  technologies: {
    type: [String], // Array of technologies used in the project
    required: true,
  },
  references: {
    type: [String], // Array of project references
    required: true,
  },
});

// Create Model for Project
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
