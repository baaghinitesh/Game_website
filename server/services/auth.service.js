import { User } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { LoggerUtil } from '../common/utils/logger.util.js';

export class AuthService {
  static async register(userData) {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw new Error(`${field} already ${field === 'Email' ? 'registered' : 'taken'}`);
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });

    await user.save();
    LoggerUtil.success(`New user registered: ${username}`);

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: this.formatUserResponse(user),
    };
  }

  static async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update status
    user.status = 'online';
    user.lastOnline = new Date();
    await user.save();

    LoggerUtil.success(`User logged in: ${user.username}`);

    // Generate token
    const token = generateToken(user._id);

    return {
      token,
      user: this.formatUserResponse(user),
    };
  }

  static async guestLogin() {
    const guestId = uuidv4();
    const guestUsername = `Guest_${guestId.substring(0, 8)}`;

    // Create guest user
    const guestUser = new User({
      username: guestUsername,
      email: `${guestId}@guest.local`,
      password: guestId,
      isGuest: true,
      guestId,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestId}`,
    });

    await guestUser.save();
    LoggerUtil.info(`Guest account created: ${guestUsername}`);

    // Generate token
    const token = generateToken(guestUser._id);

    return {
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        avatar: guestUser.avatar,
        isGuest: true,
        guestId,
      },
    };
  }

  static async logout(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.status = 'offline';
      user.lastOnline = new Date();
      await user.save();
      LoggerUtil.info(`User logged out: ${user.username}`);
    }
  }

  static async getProfile(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('friends', 'username avatar status');

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserResponse(user);
  }

  static formatUserResponse(user) {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      friends: user.friends,
      status: user.status,
      isGuest: user.isGuest,
    };
  }
}

export default AuthService;
