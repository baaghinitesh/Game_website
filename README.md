# GameZone - Scalable 3D Gaming Platform 🎮

A modern, futuristic gaming platform built with the MERN stack featuring real-time multiplayer, 3D effects, and a scalable plugin architecture.

## ✨ Features

### Core Features
- 🎯 **Scalable Plugin Architecture** - Easy to add new games without modifying core code
- 🔄 **Real-time Multiplayer** - Socket.io powered multiplayer gaming
- 🎨 **Futuristic 3D UI** - Dark theme with neon glows, glassmorphism, and particle effects
- 👥 **Social Gaming** - Friend system, invites, and online status
- 🏆 **Gamification** - XP system, levels, badges, and achievements
- 👤 **Flexible Authentication** - Sign up, login, or play as guest
- 📊 **Stats & History** - Track your gaming performance

### Tech Stack

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS (custom futuristic theme)
- Framer Motion (animations)
- Socket.io Client (real-time)
- Zustand (state management)
- React Three Fiber (3D capabilities)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (WebSocket)
- JWT Authentication
- Scalable Plugin Registry

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (v5.0+)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://admin:password@localhost:27017/gaming_platform?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. **Seed the Database**
```bash
node server/seed.js
```

4. **Run the Application**
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend only (port 3000)
npm run dev:backend   # Backend only (port 5000)
```

5. **Access the App**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🎮 Adding New Games

The platform uses a **scalable plugin architecture** that makes adding new games extremely easy!

### Backend Plugin (Server-side game logic)

1. Create a new plugin file in `server/plugins/games/yourgame.plugin.js`:

```javascript
const YourGamePlugin = {
  id: 'yourgame',
  name: 'Your Game Name',
  category: 'puzzle', // arcade, puzzle, card, racing, strategy, quiz
  minPlayers: 1,
  maxPlayers: 4,

  initializeState() {
    return {
      // Your initial game state
    };
  },

  validateMove(state, move) {
    // Validate if move is legal
    return { valid: true };
  },

  processGameLogic(state, move) {
    // Process the move and return new state
    return newState;
  },

  calculateWinner(state) {
    // Determine if there's a winner
    return winner;
  },
};

export default YourGamePlugin;
```

2. Register it in `server/plugins/loadGames.js`:

```javascript
import YourGamePlugin from './games/yourgame.plugin.js';

export const loadAllGamePlugins = () => {
  gameRegistry.register(YourGamePlugin);
  // ... other games
};
```

### Frontend Plugin (UI Component)

1. Create a game component in `src/games/YourGame/YourGameComponent.tsx`:

```tsx
import { GameComponentProps } from '../../types';

const YourGameComponent = ({ roomId, isMultiplayer, onGameEnd }: GameComponentProps) => {
  // Your game UI logic
  return (
    <div>
      {/* Your game UI */}
    </div>
  );
};

export default YourGameComponent;
```

2. Register it in `src/games/loadGames.tsx`:

```tsx
import YourGameComponent from './YourGame/YourGameComponent';

frontendGameRegistry.register({
  id: 'yourgame',
  name: 'Your Game Name',
  category: 'puzzle',
  minPlayers: 1,
  maxPlayers: 4,
  isMultiplayer: true,
  component: YourGameComponent,
});
```

3. Add game to database (manually or via seed):

```javascript
{
  name: 'Your Game Name',
  slug: 'yourgame',
  description: 'Description of your game',
  category: 'puzzle',
  thumbnail: 'url-to-thumbnail',
  pluginId: 'yourgame',
  componentPath: '/games/YourGame/YourGameComponent',
  isMultiplayer: true,
  featured: true,
}
```

**That's it!** Your game is now fully integrated into the platform! 🎉

## 🏗️ Architecture

### Plugin System Benefits

1. **Separation of Concerns** - Each game is isolated
2. **Easy Maintenance** - Bugs in one game don't affect others
3. **Scalability** - Add unlimited games without core modifications
4. **Hot-swappable** - Enable/disable games dynamically
5. **Type Safety** - Full TypeScript support

### Real-time Communication Flow

```
Client (Socket.io) ↔ Server (Socket.io) ↔ Game Plugin Registry ↔ MongoDB
```

1. Player makes a move (frontend)
2. Move sent via Socket.io to server
3. Server validates move using game plugin
4. Plugin processes game logic
5. New state broadcasted to all players
6. Frontend updates UI in real-time

## 📁 Project Structure

```
gaming-platform/
├── server/                  # Backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, etc.
│   ├── plugins/            # GAME PLUGIN SYSTEM ⭐
│   │   ├── GamePluginRegistry.js
│   │   ├── games/          # Individual game plugins
│   │   └── loadGames.js
│   ├── sockets/            # Socket.io handlers
│   └── index.js            # Server entry
│
├── src/                    # Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── games/              # GAME PLUGIN SYSTEM ⭐
│   │   ├── GamePluginRegistry.tsx
│   │   ├── TicTacToe/      # Example game
│   │   └── loadGames.tsx
│   ├── services/           # API & Socket services
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript definitions
│   ├── styles/             # Global styles
│   └── App.tsx             # App entry
│
└── package.json
```

## 🎨 UI/UX Features

- **Glassmorphism** - Translucent glass-like panels
- **Neon Glows** - Vibrant blue, purple, pink accents
- **3D Tilt Effects** - Interactive card rotations
- **Particle Background** - Animated floating particles
- **Smooth Animations** - Framer Motion powered
- **Responsive Design** - Mobile-friendly layouts

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Guest mode for anonymous play
- Protected API routes
- Input validation

## 🚀 Deployment

### Environment Variables
Ensure all production environment variables are set:
- `MONGODB_URI` - Production MongoDB connection
- `JWT_SECRET` - Strong secret key
- `NODE_ENV=production`
- `FRONTEND_URL` - Production frontend URL

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm run server
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/guest` - Guest login
- `GET /api/auth/profile` - Get user profile

### Games
- `GET /api/games` - List all games
- `GET /api/games/category/:category` - Games by category
- `POST /api/games/session` - Create game session
- `POST /api/games/session/:roomId/join` - Join session

### Users
- `POST /api/users/friends` - Add friend
- `GET /api/users/friends` - Get friends list
- `GET /api/users/stats` - Get user statistics

## 🎯 Future Enhancements

- More games (Chess, Card games, Racing, etc.)
- Tournament system
- Voice chat integration
- Game recording and replay
- Mobile app (React Native)
- AI opponents
- Custom avatars and themes

## 📄 License

MIT License - Feel free to use this project for learning and building your own gaming platform!

## 👥 Contributing

Contributions are welcome! To add a new game:
1. Follow the plugin architecture guide above
2. Test thoroughly
3. Submit a pull request

## 🙏 Acknowledgments

Built with modern web technologies and a focus on scalability and developer experience.

---

**Happy Gaming! 🎮✨**
