import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import { Friend, FriendRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const FriendsPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        userAPI.getFriends(),
        userAPI.getFriendRequests(),
      ]);
      setFriends(friendsData);
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Failed to load friends data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      toast.error('Please enter at least 2 characters');
      return;
    }

    try {
      const results = await userAPI.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    }
  };

  const handleAddFriend = async (username: string) => {
    try {
      await userAPI.addFriend(username);
      toast.success('Friend request sent!');
      setSearchResults([]);
      setSearchQuery('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await userAPI.acceptFriendRequest(requestId);
      toast.success('Friend request accepted!');
      loadFriendsData();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-glow-purple mb-8">Friends</h1>

        {/* Search */}
        <div className="glass-card mb-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Add Friends</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by username..."
              className="flex-1 px-4 py-3 glass rounded-xl focus:outline-none focus:border-neon-purple"
            />
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((user) => (
                <div key={user._id} className="glass p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                    <span className="text-text-primary">{user.username}</span>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.username)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="glass-card mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Friend Requests</h2>
            <div className="space-y-3">
              {friendRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={request.from.avatar}
                      alt={request.from.username}
                      className="w-12 h-12 rounded-full border-2 border-neon-purple"
                    />
                    <div>
                      <h3 className="text-text-primary font-semibold">{request.from.username}</h3>
                      <p className="text-sm text-text-secondary">
                        {new Date(request.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAcceptRequest(request._id)}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Accept
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="glass-card">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            My Friends ({friends.length})
          </h2>

          {friends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <motion.div
                  key={friend._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass p-4 rounded-xl flex items-center gap-4"
                >
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="w-14 h-14 rounded-full border-2 border-neon-blue"
                  />
                  <div className="flex-1">
                    <h3 className="text-text-primary font-semibold">{friend.username}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          friend.status === 'online'
                            ? 'bg-neon-green animate-pulse'
                            : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-text-secondary capitalize">{friend.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary py-8">
              No friends yet. Search and add friends to start playing together!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FriendsPage;
