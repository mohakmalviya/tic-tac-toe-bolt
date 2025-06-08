# Contributing to Tic-Tac-Toe Bolt

Thank you for your interest in contributing! This guide will help you set up the development environment and understand how to contribute to the project.

## 🚀 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account (for multiplayer functionality)
- Git

### Installation

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/tic-tac-toe-bolt.git
   cd tic-tac-toe-bolt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database setup SQL** in your Supabase SQL editor:
   ```sql
   -- Create rooms table
   CREATE TABLE rooms (
     id TEXT PRIMARY KEY,
     host_id TEXT NOT NULL,
     host_name TEXT NOT NULL,
     guest_id TEXT,
     guest_name TEXT,
     status TEXT NOT NULL DEFAULT 'waiting',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create game_states table
   CREATE TABLE game_states (
     id BIGSERIAL PRIMARY KEY,
     room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
     board JSONB NOT NULL,
     current_player TEXT NOT NULL,
     move_count INTEGER NOT NULL DEFAULT 0,
     game_over BOOLEAN NOT NULL DEFAULT FALSE,
     winner TEXT,
     winning_line JSONB,
     scores JSONB NOT NULL DEFAULT '{"X": 0, "O": 0}',
     turn_start_time TIMESTAMP WITH TIME ZONE,
     turn_time_limit INTEGER DEFAULT 15,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable real-time subscriptions
   ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
   ALTER PUBLICATION supabase_realtime ADD TABLE game_states;
   ```

3. **Configure RLS policies** (optional, for additional security):
   ```sql
   -- Enable RLS
   ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
   ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

   -- Allow all operations for now (customize as needed)
   CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
   CREATE POLICY "Allow all operations on game_states" ON game_states FOR ALL USING (true);
   ```

4. **Get your credentials**:
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon public key
   - Add them to your `.env` file

## 📱 Building for Mobile

### Development Build
```bash
# For iOS (requires macOS and Xcode)
npx expo run:ios

# For Android (requires Android Studio)
npx expo run:android
```

### Production Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure and build
eas build --platform android
eas build --platform ios
```

For detailed mobile build instructions, see [README-MOBILE-BUILD.md](README-MOBILE-BUILD.md).

## 🔧 Technical Architecture

### Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **State Management**: React Context API
- **Styling**: React Native StyleSheet with responsive design
- **Animations**: React Native Animated API

### Key Components

#### Core Components
- `SupabaseMultiplayerContext`: Manages real-time multiplayer functionality
- `GameBoard`: Renders the interactive game grid with animations
- `TurnTimer`: Handles turn-based timing mechanics
- `GameStatus`: Displays current game state and player information
- `OpponentDisconnectedModal`: Manages disconnection scenarios

#### File Structure
```
src/
├── app/
│   └── (tabs)/
│       └── multiplayer.tsx      # Main multiplayer game screen
├── components/
│   ├── GameBoard.tsx           # Interactive game grid
│   ├── GameStatus.tsx          # Game state display
│   ├── GameControls.tsx        # Game control buttons
│   └── TurnTimer.tsx           # Turn timing component
├── contexts/
│   └── SupabaseMultiplayerContext.tsx  # Multiplayer state management
├── utils/
│   ├── gameLogic.ts            # Core game logic
│   └── supabase.ts             # Database configuration
└── types/
    └── game.ts                 # TypeScript type definitions
```

### Features Implementation

#### Real-time Synchronization
- Uses Supabase real-time subscriptions for instant updates
- Server-side timestamp management for consistent timing
- Optimistic updates with rollback on failure

#### Random Matchmaking
- Automatic pairing with available opponents
- Room creation and joining logic
- Fallback room creation if no matches found

#### Opponent Disconnection Handling
- Smart detection of player disconnections
- Reconnection options and graceful degradation
- Automatic room cleanup for abandoned games

#### Timer Synchronization
- Server-side turn start timestamps
- Client-side countdown with server validation
- Automatic timeout handling and turn switching

## 🐛 Known Issues & Workarounds

### Layout Issues
- **Problem**: UI elements overlapping on certain devices (e.g., Samsung S23 Ultra)
- **Workaround**: Dynamic layout adjustments based on screen dimensions
- **Files affected**: `app/(tabs)/multiplayer.tsx`, component styles

### Timer Stability
- **Problem**: Game elements moving when timer shows/hides
- **Current solution**: Fixed positioning and minimum height constraints
- **Future improvement**: Consider absolute positioning for timer elements

### Performance Considerations
- Real-time subscriptions can be resource-intensive on slower devices
- Consider debouncing rapid state updates
- Optimize re-renders in game components

## 🤝 How to Contribute

### 1. Choose an Issue
- Look for issues labeled `good first issue` for beginners
- Check existing issues or create a new one for bugs/features
- Comment on the issue to let others know you're working on it

### 2. Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Add tests if applicable
# Ensure code follows project conventions

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request
```

### 3. Code Style Guidelines
- Use TypeScript for type safety
- Follow React Native best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design works on various screen sizes

### 4. Testing
- Test on both iOS and Android if possible
- Test multiplayer functionality with multiple devices/browsers
- Verify timer synchronization works correctly
- Test disconnection/reconnection scenarios

### 5. Pull Request Guidelines
- Provide a clear description of changes
- Include screenshots/videos for UI changes
- Reference related issues with `Fixes #issue-number`
- Ensure CI/CD checks pass
- Be responsive to code review feedback

## 📋 Development Checklist

Before submitting a PR, ensure:
- [ ] Code builds without errors
- [ ] No TypeScript errors
- [ ] App runs on both iOS and Android
- [ ] Real-time multiplayer functionality works
- [ ] Timer synchronization is accurate
- [ ] UI is responsive on different screen sizes
- [ ] No console errors or warnings
- [ ] Code follows project style guidelines
- [ ] Documentation updated if needed

## 🆘 Getting Help

### Debugging Tips
1. **Supabase Connection Issues**:
   - Check your `.env` file configuration
   - Verify Supabase project settings
   - Check network connectivity

2. **Real-time Not Working**:
   - Ensure real-time subscriptions are enabled in Supabase
   - Check browser console for WebSocket errors
   - Verify table policies allow required operations

3. **Timer Sync Issues**:
   - Check server timestamps in database
   - Verify timezone handling
   - Test with multiple devices

### Support Channels
- Create an issue for bugs or feature requests
- Check existing issues for similar problems
- Review the troubleshooting section above

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Real-time functionality powered by [Supabase](https://supabase.com/)
- UI inspiration from modern mobile game design patterns

---

Thank you for contributing to Tic-Tac-Toe Bolt! 🎮 