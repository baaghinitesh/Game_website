import { User } from '../models/index.js';

export const addFriend = async (req, res) => {
  try {
    const { friendUsername } = req.body;
    const userId = req.user._id;

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (friend._id.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as friend' });
    }

    const user = await User.findById(userId);

    // Check if already friends
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if friend request already exists
    const requestExists = friend.friendRequests.some(
      req => req.from.toString() === userId.toString()
    );

    if (requestExists) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request
    friend.friendRequests.push({
      from: userId,
      sentAt: new Date(),
    });

    await friend.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const requestIndex = user.friendRequests.findIndex(
      req => req._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const friendId = user.friendRequests[requestIndex].from;

    // Add to both users' friend lists
    user.friends.push(friendId);
    user.friendRequests.splice(requestIndex, 1);

    const friend = await User.findById(friendId);
    friend.friends.push(userId);

    await Promise.all([user.save(), friend.save()]);

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'username avatar status lastOnline');

    res.json({ friends: user.friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.from', 'username avatar');

    res.json({ friendRequests: user.friendRequests });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query too short' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      isGuest: false,
    })
      .select('username avatar status')
      .limit(10);

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('username avatar xp level badges')
      .populate('badges');

    // Get additional stats from GameHistory
    const GameHistory = (await import('../models/index.js')).GameHistory;
    
    const stats = await GameHistory.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalWins: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
          },
          totalScore: { $sum: '$score' },
        }
      }
    ]);

    const userStats = stats[0] || { totalGames: 0, totalWins: 0, totalScore: 0 };

    res.json({
      user: {
        username: user.username,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
      stats: userStats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
