import React, { useState } from 'react';
import axios from 'axios';

function Mainpage() {
  const [difficulty, setDifficulty] = useState('');
  const [projectType, setProjectType] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!difficulty || !projectType) {
      setError('Please select both difficulty and project type.');
      setIdeas([]);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/projects/random', {
        params: { difficulty, projectType },
      });

      if (response.data && response.data.idea) {
        setIdeas([response.data]);
      } else {
        setError('No project ideas found.');
        setIdeas([]);
      }
    } catch (err) {
      console.error('Error fetching project ideas:', err);
      setError('Failed to fetch project ideas.');
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-svh bg-black bg-grid-pattern bg-grid-size flex flex-col justify-center items-center font-mono xl:p-4 p-8 ">
     
        <h1 className="text-center xl:text-6xl text-3xl font-black bg-gradient-to-r from-green-600 to-violet-600 bg-clip-text text-transparent ">
          Developer Idea Project Generator
        </h1>
        <p className="text-center text-gray-400 text-sm xl:text-2xl mt-2 mb-6">
          Don’t know what project to do? Generate and Code!
        </p>
     

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 w-full max-w-4xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm text-gray-600 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">Select Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Geek">Geek</option>
            </select>
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm text-gray-600 mb-1">
              Project Type
            </label>
            <select
              id="projectType"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">Select Project Type</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Desktop">Desktop</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className={`w-full mt-6 py-2 text-white rounded-md flex justify-center items-center ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 100 8H4z"
              ></path>
            </svg>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      <div className="mt-8 bg-white p-4 text-center text-gray-500 shadow-lg rounded-lg w-full max-w-4xl">
        {error && <p className="text-red-500">{error}</p>}
        {!error && ideas.length > 0
          ? ideas.map((idea, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 shadow-md"
              >
                <p className="text-gray-800 font-semibold">{idea.idea}</p>
              </div>
            ))
          : !loading && <p>Your project ideas will show here</p>}
      </div>
      </div>
    
 
  );
}

export default Mainpage;