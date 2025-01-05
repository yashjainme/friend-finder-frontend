import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";


function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Friend Finder</h1>
      
      {!isAuthenticated() && (
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Login
          </Link>
        </div>
      )}
      
      {isAuthenticated() && (
        <div className="flex space-x-4">
          {/* Add authenticated user content here */}
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;