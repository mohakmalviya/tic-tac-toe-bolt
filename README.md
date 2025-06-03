# Tic-Tac-Toe Special Edition 🎮

A modern React Native tic-tac-toe game with unique piece lifecycle mechanics and **real-time multiplayer** support!

## 🌟 Features

### Game Mechanics
- **Special Piece Lifecycle**: Pieces go through Active → Shadowed → Removed states
- **Smart Shadowing**: When both players have 3 pieces, the opponent's oldest piece becomes shadowed
- **Strategic Depth**: Plan your moves considering future piece removals

### Multiplayer Support
- **Real-time multiplayer** using Socket.io
- **Room-based gameplay** with 6-character room codes
- **Cross-platform** - play with friends on any device
- **Local and online modes** available

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Mobile device with Expo Go app or Android/iOS simulator

### Running the Game

#### 1. Start the Multiplayer Server
```bash
# In the project root directory
node server.js
```
The server will start on `http://localhost:3001`

#### 2. Start the Mobile App
```bash
# In another terminal
npx expo start
```

#### 3. Open the App
- **Mobile**: Scan the QR code with Expo Go
- **Web**: Press `w` to open in browser
- **Android Emulator**: Press `a`
- **iOS Simulator**: Press `i`

## 🎯 How to Play

### Local Mode
1. Select "Local Game" on the main screen
2. Take turns placing X and O pieces
3. When you have 3 pieces and your opponent has 3, their oldest piece becomes shadowed
4. Shadowed pieces are removed when that player makes their next move
5. First to get 3 in a row wins!

### Multiplayer Mode
1. Select "Multiplayer" on the main screen
2. **Create Room**: Enter your name and create a new room
3. **Join Room**: Enter your name and a 6-character room code
4. Share the room code with your friend
5. Play in real-time with the same rules as local mode!

## 🔧 Technical Details

### Architecture
- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express and Socket.io
- **State Management**: React Context API
- **Real-time Communication**: WebSockets

### Project Structure
```
├── app/                    # Main app screens
├── components/            # Reusable UI components
├── contexts/             # React Context providers
├── types/               # TypeScript type definitions
├── utils/              # Game logic utilities
├── constants/         # Theme and styling constants
└── server.js         # Multiplayer server
```

### Key Components
- `MultiplayerLobby`: Room creation and joining interface
- `GameBoard`: Interactive game board with piece rendering
- `GameStatus`: Real-time game status and player info
- `GameControls`: Game actions (reset, new game)

## 🌐 Multiplayer Features

### Room Management
- **Unique Room Codes**: 6-character alphanumeric codes
- **Host Controls**: Room creator can start new games
- **Player Identification**: Clear "You" vs "Opponent" labeling
- **Real-time Updates**: Instant move synchronization

### Connection Handling
- **Auto-reconnection**: Handles network interruptions
- **Connection Status**: Visual indicators for connection state
- **Error Handling**: User-friendly error messages

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Visual Feedback**: Smooth animations and clear piece states
- **Responsive Layout**: Works on phones, tablets, and web
- **Accessibility**: Clear labels and high contrast colors

## 🐛 Troubleshooting

### Server Issues
```bash
# If port 3001 is in use:
lsof -ti:3001 | xargs kill -9
node server.js
```

### Connection Problems
- Ensure server is running on port 3001
- Check firewall settings for port 3001
- For production, update `SERVER_URL` in `MultiplayerContext.tsx`

### App Won't Start
```bash
# Clear Expo cache
expo start -c

# Reset node modules
rm -rf node_modules
npm install
```

## 🚢 Deployment

### Server Deployment
1. Deploy server to your preferred platform (Heroku, Railway, etc.)
2. Update `SERVER_URL` in `contexts/MultiplayerContext.tsx`
3. Ensure WebSocket support is enabled

### App Deployment
```bash
# Build for production
expo build:android
expo build:ios
```

## 🤝 Contributing

Feel free to contribute! Some ideas:
- Add player profiles and avatars
- Implement spectator mode
- Add game replay functionality
- Create tournaments and leaderboards

## 📱 Compatible Platforms

- ✅ iOS (Expo Go / Native)
- ✅ Android (Expo Go / Native)
- ✅ Web Browser
- ✅ Cross-platform multiplayer

---

Enjoy playing Tic-Tac-Toe Special Edition! 🎉
