export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_MESSAGES = {
  // Auth messages
  AUTH_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  REGISTRATION_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // General messages
  SUCCESS: 'Operation successful',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  
  // Game messages
  GAME_NOT_FOUND: 'Game not found',
  ROOM_NOT_FOUND: 'Room not found',
  ROOM_FULL: 'Room is full',
  INVALID_MOVE: 'Invalid move',
  GAME_ENDED: 'Game has ended',
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Game events
  GAME_JOIN_ROOM: 'game:join-room',
  GAME_LEAVE_ROOM: 'game:leave-room',
  GAME_START: 'game:start',
  GAME_MOVE: 'game:move',
  GAME_STATE: 'game:state',
  GAME_STATE_UPDATE: 'game:state-update',
  GAME_ENDED: 'game:ended',
  GAME_INVALID_MOVE: 'game:invalid-move',
  GAME_ERROR: 'game:error',
  
  // Chat events
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  
  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
};

export default {
  HTTP_STATUS,
  API_MESSAGES,
  SOCKET_EVENTS,
};
