# Tic-Tac-Toe Bolt 🎮

A modern, feature-rich Tic-Tac-Toe game built with React Native and Expo. This isn't your ordinary Tic-Tac-Toe - it features innovative gameplay mechanics, beautiful theming, and both local and online multiplayer modes.

## 🌟 Features

### Game Mechanics
- **Special Piece Lifecycle**: Pieces go through Active → Shadowed → Removed states
- **Smart Shadowing**: When both players have 3 pieces, the opponent's oldest piece becomes shadowed
- **Strategic Depth**: Plan your moves considering future piece removals

### Multiplayer Support
- **Real-time multiplayer** using Supabase Realtime
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
- Supabase account (for multiplayer features)

### Setup Environment Variables

1. **Create a `.env` file** in the project root:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **Get your Supabase credentials**:
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Settings → API
   - Copy your Project URL and anon key

### Running the App

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Open the App
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
- **Backend**: Supabase (PostgreSQL + Realtime)
- **State Management**: React Context API
- **Real-time Communication**: Supabase Realtime subscriptions

### Project Structure
```
├── app/                    # Main app screens
├── components/            # Reusable UI components
├── contexts/             # React Context providers
├── types/               # TypeScript type definitions
├── utils/              # Game logic utilities
├── constants/         # Theme and styling constants
└── utils/supabase.ts  # Supabase client configuration
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
- **Real-time Updates**: Instant move synchronization via Supabase Realtime

### Connection Handling
- **Automatic Connection**: Connects to Supabase automatically
- **Connection Status**: Visual indicators for connection state
- **Error Handling**: User-friendly error messages
- **Offline Support**: Local gameplay always available

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Visual Feedback**: Smooth animations and clear piece states
- **Responsive Layout**: Works on phones, tablets, and web
- **Accessibility**: Clear labels and high contrast colors

## 🐛 Troubleshooting

### Supabase Connection Issues
```bash
# Check your environment variables
cat .env

# Restart the development server
npx expo start --clear
```

### Environment Variables
- Ensure your `.env` file has correct Supabase URL and anon key
- Check that environment variables start with `EXPO_PUBLIC_`
- Verify your Supabase project is active and accessible

### App Won't Start
```bash
# Clear cache and restart
npx expo start --clear

# Reset dependencies if needed
rm -rf node_modules
npm install
```

### Multiplayer Not Working
- Verify Supabase credentials in `.env` file
- Check Supabase dashboard for project status
- Ensure real-time features are enabled in your Supabase project

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup instructions and contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ using React Native, Expo, and Supabase**
