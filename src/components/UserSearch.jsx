

import React, { useState } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';

function UserSearch({ onSendRequest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const token = getToken();
      const response = await api.get(`/users/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Search Users</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 mt-2 md:mt-0"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {searchResults.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {searchResults.map((user) => (
            <li key={user._id} className="py-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1">
                  <span className="block">{user.username}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
                <button
                  onClick={() => onSendRequest(user._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2 md:mt-0"
                >
                  Add Friend
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserSearch;
