import { UserService } from '../services/user.service.js';
import { ResponseUtil } from '../common/utils/response.util.js';
import { LoggerUtil } from '../common/utils/logger.util.js';

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    return ResponseUtil.success(res, { user });
  } catch (error) {
    LoggerUtil.error('Get user by ID error:', error);
    return ResponseUtil.notFound(res, error.message);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return ResponseUtil.badRequest(res, 'Search query is required');
    }

    const users = await UserService.searchUsers(q, req.user._id);
    return ResponseUtil.success(res, { users });
  } catch (error) {
    LoggerUtil.error('Search users error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    
    if (!friendId) {
      return ResponseUtil.badRequest(res, 'Friend ID is required');
    }

    const result = await UserService.addFriend(req.user._id, friendId);
    return ResponseUtil.success(res, result, 'Friend added successfully');
  } catch (error) {
    LoggerUtil.error('Add friend error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const result = await UserService.removeFriend(req.user._id, friendId);
    return ResponseUtil.success(res, result, 'Friend removed successfully');
  } catch (error) {
    LoggerUtil.error('Remove friend error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await UserService.getFriends(req.user._id);
    return ResponseUtil.success(res, { friends });
  } catch (error) {
    LoggerUtil.error('Get friends error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await UserService.updateProfile(req.user._id, updates);
    return ResponseUtil.success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    LoggerUtil.error('Update profile error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

// Stub functions for friend requests (to be implemented later)
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    // TODO: Implement friend request system
    return ResponseUtil.success(res, null, 'Friend request accepted');
  } catch (error) {
    LoggerUtil.error('Accept friend request error:', error);
    return ResponseUtil.badRequest(res, error.message);
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    // TODO: Implement friend request system
    return ResponseUtil.success(res, { requests: [] });
  } catch (error) {
    LoggerUtil.error('Get friend requests error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserService.getUserById(userId);
    
    const stats = {
      level: user.level,
      xp: user.xp,
      friendsCount: user.friends?.length || 0,
      // TODO: Add game stats from GameHistory
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
    };
    
    return ResponseUtil.success(res, { stats });
  } catch (error) {
    LoggerUtil.error('Get user stats error:', error);
    return ResponseUtil.serverError(res, error.message);
  }
};
