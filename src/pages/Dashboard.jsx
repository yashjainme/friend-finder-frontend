
import React, { useState, useEffect } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';
import UserSearch from '../components/UserSearch';

function Dashboard() {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sentRequests, setSentRequests] = useState(new Set());

  const fetchData = async () => {
    try {
      const token = getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [friendsRes, recommendationsRes] = await Promise.all([
        api.get('/friends', config),
        api.get('/friends/recommendations', config),
      ]);
      
      setFriends(friendsRes.data.friends);
      setFriendRequests(friendsRes.data.friendRequests);
      setRecommendations(recommendationsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
      // Hide the error after 1.5 seconds
      setTimeout(() => setError(''), 1500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendRequest = async (userId) => {
    if (sentRequests.has(userId)) {
      return;
    }

    try {
      const token = getToken();
      await api.post('/friends/request', 
        { friendId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSentRequests((prev) => new Set(prev).add(userId));
      setSuccessMessage('Friend request sent successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
      
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
      // Hide the error after 1.5 seconds
      setTimeout(() => setError(''), 1500);
    }
  };

  const handleRespondToRequest = async (requestId, accept) => {
    try {
      const token = getToken();
      await api.post('/friends/respond',
        { requestId, accept },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to respond to request');
      setTimeout(() => setError(''), 1500);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = getToken();
      await api.delete(`/friends/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove friend');
      setTimeout(() => setError(''), 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && !sentRequests.has(recommendations._id) && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <UserSearch onSendRequest={handleSendRequest} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Friend Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p className="text-gray-500">No pending requests</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {friendRequests.map((request) => (
                <li key={request._id} className="py-4">
                  <div className="flex items-center justify-between">
                    <span>{request.from.username}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleRespondToRequest(request._id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToRequest(request._id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Friends Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends yet</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {friends.map((friend) => (
                <li key={friend._id} className="py-4">
                  <div className="flex items-center justify-between">
                    <span>{friend.username}</span>
                    <button
                      onClick={() => handleRemoveFriend(friend._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recommended Friends</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-500">No recommendations available</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recommendations.map((recommendation) => (
                <li key={recommendation._id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block">{recommendation.username}</span>
                      <span className="text-sm text-gray-500">
                        {recommendation.mutualFriendCount} mutual friends
                      </span>
                    </div>
                    <button
                      onClick={() => handleSendRequest(recommendation._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Add Friend
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
