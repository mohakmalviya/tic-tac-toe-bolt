# 📱 Mobile App Build Guide - Tic Tac Toe Multiplayer

This guide will help you build and deploy your React Native Expo tic-tac-toe game as a mobile application.

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v18 or higher) - Already installed ✅
2. **Expo CLI** - Install globally:
   ```bash
   npm install -g @expo/cli
   ```
3. **EAS CLI** - For building:
   ```bash
   npm install -g eas-cli
   ```

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test on Device**
   - Install **Expo Go** app on your phone
   - Scan the QR code from terminal
   - Or use Android/iOS simulator

## 🏗️ Building for Production

### Step 1: Setup EAS Account
```bash
# Login to Expo account (create one if needed)
eas login

# Initialize EAS project
eas init --id your-project-id-here
```

### Step 2: Configure Your App

1. **Update Bundle Identifiers** in `app.json`:
   - iOS: `"bundleIdentifier": "com.yourname.tictactoebolt"`
   - Android: `"package": "com.yourname.tictactoebolt"`

2. **Add Required Assets** (optional but recommended):
   - App icon: `assets/images/icon.png` (1024x1024)
   - Splash screen: `assets/images/splash.png` (1284x2778)
   - Adaptive icon: `assets/images/adaptive-icon.png` (1024x1024)

### Step 3: Build Your App

#### For Testing (APK - Android only)
```bash
npm run build:android
```

#### For Both Platforms
```bash
npm run build:all
```

#### For Production/App Store
```bash
npm run build:production
```

## 📲 Installation Methods

### Method 1: Direct APK Install (Android)
1. Build APK: `npm run build:android`
2. Download APK from Expo dashboard
3. Install on Android device (enable "Unknown sources")

### Method 2: Expo Go (Development)
1. Run: `npm run dev`
2. Install **Expo Go** app
3. Scan QR code

### Method 3: Development Build
1. Build development version: `eas build --profile development`
2. Install development client on device
3. Run: `expo start --dev-client`

## 🔧 Configuration Options

### Build Profiles (eas.json)

- **development**: For development with dev tools
- **preview**: For testing (APK/IPA files)
- **production**: For app store deployment

### Environment Variables

Make sure your `.env` file is properly configured:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment to App Stores

### Android (Google Play Store)
1. Build AAB: `eas build --platform android --profile production`
2. Use EAS Submit: `eas submit --platform android`
3. Or manually upload to Google Play Console

### iOS (App Store)
1. Build IPA: `eas build --platform ios --profile production`
2. Use EAS Submit: `eas submit --platform ios`
3. Or manually upload to App Store Connect

## 🛠️ Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx expo start --clear
   ```

2. **Build failures**:
   - Check bundle identifiers are unique
   - Ensure all dependencies are compatible
   - Review build logs in Expo dashboard

3. **Supabase connection issues**:
   - Verify environment variables
   - Test network connectivity
   - Check Supabase URL and keys

### Performance Optimization

1. **Enable ProGuard** (Android) - Already configured in `app.json`
2. **Optimize images** - Use WebP format when possible
3. **Bundle analysis**:
   ```bash
   npx expo export --platform android
   ```

## 📝 Build Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build:android` | Build Android APK |
| `npm run build:ios` | Build iOS app |
| `npm run build:all` | Build for both platforms |
| `npm run build:production` | Production build |

## 🎮 Game Features

Your mobile app includes:
- ✅ Local multiplayer gameplay
- ✅ Online multiplayer with Supabase
- ✅ Real-time synchronization
- ✅ Room-based multiplayer
- ✅ Automatic cleanup
- ✅ Beautiful gradient UI
- ✅ Piece lifecycle mechanics
- ✅ Score tracking

## 📞 Support

If you encounter any issues:
1. Check Expo documentation: https://docs.expo.dev/
2. Review build logs in Expo dashboard
3. Test on Expo Go first before building
4. Ensure all environment variables are set correctly

---

**Happy Building! 🚀**

Your tic-tac-toe multiplayer game is ready to be deployed as a mobile app! 