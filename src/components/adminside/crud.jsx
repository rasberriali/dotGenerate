import React, { useState } from 'react';
import axios from 'axios';

function Crud() {
  const [difficulty, setDifficulty] = useState("");
  const [projectType, setProjectType] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleAddProject = async () => {
    if (!difficulty || !projectType || !idea) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true); // Set loading state to true before making the request

    try {
      const response = await axios.post("http://localhost:3001/projects/add", {
        difficulty,
        projectType,
        idea,
      });
      alert(response.data.message);
      // Clear form after successful submission
      setDifficulty("");
      setProjectType("");
      setIdea("");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project!");
    } finally {
      setLoading(false); // Set loading state back to false after the request
    }
  };  
  


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
        <div className="space-y-4">
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Select Difficulty"
          >
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Average">Average</option>
            <option value="Geek">Geek</option>
          </select>

          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setProjectType(e.target.value)}
            aria-label="Select Project Type"
          >
            <option value="">Select Project Type</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Desktop App">Desktop App</option>
          </select>

          <input
            type="text"
            placeholder="Project Title"
            className="w-full p-2 border rounded"
            onChange={(e) => setIdea(e.target.value)}
            value={idea}
            aria-label="Project Title"
          />

          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={handleAddProject}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Adding Project..." : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Crud;



