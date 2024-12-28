import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin_crud() {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
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
      setSelectedItems([]);  // Clear the selection after deletion
      setIsDeleteConfirmationVisible(false); // Close the delete confirmation
    } catch (error) {
      console.error("Error deleting projects:", error);
      alert("Failed to delete projects!");
    }
  };

  // Add a new project
  const [difficulty, setDifficulty] = useState("");
  const [projectType, setProjectType] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProject = async () => {
    if (!difficulty || !projectType || !idea) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/projects/add`, {
        difficulty,
        projectType,
        idea,
      });
      alert(response.data.message);
      setDifficulty("");
      setProjectType("");
      setIdea("");
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
    if (!editDifficulty || !editProjectType || !editIdea) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await axios.put(`${apiUrl}/projects/${editId}`, {
        difficulty: editDifficulty,
        projectType: editProjectType,
        idea: editIdea,
      });

      // Update data on frontend after successful edit
      setData(data.map(item => (item._id === editId ? { ...item, difficulty: editDifficulty, projectType: editProjectType, idea: editIdea } : item)));
      setIsEditVisible(false);
      setEditId("");
      setEditDifficulty("");
      setEditProjectType("");
      setEditIdea("");
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
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter your project idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  aria-label="Enter Project Idea"
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
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Project"}
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
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setEditDifficulty(e.target.value)}
                  value={editDifficulty}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Average">Average</option>
                  <option value="Geek">Geek</option>
                </select>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) => setEditProjectType(e.target.value)}
                  value={editProjectType}
                >
                  <option value="">Select Project Type</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Desktop App">Desktop App</option>
                </select>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter your project idea"
                  value={editIdea}
                  onChange={(e) => setEditIdea(e.target.value)}
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
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmationVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
              <h1 className="text-2xl font-bold mb-4">Delete Selected Projects</h1>
              <p>Are you sure you want to delete the selected projects?</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setIsDeleteConfirmationVisible(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProjects}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Table */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === data.length}
                  onChange={(e) =>
                    e.target.checked ? setSelectedItems(data.map((item) => item._id)) : setSelectedItems([])
                  }
                />
              </th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Project Type</th>
              <th className="px-6 py-4">Idea</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleCheckboxChange(item._id)}
                  />
                </td>
                <td className="px-6 py-4">{item.difficulty}</td>
                <td className="px-6 py-4">{item.projectType}</td>
                <td className="px-6 py-4">{item.idea}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setEditDifficulty(item.difficulty);
                      setEditProjectType(item.projectType);
                      setEditIdea(item.idea);
                      setIsEditVisible(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(item._id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
          <span className="mx-4">{currentPage}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin_crud;
