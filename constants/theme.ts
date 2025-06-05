export interface ColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundDark: string;
  
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  
  border: string;
  borderLight: string;
  shadowPiece: string;
  
  success: string;
  error: string;
  warning: string;
  
  white: string;
  black: string;
  
  xColor: string;
  oColor: string;
  xShadow: string;
  oShadow: string;
  
  // Card and surface colors
  cardBackground: string;
  surfaceElevated: string;
  
  // Navigation and tabs
  tabBackground: string;
  tabInactive: string;
}

export const LIGHT_COLORS: ColorScheme = {
  primary: '#3B82F6', // Blue
  primaryLight: '#93C5FD',
  primaryDark: '#1D4ED8',
  
  secondary: '#F97316', // Orange
  secondaryLight: '#FDBA74',
  secondaryDark: '#C2410C',
  
  background: '#E0F2FE', // Light cyan background
  backgroundSecondary: '#FEF3C7', // Light yellow background
  backgroundTertiary: '#F3E8FF', // Light purple background
  backgroundDark: '#ECFDF5', // Light green background
  
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textInverse: '#FFFFFF',
  
  border: '#E8EBF7', // Matching the blue tint theme
  borderLight: '#F4F6FC',
  shadowPiece: '#94A3B8',
  
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  
  white: '#FFFFFF',
  black: '#000000',
  
  xColor: '#3B82F6', // Blue for X
  oColor: '#F97316', // Orange for O
  xShadow: '#93C5FD', // Light blue for shadowed X
  oShadow: '#FDBA74', // Light orange for shadowed O
  
  cardBackground: '#FFFFFF', // Clean white for cards
  surfaceElevated: '#FFFFFF',
  
  tabBackground: '#FFFFFF',
  tabInactive: '#94A3B8',
};

export const DARK_COLORS: ColorScheme = {
  primary: '#60A5FA', // Lighter blue for dark mode
  primaryLight: '#93C5FD',
  primaryDark: '#2563EB',
  
  secondary: '#FB923C', // Lighter orange for dark mode
  secondaryLight: '#FDBA74',
  secondaryDark: '#EA580C',
  
  background: '#0F172A', // Dark slate
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  backgroundDark: '#0B1426',
  
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textInverse: '#1E293B',
  
  border: '#334155',
  borderLight: '#475569',
  shadowPiece: '#64748B',
  
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  
  white: '#FFFFFF',
  black: '#000000',
  
  xColor: '#60A5FA', // Lighter blue for X in dark mode
  oColor: '#FB923C', // Lighter orange for O in dark mode
  xShadow: '#1E40AF', // Darker blue for shadowed X
  oShadow: '#C2410C', // Darker orange for shadowed O
  
  cardBackground: '#1E293B',
  surfaceElevated: '#334155',
  
  tabBackground: '#1E293B',
  tabInactive: '#64748B',
};

// Legacy export for backward compatibility - will be replaced by theme context
export const COLORS = LIGHT_COLORS;

// Font fallback helper for production builds
export const getFontFamily = (fontWeight: 'regular' | 'medium' | 'bold') => {
  // In production, fonts might fail to load, so we provide fallbacks
  const fontMap = {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium', 
    bold: 'Poppins-Bold',
  };
  
  return fontMap[fontWeight];
};

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  bold: 'Poppins-Bold',
};

export const SIZES = {
  xSmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
  
  // Game specific sizes
  cellSize: 80,
  boardMargin: 16,
  pieceStrokeWidth: 4,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.84,
    elevation: 6,
  },
};