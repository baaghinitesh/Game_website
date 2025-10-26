# Backend Structure Documentation

## Overview
The backend has been restructured into a scalable, layered architecture following best practices for maintainability and extensibility.

## Architecture Layers

### 1. Core Layer (`server/core/`)
Application-wide configuration, constants, and types.

```
server/core/
├── config/
│   └── app.config.js         # Centralized application configuration
├── constants/
│   └── api.constants.js      # HTTP status codes, API messages, socket events
└── index.js                  # Barrel exports
```

**Key Features:**
- `AppConfig`: Centralized configuration for app, server, database, JWT, CORS, Socket.io
- `HTTP_STATUS`: Standard HTTP status codes
- `API_MESSAGES`: Consistent API response messages
- `SOCKET_EVENTS`: Socket.io event constants

### 2. Common Layer (`server/common/`)
Reusable utilities, middlewares, and validators.

```
server/common/
├── utils/
│   ├── response.util.js      # Standardized API responses
│   ├── logger.util.js        # Enhanced logging utility
│   └── index.js              # Barrel exports
└── validators/
    ├── auth.validator.js     # Authentication validation
    └── index.js              # Barrel exports
```

**Key Features:**
- `ResponseUtil`: Standardized success/error responses
- `LoggerUtil`: Enhanced logging with emoji indicators
- `AuthValidator`: Input validation for authentication

### 3. Service Layer (`server/services/`)
Business logic separated from controllers.

```
server/services/
├── auth.service.js           # Authentication business logic
├── game.service.js           # Game management logic
├── user.service.js           # User management logic
└── index.js                  # Barrel exports
```

**Key Features:**
- `AuthService`: Register, login, logout, guest login, profile
- `GameService`: Game CRUD, sessions, leaderboard, history
- `UserService`: User management, friends, profile updates

### 4. Controller Layer (`server/controllers/`)
HTTP request handlers (thin layer).

```
server/controllers/
├── authController.js         # Auth endpoints
├── gameController.js         # Game endpoints
└── userController.js         # User endpoints
```

**Key Features:**
- Validates input using validators
- Calls service layer for business logic
- Returns standardized responses using ResponseUtil

### 5. Route Layer (`server/routes/`)
API endpoint definitions.

```
server/routes/
├── auth.js                   # /api/auth routes
├── games.js                  # /api/games routes
└── users.js                  # /api/users routes
```

### 6. Model Layer (`server/models/`)
Database schemas and models (unchanged).

```
server/models/
├── User.js
├── Game.js
├── GameSession.js
├── GameHistory.js
├── Achievement.js
└── index.js
```

### 7. Plugin System (`server/plugins/`)
Game plugin architecture (unchanged).

```
server/plugins/
├── GamePluginRegistry.js
├── games/
│   ├── tictactoe.plugin.js
│   ├── snake.plugin.js
│   ├── memorymatch.plugin.js
│   ├── 2048.plugin.js
│   └── flappy.plugin.js
└── loadGames.js
```

## Benefits of New Structure

### 1. Separation of Concerns
- Controllers handle HTTP requests/responses
- Services contain business logic
- Validators handle input validation
- Utilities provide reusable functions

### 2. Testability
- Services can be unit tested independently
- Controllers can be tested with mocked services
- Validators can be tested in isolation

### 3. Reusability
- Services can be called from controllers, sockets, or other services
- Utilities are shared across the entire backend
- Constants ensure consistency

### 4. Maintainability
- Clear structure makes it easy to locate code
- Consistent patterns across all modules
- Centralized configuration

### 5. Scalability
- Easy to add new services
- New validators can be added per feature
- Utilities grow as needed

## Code Examples

### Using ResponseUtil
```javascript
// Success response
return ResponseUtil.success(res, { user }, 'User created');

// Error response
return ResponseUtil.badRequest(res, 'Invalid input', errors);
```

### Using LoggerUtil
```javascript
LoggerUtil.success('User logged in successfully');
LoggerUtil.error('Database connection failed', error);
LoggerUtil.info('Processing request...');
```

### Service Pattern
```javascript
// In service
export class AuthService {
  static async login(credentials) {
    // Business logic here
    return { token, user };
  }
}

// In controller
export const login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    return ResponseUtil.success(res, result);
  } catch (error) {
    return ResponseUtil.unauthorized(res, error.message);
  }
};
```

## Migration Notes

### What Changed
1. **Controllers**: Now thin layers that delegate to services
2. **Services**: New layer containing all business logic
3. **Utilities**: New response and logger utilities
4. **Configuration**: Centralized in `core/config/app.config.js`
5. **Constants**: Moved to `core/constants/`

### What Stayed the Same
1. Models and database schemas
2. Route definitions
3. Middleware (auth, etc.)
4. Socket.io handlers (updated to use new utilities)
5. Plugin system

## Future Enhancements

1. **Repositories**: Data access layer for database operations
2. **DTOs**: Data Transfer Objects for type safety
3. **Request/Response Types**: TypeScript definitions
4. **Error Classes**: Custom error types
5. **Middleware**: Additional validation and security middleware
6. **Testing**: Unit and integration tests for all layers

## Running the Application

The application runs exactly as before:
```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend

# Both
npm run dev
```

## Environment Configuration

All configuration is now centralized in `AppConfig`. Update `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/gaming-platform
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

