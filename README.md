# Tic-Tac-Toe Bolt 🎮

A modern, feature-rich Tic-Tac-Toe game built with React Native and Expo. This isn't your ordinary Tic-Tac-Toe - it features innovative gameplay mechanics, beautiful theming, and both local and online multiplayer modes.

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

### Core Gameplay
- **Real-time Multiplayer**: Play with friends or random opponents in real-time
- **Turn Timer**: 15-second turn limit keeps games moving
- **Score Tracking**: Persistent score tracking across multiple rounds
- **Auto-restart**: Games automatically restart after completion
- **Responsive Design**: Optimized for various screen sizes and devices

### UI/UX Features
- **Beautiful Animations**: Smooth card flips, winning line animations, and transitions
- **Modern Design**: Clean, intuitive interface with gradient backgrounds
- **Dynamic Status**: Real-time game status updates and notifications
- **Device Optimization**: Specially optimized for various Android and iOS devices

## 📱 Screenshots

<div align="center">
  <img src="./assets/images/Screenshot_20250609_113328_Tic-Tac-Toe Bolt.jpg" alt="Game Board View" width="300"/>
  <img src="./assets/images/Screenshot_20250609_113414_Tic-Tac-Toe Bolt.jpg" alt="Multiplayer Lobby" width="300"/>
  <img src="./assets/images/Screenshot_20250609_113443_Tic-Tac-Toe Bolt.jpg" alt="Game In Progress" width="300"/>
</div>

*Game screenshots showing the modern UI, multiplayer lobby, and gameplay*

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

### Multiplayer Modes
- **Create Room**: Host a game and share the room code with friends
- **Join Room**: Enter a room code to join an existing game
- **Random Matchmaking**: Get matched with random opponents instantly
- **Opponent Management**: Smart handling of opponent connections and disconnections

### Game Rules
- Players take turns placing X's and O's on a 3x3 grid
- First player to get three symbols in a row (horizontally, vertically, or diagonally) wins
- Each turn has a 15-second time limit
- If time runs out, the current player automatically loses
- Games automatically restart after completion

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
# Clear cache and restart
npx expo start --clear
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions and contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ using React Native and Expo**
