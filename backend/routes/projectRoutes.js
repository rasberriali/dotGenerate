const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Joi = require("joi");

// Validation schema using Joi
const projectSchema = Joi.object({
  difficulty: Joi.string().required(),
  projectType: Joi.string().required(),
  idea: Joi.string().required(),
});

// Validation middleware
const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

// Seed database with sample projects
const sampleProjects = [
  { difficulty: "easy", projectType: "web", idea: "To-do App" },
  { difficulty: "medium", projectType: "web", idea: "E-commerce Platform" },
  { difficulty: "hard", projectType: "AI", idea: "Hand Sign Detection" },
];

router.get("/seed", async (req, res) => {
  try {
    await Project.insertMany(sampleProjects);
    res.status(200).json({ message: "Sample projects added!" });
  } catch (error) {
    res.status(500).json({ error: "Error seeding database" });
  }
});

// Fetch projects based on filters
router.get("/", async (req, res) => {
  const { difficulty, projectType } = req.query;

  try {
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (projectType) query.projectType = projectType;

    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add a new project with validation
router.post("/add", validateProject, async (req, res) => {
  const { difficulty, projectType, idea } = req.body;

  try {
    const newProject = new Project({ difficulty, projectType, idea });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add project" });
  }
});

// Fetch a random project based on filters
router.get("/random", async (req, res) => {
  const { difficulty, projectType } = req.query;

  try {
    const query = {};
    if (difficulty) query.difficulty = { $regex: difficulty, $options: "i" };
    if (projectType) query.projectType = { $regex: projectType, $options: "i" };

    const projects = await Project.find(query);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found!" });
    }

    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    res.status(200).json(randomProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully!" });

  } catch (error) {
    
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Update a project
router.put("/:id", validateProject, async (req, res) => {
  const { id } = req.params;
  const { difficulty, projectType, idea } = req.body;
  
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
    
    res.status(500).json({ error: "Failed to update project" });
  }
});module.exports = router;
