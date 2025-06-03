export const COLORS = {
  primary: '#3B82F6', // Blue
  primaryLight: '#93C5FD',
  primaryDark: '#1D4ED8',
  
  secondary: '#F97316', // Orange
  secondaryLight: '#FDBA74',
  secondaryDark: '#C2410C',
  
  background: '#F8FAFC',
  backgroundDark: '#E2E8F0',
  
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  
  border: '#E2E8F0',
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
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7.84,
    elevation: 6,
  },
};