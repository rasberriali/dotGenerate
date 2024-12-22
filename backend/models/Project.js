const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  difficulty: String,
  projectType: String,
  idea: String,
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
