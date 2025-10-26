import { User } from '../models/index.js';
import { LoggerUtil } from '../common/utils/logger.util.js';

export class UserService {
  static async getUserById(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('friends', 'username avatar status');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async searchUsers(query, currentUserId) {
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      ],
    })
      .select('username email avatar status')
      .limit(10);

    return users;
  }

  static async addFriend(userId, friendId) {
    if (userId === friendId) {
      throw new Error('Cannot add yourself as a friend');
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      throw new Error('User not found');
    }

    if (user.friends.includes(friendId)) {
      throw new Error('Already friends');
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await Promise.all([user.save(), friend.save()]);

    LoggerUtil.success(`Friendship created: ${user.username} & ${friend.username}`);

    return {
      user: await this.getUserById(userId),
      friend: await this.getUserById(friendId),
    };
  }

  static async removeFriend(userId, friendId) {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      throw new Error('User not found');
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), friend.save()]);

    LoggerUtil.info(`Friendship removed: ${user.username} & ${friend.username}`);

    return {
      user: await this.getUserById(userId),
    };
  }

  static async getFriends(userId) {
    const user = await User.findById(userId).populate(
      'friends',
      'username avatar status lastOnline'
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user.friends;
  }

  static async updateProfile(userId, updates) {
    const allowedUpdates = ['username', 'email', 'avatar'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    LoggerUtil.success(`Profile updated: ${user.username}`);

    return user;
  }

  static async updateUserStatus(userId, status) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    user.status = status;
    user.lastOnline = new Date();
    await user.save();

    return user;
  }
}

export default UserService;
