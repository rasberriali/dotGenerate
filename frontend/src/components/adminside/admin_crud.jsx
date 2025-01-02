import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin_crud() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3002";
  console.log(apiUrl);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [isAddIdeaVisible, setIsAddIdeaVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for editing
  const [editId, setEditId] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("");
  const [editProjectType, setEditProjectType] = useState("");
  const [editIdea, setEditIdea] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTechnologies, setEditTechnologies] = useState("");
  const [editReferences, setEditReferences] = useState("");

  const [difficulty, setDifficulty] = useState("");
  const [projectType, setProjectType] = useState("");
  const [idea, setIdea] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [references, setReferences] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projects`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch projects!");
      }
    };

    fetchProjects();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Delete selected projects
  const deleteProjects = async () => {
    try {
      for (const id of selectedItems) {
        await axios.delete(`${apiUrl}/projects/${id}`);
      }
      setData(data.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]); // Clear the selection after deletion
      setIsDeleteConfirmationVisible(false); // Close the delete confirmation
    } catch (error) {
      console.error("Error deleting projects:", error);
      alert("Failed to delete projects!");
    }
  };

  // Add a new project
  const handleAddProject = async () => {
    if (!difficulty || !projectType || !idea || !description || !technologies || !references) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/projects/add`, {
        difficulty,
        projectType,
        idea,
        description,
        technologies,
        references,
      });
      alert(response.data.message);
      setDifficulty("");
      setProjectType("");
      setIdea("");
      setDescription("");
      setTechnologies("");
      setReferences("");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project!");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddIdea = () => {
    setIsAddIdeaVisible(false);
  };

  // Edit project modal
  const handleEditProject = async () => {
    if (!editDifficulty || !editProjectType || !editIdea || !editDescription || !editTechnologies || !editReferences) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await axios.put(`${apiUrl}/projects/${editId}`, {
        difficulty: editDifficulty,
        projectType: editProjectType,
        idea: editIdea,
        description: editDescription,
        technologies: editTechnologies,
        references: editReferences,
      });

      // Update data on frontend after successful edit
      setData(data.map(item => (item._id === editId ? {
        ...item,
        difficulty: editDifficulty,
        projectType: editProjectType,
        idea: editIdea,
        description: editDescription,
        technologies: editTechnologies,
        references: editReferences
      } : item)));
      setIsEditVisible(false);
      setEditId("");
      setEditDifficulty("");
      setEditProjectType("");
      setEditIdea("");
      setEditDescription("");
      setEditTechnologies("");
      setEditReferences("");
    } catch (error) {
      console.error("Error editing project:", error);
      alert("Failed to edit project!");
    }
  };

  // Delete individual project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${apiUrl}/projects/${id}`);
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project!");
    }
  };

  // Handle page refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-500 p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between gap-4 mb-6">
          <div
            className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-teal-500 hover:to-green-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => setIsAddIdeaVisible(true)}
          >
            Add Idea
          </div>

          <div
            className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={() => setIsDeleteConfirmationVisible(true)}
          >
            Delete Selected
          </div>

          {/* Refresh Button */}
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleRefresh}
          >
            Refresh
          </div>
        </div>

        {/* Add Idea Modal */}
        {isAddIdeaVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
              <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
              <div className="space-y-4">
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setDifficulty(e.target.value)}
                  value={difficulty}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Average">Average</option>
                  <option value="Geek">Geek</option>
                </select>

                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setProjectType(e.target.value)}
                  value={projectType}
                >
                  <option value="">Select Project Type</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Desktop App">Desktop App</option>
                </select>

                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter your project idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />

                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter technologies to use"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                />

                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter references (if any)"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={handleCloseAddIdea}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleAddProject}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {isEditVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
              <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
              <div className="space-y-4">
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Edit Project Idea"
                  value={editIdea}
                  onChange={(e) => setEditIdea(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Edit Project Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Edit Technologies"
                  value={editTechnologies}
                  onChange={(e) => setEditTechnologies(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Edit References"
                  value={editReferences}
                  onChange={(e) => setEditReferences(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setIsEditVisible(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleEditProject}
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(data.map((item) => item._id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Idea</th>
                <th className="border px-4 py-2">Project Type</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Technologies</th>
                <th className="border px-4 py-2">References</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{item._id}</td>
                  <td className="border px-4 py-2">{item.idea}</td>
                  <td className="border px-4 py-2">{item.projectType}</td>
                  <td className="border px-4 py-2">{item.difficulty}</td>
                  <td className="border px-4 py-2">{item.description}</td>
                  <td className="border px-4 py-2">{item.technologies}</td>
                  <td className="border px-4 py-2">{item.references}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setIsEditVisible(true);
                        setEditId(item._id);
                        setEditDifficulty(item.difficulty);
                        setEditProjectType(item.projectType);
                        setEditIdea(item.idea);
                        setEditDescription(item.description);
                        setEditTechnologies(item.technologies);
                        setEditReferences(item.references);
                      }}
                      className="bg-yellow-500 text-white py-1 px-4 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(item._id)}
                      className="bg-red-500 text-white py-1 px-4 rounded-md ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-center mt-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin_crud;
