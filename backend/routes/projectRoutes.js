const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Joi = require("joi");
const mongoose = require("mongoose");

// Validation schema using Joi
const projectSchema = Joi.object({
  difficulty: Joi.string().required(),
  projectType: Joi.string().required(),
  idea: Joi.string().required(),
});

// Validation middleware
const validateProject = (req, res, next) => {
  console.log("Incoming project data:", req.body); // Debug the data incoming
  const { error } = projectSchema.validate(req.body);
  if (error) {
    console.error("Validation Error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Seed database with sample projects
const sampleProjects = [
  { difficulty: "easy", projectType: "web", idea: "To-do App" },
  { difficulty: "medium", projectType: "web", idea: "E-commerce Platform" },
  { difficulty: "hard", projectType: "AI", idea: "Hand Sign Detection" },
];

router.get("/seed", async (req, res) => {
  console.log("Seeding database...");

  try {
    await Project.insertMany(sampleProjects);
    res.status(200).json({ message: "Sample projects added!" });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ error: "Error seeding database" });
  }
});

// Fetch projects based on filters
router.get("/", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ error: "Database not connected" });
  }

  const { difficulty, projectType } = req.query;
  console.log("Received query parameters:", req.query); // Debug

  try {
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (projectType) query.projectType = projectType;

    const startTime = Date.now();
    const projects = await Project.find(query);
    const endTime = Date.now();
    console.log(`Query execution time: ${endTime - startTime} ms`);

    if (!projects.length) {
      return res.status(200).json({ message: "No projects found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add a new project with validation
router.post("/add", validateProject, async (req, res) => {
  const { difficulty, projectType, idea } = req.body;
  console.log("Adding new project:", req.body); // Debug

  try {
    const newProject = new Project({ difficulty, projectType, idea });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});

// Fetch a random project based on filters
router.get("/random", async (req, res) => {
  const { difficulty, projectType } = req.query;
  console.log("Random project request with filters:", req.query); // Debug

  try {
    const query = {};
    if (difficulty) query.difficulty = { $regex: difficulty, $options: "i" };
    if (projectType) query.projectType = { $regex: projectType, $options: "i" };

    const projects = await Project.find(query);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    res.status(200).json(randomProject);
  } catch (error) {
    console.error("Error fetching random project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Delete request for project ID:", id); // Debug

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Update a project
router.put("/:id", validateProject, async (req, res) => {
  const { id } = req.params;
  const { difficulty, projectType, idea } = req.body;

  console.log("Update request for project ID:", id, "with data:", req.body); // Debug

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { difficulty, projectType, idea },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

module.exports = router;
