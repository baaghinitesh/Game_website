import express from 'express';
import {
  addFriend,
  acceptFriendRequest,
  getFriends,
  getFriendRequests,
  searchUsers,
  getUserStats,
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken); // All user routes require authentication

router.post('/friends', addFriend);
router.post('/friends/accept/:requestId', acceptFriendRequest);
router.get('/friends', getFriends);
router.get('/friends/requests', getFriendRequests);
router.get('/search', searchUsers);
router.get('/stats', getUserStats);

export default router;
