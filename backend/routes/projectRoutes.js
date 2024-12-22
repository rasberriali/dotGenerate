const express = require("express");
const router = express.Router();
const Project = require("../models/Project");


// Seed database with sample projects
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
// Add a new project
router.post("/add", async (req, res) => {
  const { difficulty, projectType, idea } = req.body;

  if (!difficulty || !projectType || !idea) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const newProject = new Project({ difficulty, projectType, idea });
    await newProject.save();
    res.status(201).json({ message: "Project added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add project" });
  }
});

router.get('/random', async (req, res) => {
  const { difficulty, projectType } = req.query;

  try {
    const query = {};
    if (difficulty) query.difficulty = { $regex: difficulty, $options: "i" };
    if (projectType) query.projectType = { $regex: projectType, $options: "i" };

    const projects = await Project.find(query);

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found!' });
    }

    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    res.status(200).json(randomProject);
  } catch (error) {
    console.error('Error fetching random project:', error);
    res.status(500).json({ error: 'Failed to fetch project' }); 
  }
});

const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the provided id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

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

// Edit a project
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { difficulty, projectType, idea } = req.body;

  // Validate incoming data
  if (!difficulty || !projectType || !idea) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { difficulty, projectType, idea },
      { new: true }  // This will return the updated document
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(updatedProject);  // Return the updated project
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});







module.exports = router;
